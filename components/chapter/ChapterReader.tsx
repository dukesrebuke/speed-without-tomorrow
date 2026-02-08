'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SectionCard from "@/components/ui/SectionCard"

type Card = {
  id: string
  title: string | null
  content: string
  order_index: number
  module_id: string
}

type ChapterReaderProps = {
  cards: Card[]
  moduleTitle: string
  moduleNumber: number
  moduleId: string
}

export default function ChapterReader({ cards, moduleTitle, moduleNumber, moduleId }: ChapterReaderProps) {
  const [idx, setIdx] = useState(0)
  const [user, setUser] = useState<any>(null)
  const card = cards[idx]
  const supabase = createClient()
  
  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        // Load saved progress
        loadProgress(user.id)
      }
    })
  }, [])

  // Load user's last position
  const loadProgress = async (userId: string) => {
    const { data } = await supabase
      .from('user_progress')
      .select('last_card_id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single()

    if (data?.last_card_id) {
      const cardIndex = cards.findIndex(c => c.id === data.last_card_id)
      if (cardIndex >= 0) setIdx(cardIndex)
    }
  }

  // Save progress when card changes
  useEffect(() => {
    if (!user || !card) return

    const saveProgress = async () => {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          last_card_id: card.id,
          status: idx === cards.length - 1 ? 'completed' : 'in_progress',
          last_viewed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,module_id'
        })
    }

    saveProgress()
  }, [idx, user, card])

  if (!card) return <div>No content</div>

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between mb-2">
            <Link href="/dashboard" className="text-sm text-stone-600 hover:text-stone-900">
              ← Dashboard
            </Link>
            <p className="text-sm text-stone-500">
              Section {idx + 1} of {cards.length}
            </p>
          </div>
          <p className="text-xs text-stone-500 mb-1">Chapter {moduleNumber}</p>
          <h1 className="text-lg font-serif text-stone-900">{moduleTitle}</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <SectionCard title={card.title || undefined}>
          {card.content.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </SectionCard>

        <div className="mt-12 flex justify-between">
          <button
            onClick={() => setIdx(i => i - 1)}
            disabled={idx === 0}
            className="px-6 py-2 border border-stone-300 rounded hover:bg-stone-100 disabled:opacity-30 transition text-stone-700"
          >
            Previous
          </button>

          {idx < cards.length - 1 ? (
            <button
              onClick={() => setIdx(i => i + 1)}
              className="px-8 py-3 bg-stone-900 text-white rounded hover:bg-stone-800 transition"
            >
              Continue
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2 border border-stone-300 rounded hover:bg-stone-100 transition text-stone-700"
            >
              Complete
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}