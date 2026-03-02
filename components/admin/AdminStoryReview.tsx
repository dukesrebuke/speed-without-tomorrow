'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import ScanNewsButton from '@/components/admin/ScanNewsButton'

type StoryCandidate = {
  id: string
  headline: string
  source: string
  source_url: string
  summary: string | null
  status: string
  scan_date: string
  suggested_frameworks: string[]
  relevance_score: number | null
  relevance_reasoning: string | null
}

export default function AdminStoryReview() {
  const [stories, setStories] = useState<StoryCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    const { data } = await supabase
      .from('story_candidates')
      .select('*')
      .in('status', ['pending', 'selected'])
      .order('scan_date', { ascending: false })
      .limit(20)

    setStories(data || [])
    setLoading(false)
  }

  const generateAnalysis = async (candidateId: string) => {
    setGenerating(candidateId)

    try {
      const response = await fetch('/api/admin/generate-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId })
      })

      const result = await response.json()

      if (result.success) {
        window.location.href = `/admin/analysis/edit/${result.analysisId}`
      } else {
        alert('Failed to generate analysis: ' + result.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate analysis')
    } finally {
      setGenerating(null)
    }
  }

  const rejectStory = async (candidateId: string) => {
    await supabase
      .from('story_candidates')
      .update({ status: 'rejected' })
      .eq('id', candidateId)

    loadStories()
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif">Story Candidates</h1>
        <div className="flex gap-3">
          <ScanNewsButton onScanComplete={loadStories} />
          <Link
            href="/admin/analysis/submit"
            className="px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800"
          >
            + Submit Story
          </Link>
        </div>
      </div>

      {stories.length === 0 && (
        <p className="text-stone-600">No pending stories. Submit a new story to analyze.</p>
      )}

      <div className="space-y-4">
        {stories.map(story => (
          <div 
            key={story.id}
            className="border border-stone-200 rounded-lg p-6 bg-white"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-serif text-lg text-stone-900 mb-1">
                  {story.headline}
                </h3>
                <p className="text-sm text-stone-500">
                  {story.source} • {new Date(story.scan_date).toLocaleDateString()}
                  {story.relevance_score && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                      Score: {Math.round(story.relevance_score * 10)}/10
                    </span>
                  )}
                </p>
              </div>
              {story.status === 'selected' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  Analysis Generated
                </span>
              )}
            </div>

            {story.summary && (
              <p className="text-sm text-stone-600 mb-3 line-clamp-2">
                {story.summary}
              </p>
            )}

            {story.relevance_reasoning && (
              <p className="text-xs text-stone-500 italic mb-3">
                "{story.relevance_reasoning}"
              </p>
            )}

            {story.suggested_frameworks && story.suggested_frameworks.length > 0 && (
              <div className="flex gap-2 mb-4">
                {story.suggested_frameworks.map(fw => (
                  <span 
                    key={fw}
                    className="px-2 py-1 bg-stone-100 text-stone-700 text-xs rounded"
                  >
                    {fw}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <a
                href={story.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-stone-600 hover:text-stone-900"
              >
                View Source →
              </a>

              {story.status === 'pending' && (
                <>
                  <button
                    onClick={() => generateAnalysis(story.id)}
                    disabled={generating === story.id}
                    className="px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 disabled:opacity-50 text-sm"
                  >
                    {generating === story.id ? 'Generating...' : 'Generate Analysis'}
                  </button>

                  <button
                    onClick={() => rejectStory(story.id)}
                    className="px-4 py-2 border border-stone-300 rounded hover:bg-stone-100 text-sm text-stone-700"
                  >
                    Reject
                  </button>
                </>
              )}

              {story.status === 'selected' && (
                <Link
                  href={`/admin/analysis/list`}
                  className="px-4 py-2 border border-stone-300 rounded hover:bg-stone-100 text-sm text-stone-700"
                >
                  View Analyses →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}