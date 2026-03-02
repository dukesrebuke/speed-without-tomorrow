'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type DailyAnalysis = {
  id: string
  headline: string
  date: string
  practice_prompt: string | null
  module_numbers: number[]
}

export default function TodaysAcceleration() {
  const [analysis, setAnalysis] = useState<DailyAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadLatest()
  }, [])

  const loadLatest = async () => {
    const { data } = await supabase
      .from('daily_accelerations')
      .select('id, headline, date, practice_prompt, module_numbers')
      .eq('status', 'published')
      .order('publish_date', { ascending: false })
      .limit(1)
      .single()

    setAnalysis(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="bg-white border border-stone-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-stone-200 rounded w-1/3 mb-4"></div>
          <div className="h-3 bg-stone-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-stone-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">📰</span>
        <div>
          <h3 className="font-serif text-lg text-stone-900">Today's Acceleration</h3>
          <p className="text-xs text-stone-500">
            {new Date(analysis.date).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <h4 className="font-medium text-stone-900 mb-3 leading-snug">
        {analysis.headline}
      </h4>

      {analysis.practice_prompt && (
        <div className="bg-stone-50 border-l-2 border-stone-400 p-3 mb-4">
          <p className="text-sm text-stone-700 leading-relaxed">
            <span className="font-medium">Practice:</span> {analysis.practice_prompt}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link
          href={`/analysis/${analysis.id}`}
          className="text-sm text-stone-900 hover:text-stone-700 font-medium"
        >
          Read Full Analysis →
        </Link>

        {analysis.module_numbers && analysis.module_numbers.length > 0 && (
          <p className="text-xs text-stone-500">
            Related: {analysis.module_numbers.map(n => `Module ${n}`).join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}