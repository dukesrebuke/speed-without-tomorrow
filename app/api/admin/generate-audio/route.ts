// app/api/admin/generate-audio/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY || ''
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB' // Adam voice (neutral, professional)

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { analysisId } = await request.json()

  // Get analysis
  const { data: analysis } = await supabase
    .from('daily_accelerations')
    .select('*')
    .eq('id', analysisId)
    .single()

  if (!analysis) {
    return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
  }

  // Build script
  const script = `
${analysis.headline}

Mythic Acceleration Analysis.

Speed: ${analysis.ma_speed}

Spectacle: ${analysis.ma_spectacle}

Political Theology: ${analysis.ma_theology}

Sufrimiento Analysis.

Visible Suffering: ${analysis.suf_visible}

Invisible Suffering: ${analysis.suf_invisible}

Today's Practice: ${analysis.practice_prompt}
  `.trim()

  try {
    // Generate audio with ElevenLabs
    console.log("API Key exists:", !!process.env.ELEVEN_LABS_API_KEY);
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY
        },
        body: JSON.stringify({
          text: script,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    )

  // Replace your existing if (!response.ok) block with this:
if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  console.error('ElevenLabs Detail:', JSON.stringify(errorData, null, 2));
  throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
}

    const audioBuffer = await response.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')

    // Save to Supabase Storage
    const fileName = `analysis-${analysisId}.mp3`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio')
      .upload(fileName, Buffer.from(audioBuffer), {
        contentType: 'audio/mpeg',
        upsert: true
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('audio')
      .getPublicUrl(fileName)

    // Update analysis with audio URL
    await supabase
      .from('daily_accelerations')
      .update({ audio_url: publicUrl })
      .eq('id', analysisId)

    return NextResponse.json({ 
      success: true, 
      audioUrl: publicUrl,
      characterCount: script.length
    })

  } catch (error) {
    console.error('Audio generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}