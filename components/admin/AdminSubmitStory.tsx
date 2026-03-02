'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminSubmitStory() {
  const [headline, setHeadline] = useState('')
  const [source, setSource] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [frameworks, setFrameworks] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const frameworkOptions = [
    'speed',
    'spectacle',
    'theology',
    'sufrimiento',
    'technocracy',
    'epistemology'
  ]

  const toggleFramework = (fw: string) => {
    setFrameworks(prev =>
      prev.includes(fw) ? prev.filter(f => f !== fw) : [...prev, fw]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('story_candidates')
        .insert({
          headline,
          source,
          source_url: sourceUrl,
          summary: summary || null,
          suggested_frameworks: frameworks,
          scan_date: new Date().toISOString().split('T')[0]
        })

      if (error) throw error

      router.push('/admin/analysis/review')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to submit story')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-serif mb-8">Submit Story for Analysis</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Headline *
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            required
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500"
            placeholder="Immigration raid announced via social media"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Source *
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500"
            placeholder="Reuters"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Source URL *
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            required
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Summary (optional)
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500"
            placeholder="Brief summary of the event..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Relevant Frameworks
          </label>
          <div className="flex flex-wrap gap-2">
            {frameworkOptions.map(fw => (
              <button
                key={fw}
                type="button"
                onClick={() => toggleFramework(fw)}
                className={`px-3 py-1 rounded text-sm transition ${
                  frameworks.includes(fw)
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 disabled:opacity-50"
          >
            {saving ? 'Submitting...' : 'Submit Story'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-stone-300 rounded hover:bg-stone-100 text-stone-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}