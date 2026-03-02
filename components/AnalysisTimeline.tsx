'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type TimelineAnalysis = {
  id: string
  headline: string
  date: string
  publish_date: string
  module_numbers: number[]
  concept_ids: string[]
  status: string
}

type ConceptData = {
  id: string
  name: string
  concept_id: string
}

export default function AnalysisTimeline() {
  const [analyses, setAnalyses] = useState<TimelineAnalysis[]>([])
  const [concepts, setConcepts] = useState<ConceptData[]>([])
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Load analyses
    const { data: analysisData } = await supabase
      .from('daily_accelerations')
      .select('id, headline, date, publish_date, module_numbers, concept_ids, status')
      .eq('status', 'published')
      .order('publish_date', { ascending: true })

    // Load concepts
    const { data: conceptData } = await supabase
      .from('concepts')
      .select('id, name, concept_id')

    setAnalyses(analysisData || [])
    setConcepts(conceptData || [])
    setLoading(false)
  }

  const getConceptName = (conceptId: string) => {
    return concepts.find(c => c.id === conceptId)?.name || 'Unknown'
  }

  const filteredAnalyses = selectedConcept
    ? analyses.filter(a => a.concept_ids?.includes(selectedConcept))
    : analyses

  // Group by month
  const groupedByMonth = filteredAnalyses.reduce((acc, analysis) => {
    const date = new Date(analysis.publish_date || analysis.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!acc[monthKey]) acc[monthKey] = []
    acc[monthKey].push(analysis)
    return acc
  }, {} as Record<string, TimelineAnalysis[]>)

  if (loading) {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="h-8 bg-stone-200 rounded w-48 mb-8 animate-pulse"></div>
      <div className="space-y-8">
        {[1,2,3].map(i => (
          <div key={i}>
            <div className="h-6 bg-stone-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="ml-16 space-y-3">
              <div className="h-24 bg-stone-200 rounded animate-pulse"></div>
              <div className="h-24 bg-stone-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

  // Get unique concepts from all analyses
  const usedConcepts = Array.from(
    new Set(analyses.flatMap(a => a.concept_ids || []))
  )
    .map(id => concepts.find(c => c.id === id))
    .filter(Boolean) as ConceptData[]

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-4">Analysis Timeline</h1>
        <p className="text-stone-600 mb-6">
          Tracking mythic acceleration through current events
        </p>

        {/* Concept Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedConcept(null)}
            className={`px-3 py-1 rounded text-sm transition ${
              !selectedConcept
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All ({analyses.length})
          </button>
          {usedConcepts.map(concept => (
            <button
              key={concept.id}
              onClick={() => setSelectedConcept(concept.id)}
              className={`px-3 py-1 rounded text-sm transition ${
                selectedConcept === concept.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {concept.name} ({analyses.filter(a => a.concept_ids?.includes(concept.id)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-stone-200" />

        {Object.entries(groupedByMonth).map(([monthKey, monthAnalyses]) => {
          const [year, month] = monthKey.split('-')
          const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })

          return (
            <div key={monthKey} className="mb-12">
              {/* Month Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white text-xs font-medium z-10">
                  {monthAnalyses.length}
                </div>
                <h2 className="text-xl font-serif text-stone-900">{monthName}</h2>
              </div>

              {/* Analyses */}
              <div className="ml-16 space-y-4">
                {monthAnalyses.map(analysis => (
                  <Link
                    key={analysis.id}
                    href={`/analysis/${analysis.id}`}
                    className="block p-4 bg-white border border-stone-200 rounded hover:shadow-md hover:border-stone-400 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-stone-900 mb-1">
                          {analysis.headline}
                        </h3>
                        <p className="text-xs text-stone-500">
                          {new Date(analysis.publish_date || analysis.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Concept Tags */}
                    {analysis.concept_ids && analysis.concept_ids.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {analysis.concept_ids.slice(0, 4).map(conceptId => (
                          <span
                            key={conceptId}
                            className="px-2 py-0.5 bg-stone-100 text-stone-700 text-xs rounded"
                          >
                            {getConceptName(conceptId)}
                          </span>
                        ))}
                        {analysis.concept_ids.length > 4 && (
                          <span className="px-2 py-0.5 text-stone-500 text-xs">
                            +{analysis.concept_ids.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Module Tags */}
                    {analysis.module_numbers && analysis.module_numbers.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {analysis.module_numbers.map(num => (
                          <span
                            key={num}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                          >
                            M{num}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {filteredAnalyses.length === 0 && selectedConcept && (
        <p className="text-center text-stone-600 py-8">
          No analyses found for this concept
        </p>
      )}
    </div>
  )
}