// app/api/admin/scan-news/route.ts
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// News API configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY || ''
const NEWS_SOURCES = [
  'reuters',
  'associated-press', 
  'bbc-news',
  'the-washington-post',
  'politico'
]

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    // Fetch recent news from News API
    const newsUrl = `https://newsapi.org/v2/top-headlines?` +
      `sources=${NEWS_SOURCES.join(',')}&` +
      `language=en&` +
      `pageSize=30&` +
      `apiKey=${NEWS_API_KEY}`

    const newsResponse = await fetch(newsUrl)
    const newsData = await newsResponse.json()

    if (newsData.status !== 'ok') {
      throw new Error('News API error: ' + newsData.message)
    }

    const articles = newsData.articles || []

    // Score each article with AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const scoringPrompt = `You are evaluating news articles for relevance to political analysis frameworks:

MYTHIC ACCELERATION: Speed preventing judgment, spectacle replacing governance, political theology
SUFRIMIENTO: Politics of suffering, visible vs invisible pain

Evaluate these articles and return ONLY valid JSON (no markdown):

${articles.slice(0, 20).map((a: any, i: number) => `
${i + 1}. "${a.title}"
   ${a.description || 'No description'}
   Source: ${a.source?.name}
`).join('\n')}

For each article, score 0-10 on relevance and identify frameworks.
Return as JSON array:

[
  {
    "index": 1,
    "score": 8,
    "frameworks": ["speed", "spectacle"],
    "reasoning": "Brief why it matters"
  }
]

Only include articles scoring 6+. Return valid JSON only.`

    const result = await model.generateContent(scoringPrompt)
    const text = result.response.text()
    
    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in AI response')
    }
    
    const scores = JSON.parse(jsonMatch[0])

    // Insert high-scoring articles as candidates
    const candidates = scores
      .filter((s: any) => s.score >= 6)
      .map((s: any) => {
        const article = articles[s.index - 1]
        return {
          headline: article.title,
          source: article.source?.name || 'Unknown',
          source_url: article.url,
          summary: article.description,
          relevance_score: s.score / 10, // Normalize to 0-1
          suggested_frameworks: s.frameworks,
          scan_date: new Date().toISOString().split('T')[0],
          scan_source: 'auto',
          relevance_reasoning: s.reasoning,
          status: 'pending'
        }
      })

    // Insert into database
    const { data: inserted, error } = await supabase
      .from('story_candidates')
      .insert(candidates)
      .select()

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      scanned: articles.length,
      candidates_found: inserted?.length || 0,
      candidates: inserted
    })

  } catch (error) {
    console.error('News scan error:', error)
    return NextResponse.json({ 
      error: 'Scan failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}