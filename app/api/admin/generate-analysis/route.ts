import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: Request) {
  const supabase = await createClient()

 // TEMPORARY: Skip admin check for testing
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json({ error: 'Not logged in' }, { status: 403 })
}
// TODO: Re-enable admin check after setting up admin role properly

  const { candidateId } = await request.json()

  // Get story candidate
  const { data: story } = await supabase
    .from('story_candidates')
    .select('*')
    .eq('id', candidateId)
    .single()

  if (!story) {
    return NextResponse.json({ error: 'Story not found' }, { status: 404 })
  }

  // Get all concepts for reference
  const { data: concepts } = await supabase
    .from('concepts')
    .select('concept_id, name')

  const conceptsList = concepts?.map(c => `${c.name} (${c.concept_id})`).join(', ') || ''

  const prompt = `You are analyzing a current news event through two theoretical frameworks:

1. MYTHIC ACCELERATION: Contemporary authoritarianism operating through speed, spectacle, and political theology
2. SUFRIMIENTO: The politics of suffering - who suffers, whose suffering is visible/invisible

EVENT:
Headline: ${story.headline}
Source: ${story.source}
Summary: ${story.summary || 'No summary provided'}
URL: ${story.source_url}

ANALYZE THIS EVENT:

## Mythic Acceleration Lens

**Speed:** How does tempo function here? Is judgment prevented by velocity? Are reactions demanded before deliberation is possible? What would slow analysis reveal? (2-3 paragraphs)

**Spectacle:** What images/performances are presented? What material outcomes occurred? Is governance replaced by theater? What are we shown vs. what actually happened? (2-3 paragraphs)

**Political Theology:** Is anything framed as sacred/untouchable? Are opponents framed as heretical? Is the nation framed as body requiring purification? Is there providential framing? (2-3 paragraphs)

## Sufrimiento Lens

**Visible Suffering:** Whose pain is spectacularized? Whose suffering is used to justify action? What emotions are being mobilized? (2 paragraphs)

**Invisible Suffering:** Whose material harm is obscured? What concrete suffering is not being shown? Who bears costs that aren't discussed? (2 paragraphs)

## Practice Prompt

Write a 2-3 sentence prompt for readers: What should they notice today when encountering this type of event? What question should they ask? What pause should they take?

## Related Concepts & Modules

Which concepts relate? Available concepts: ${conceptsList}
Which modules (1-10) explore this?

FORMAT YOUR RESPONSE AS JSON:
{
  "ma_speed": "...",
  "ma_spectacle": "...",
  "ma_theology": "...",
  "suf_visible": "...",
  "suf_invisible": "...",
  "practice_prompt": "...",
  "concept_ids": ["concept-id-1", "concept-id-2"],
  "module_numbers": [1, 3, 4]
}

CRITICAL: 
- Use diagnostic academic tone, not hot takes
- Teach the *mechanics* of how this works
- 2-3 substantive paragraphs per section
- Be specific to this event, not generic theory
- Default to semicolons for complex lists`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

  const analysis = JSON.parse(jsonMatch[0])

    // Map concept_ids from names/strings to actual UUIDs
    let conceptUuids: string[] = []
    if (analysis.concept_ids && analysis.concept_ids.length > 0) {
      const { data: matchedConcepts } = await supabase
        .from('concepts')
        .select('id, concept_id, name')
        .in('concept_id', analysis.concept_ids)
      
      conceptUuids = matchedConcepts?.map(c => c.id) || []
    }

    // Create draft analysis
    const { data: draft, error } = await supabase
      .from('daily_accelerations')
      .insert({
        story_candidate_id: candidateId,
        date: new Date().toISOString().split('T')[0],
        headline: story.headline,
        source: story.source,
        source_url: story.source_url,
        ma_speed: analysis.ma_speed,
        ma_spectacle: analysis.ma_spectacle,
        ma_theology: analysis.ma_theology,
        suf_visible: analysis.suf_visible,
        suf_invisible: analysis.suf_invisible,
        practice_prompt: analysis.practice_prompt,
        concept_ids: conceptUuids,  // ← NOW USING UUIDs
        module_numbers: analysis.module_numbers || [],
        status: 'draft'
      })
      .select()
      .single()

    if (error) throw error

    // Update candidate status
    await supabase
      .from('story_candidates')
      .update({ status: 'selected' })
      .eq('id', candidateId)

    return NextResponse.json({ 
      success: true, 
      analysisId: draft.id,
      analysis: draft 
    })

  } catch (error) {
    console.error('Analysis generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate analysis',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}