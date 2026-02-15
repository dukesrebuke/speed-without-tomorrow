'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import BookmarkButton from '@/components/BookmarkButton'
import NoteEditor from '@/components/NoteEditor'

interface Card {
  id: string
  title: string
  content: string
  order_index: number
}

interface Module {
  id: string
  title: string
  module_number: number
  slug: string
  reading_path: string
}

interface Concept {
  id: string
  name: string
  short_definition: string
}

interface Props {
  module: Module
  cards: Card[]
  practices: any[]
  concepts: Concept[]
}

export default function ModuleReader({ module, cards, practices, concepts }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  const card = cards[currentIndex]

  if (!card) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500">No cards found for this module.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 py-6">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-sm text-stone-500 mb-1">Module {module.module_number}</p>
          <h1 className="text-xl font-serif text-stone-900">{module.title}</h1>
          <p className="text-sm text-stone-400 mt-2">
            Card {currentIndex + 1} of {cards.length}
          </p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-16">
        <article className="bg-white border border-stone-200 rounded-lg p-12 shadow-sm min-h-[400px]">

          <div className="flex gap-2 mb-6 justify-end">
            <BookmarkButton cardId={card.id} userId={userId} />
            <NoteEditor cardId={card.id} userId={userId} />
          </div>

          <h2 className="text-2xl font-serif mb-8 text-stone-900">{card.title}</h2>

          <div className="prose prose-stone max-w-none">
            {card.content.split('\n\n').map((p, i) => (
              <p key={i} className="mb-4 leading-relaxed text-stone-800 text-base">
                {p}
              </p>
            ))}
          </div>
        </article>

        <div className="mt-12 flex justify-between">
          <button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 border border-stone-300 rounded text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentIndex(i => Math.min(cards.length - 1, i + 1))}
            disabled={currentIndex === cards.length - 1}
            className="px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  )
}