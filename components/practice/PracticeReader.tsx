'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Practice } from '@/types/database'
import PracticeCard from './PracticeCard'

interface PracticeReaderProps {
  practices: Practice[]
  moduleTitle: string
  moduleNumber: number
  moduleId: string
  readingPath: string
}

export default function PracticeReader({ 
  practices, 
  moduleTitle, 
  moduleNumber,
  moduleId,
  readingPath
}: PracticeReaderProps) {
  const [completedPractices, setCompletedPractices] = useState<Set<string>>(new Set())
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        loadCompletedPractices(user.id)
      }
    })
  }, [])

  const loadCompletedPractices = async (userId: string) => {
    const { data } = await supabase
      .from('user_practice_completions')
      .select('practice_id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)

    if (data) {
      setCompletedPractices(new Set(data.map(d => d.practice_id)))
    }
  }

  const handleComplete = async (practiceId: string) => {
    if (!user) return

    const isCompleted = completedPractices.has(practiceId)

    if (isCompleted) {
      await supabase
        .from('user_practice_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('practice_id', practiceId)

      setCompletedPractices(prev => {
        const next = new Set(prev)
        next.delete(practiceId)
        return next
      })
    } else {
      await supabase
        .from('user_practice_completions')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          practice_id: practiceId,
          completed_at: new Date().toISOString(),
        })

      setCompletedPractices(prev => new Set(prev).add(practiceId))
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Link 
            href={`/module/${readingPath}-${moduleNumber}`}
            className="text-sm text-stone-600 hover:text-stone-900 mb-4 inline-block"
          >
            ← Back to Module
          </Link>
          <p className="text-xs text-stone-500 mb-1">Module {moduleNumber} Practices</p>
          <h1 className="text-lg font-serif text-stone-900">{moduleTitle}</h1>
          <p className="text-sm text-stone-600 mt-2">
            {completedPractices.size} of {practices.length} completed
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-6">
          {practices.map((practice) => (
            <PracticeCard
              key={practice.id}
              practice={practice}
              onComplete={() => handleComplete(practice.id)}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-2 border border-stone-300 rounded hover:bg-stone-100 transition text-stone-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
