'use client'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Analysis = {
  id: string
  headline: string
  source: string | null
  source_url: string | null
  ma_speed: string | null
  ma_spectacle: string | null
  ma_theology: string | null
  suf_visible: string | null
  suf_invisible: string | null
  practice_prompt: string | null
  concept_ids: string[]
  module_numbers: number[]
  status: string
  publish_date: string | null
  author_notes: string | null
}

export default function AnalysisEditor({ analysisId }: { analysisId: string }) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadAnalysis()
  }, [analysisId])

  const [generatingAudio, setGeneratingAudio] = useState(false)

  const generateAudio = async () => {
  setGeneratingAudio(true)
  try {
    const response = await fetch('/api/admin/generate-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisId })
    })
    const data = await response.json()
    if (data.success) {
      toast.success('Audio generated!')
      loadAnalysis() // Reload to show audio player
    }
  } catch (error) {
    toast.error('Failed to generate audio')
  } finally {
    setGeneratingAudio(false)
  }
}

  const loadAnalysis = async () => {
    const { data } = await supabase
      .from('daily_accelerations')
      .select('*')
      .eq('id', analysisId)
      .single()

    setAnalysis(data)
    setLoading(false)
  }

  const updateField = (field: keyof Analysis, value: any) => {
    setAnalysis(prev => prev ? { ...prev, [field]: value } : null)
  }

  const saveDraft = async () => {
    if (!analysis) return
    setSaving(true)

    try {
      const { error } = await supabase
        .from('daily_accelerations')
        .update({
          headline: analysis.headline,
          ma_speed: analysis.ma_speed,
          ma_spectacle: analysis.ma_spectacle,
          ma_theology: analysis.ma_theology,
          suf_visible: analysis.suf_visible,
          suf_invisible: analysis.suf_invisible,
          practice_prompt: analysis.practice_prompt,
          concept_ids: analysis.concept_ids,
          module_numbers: analysis.module_numbers,
          author_notes: analysis.author_notes
        })
        .eq('id', analysisId)

      if (error) throw error
      toast.success('Draft saved!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const publish = async () => {
    if (!analysis) return
    setSaving(true)

    try {
      const { error } = await supabase
        .from('daily_accelerations')
        .update({
          headline: analysis.headline,
          ma_speed: analysis.ma_speed,
          ma_spectacle: analysis.ma_spectacle,
          ma_theology: analysis.ma_theology,
          suf_visible: analysis.suf_visible,
          suf_invisible: analysis.suf_invisible,
          practice_prompt: analysis.practice_prompt,
          concept_ids: analysis.concept_ids,
          module_numbers: analysis.module_numbers,
          author_notes: analysis.author_notes,
          status: 'published',
          publish_date: analysis.publish_date || new Date().toISOString().split('T')[0]
        })
        .eq('id', analysisId)

      if (error) throw error
    toast.error('Failed to save draft')
      router.push('/admin/analysis/list')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to publish')
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!analysis) return <div className="p-8">Analysis not found</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-serif mb-8">Edit Analysis</h1>

      <div className="space-y-8">
        {/* Headline */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Headline
          </label>
          <input
            type="text"
            value={analysis.headline}
            onChange={(e) => updateField('headline', e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500"
          />
        </div>

        {/* Source Link */}
        {analysis.source_url && (
          <a
            href={analysis.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View Source Article →
          </a>
        )}

        {/* MA: Speed */}
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Mythic Acceleration: Speed
          </label>
          <textarea
            value={analysis.ma_speed || ''}
            onChange={(e) => updateField('ma_speed', e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 font-mono text-sm"
          />
        </div>

        {/* MA: Spectacle */}
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Mythic Acceleration: Spectacle
          </label>
          <textarea
            value={analysis.ma_spectacle || ''}
            onChange={(e) => updateField('ma_spectacle', e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 font-mono text-sm"
          />
        </div>

        {/* MA: Political Theology */}
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Mythic Acceleration: Political Theology
          </label>
          <textarea
            value={analysis.ma_theology || ''}
            onChange={(e) => updateField('ma_theology', e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 font-mono text-sm"
          />
        </div>

        {/* Sufrimiento: Visible */}
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Sufrimiento: Visible Suffering
          </label>
          <textarea
            value={analysis.suf_visible || ''}
            onChange={(e) => updateField('suf_visible', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 font-mono text-sm"
          />
        </div>

        {/* Sufrimiento: Invisible */}
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Sufrimiento: Invisible Suffering
          </label>
          <textarea
            value={analysis.suf_invisible || ''}
            onChange={(e) => updateField('suf_invisible', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 font-mono text-sm"
          />
        </div>

        {/* Practice Prompt */}
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Practice Prompt
          </label>
          <textarea
            value={analysis.practice_prompt || ''}
            onChange={(e) => updateField('practice_prompt', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 font-mono text-sm"
          />
        </div>

        {/* Module Numbers */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Related Modules (comma-separated: 1,3,4)
          </label>
          <input
            type="text"
            value={analysis.module_numbers.join(',')}
            onChange={(e) => updateField('module_numbers', e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)))}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500"
            placeholder="1,3,4"
          />
        </div>

        {/* Author Notes */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Author Notes (private)
          </label>
          <textarea
            value={analysis.author_notes || ''}
            onChange={(e) => updateField('author_notes', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500"
            placeholder="Internal notes, not shown to users..."
          />
        </div>

        {/* Publish Date */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Publish Date
          </label>
          <input
            type="date"
            value={analysis.publish_date || new Date().toISOString().split('T')[0]}
            onChange={(e) => updateField('publish_date', e.target.value)}
            className="px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t">
          <button
            onClick={saveDraft}
            disabled={saving}
            className="px-6 py-2 border border-stone-300 rounded hover:bg-stone-100 disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            onClick={publish}
            disabled={saving}
            className="px-6 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>

          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-stone-300 rounded hover:bg-stone-100"
          >
            Cancel
          </button>

          <button
            onClick={generateAudio}
            disabled={generatingAudio}
            className="px-6 py-2 border border-stone-300 rounded hover:bg-stone-100 disabled:opacity-50"
          >
           {generatingAudio ? 'Generating Audio...' : 'Generate Audio'}
</button>
        </div>
      </div>
    </div>
  )
}