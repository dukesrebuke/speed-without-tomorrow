'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Module, EssayCard, Concept, Practice } from '@/types/database'

export default function ModuleReader({ 
  module, 
  cards,
  practices = [],
  concepts = [] 
}: { 
  module: Module
  cards: EssayCard[]
  practices?: Practice[]
  concepts?: Concept[] 
}) {
  const [idx, setIdx] = useState(0)
  const [user, setUser] = useState<any>(null)
  const card = cards[idx]
  const supabase = createClient()
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        loadProgress(user.id)
      }
    })
  }, [])

  const loadProgress = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('last_card_id')
      .eq('user_id', userId)
      .eq('module_id', module.id)
      .maybeSingle()

    if (error) {
      console.error('Error loading progress:', error)
      return
    }

    if (data?.last_card_id) {
      const cardIndex = cards.findIndex(c => c.id === data.last_card_id)
      if (cardIndex >= 0) setIdx(cardIndex)
    }
  }

  useEffect(() => {
    if (!user || !card) return

    const saveProgress = async () => {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          module_id: module.id,
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

  const hasPractices = practices && practices.length > 0

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-end mb-2">
            <p className="text-sm text-stone-500">
              Card {idx + 1} of {cards.length}
            </p>
          </div>
          <p className="text-xs text-stone-500 mb-1">Module {module.module_number}</p>
          <h1 className="text-lg font-serif text-stone-900">{module.title}</h1>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-16">
        <article className="bg-white border border-stone-200 rounded-lg p-12 shadow-sm min-h-[400px]">
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

        {hasPractices && (
          <div className="mt-8 text-center">
            <Link
              href={`/practice/${module.slug}`}
              className="inline-block px-6 py-3 bg-stone-100 border border-stone-300 rounded hover:bg-stone-200 transition text-stone-900 font-medium"
            >
              View Practices for this Module ({practices.length})
            </Link>
          </div>
        )}

        {concepts && concepts.length > 0 && (
          <aside className="mt-16 p-6 bg-stone-100 rounded-lg">
            <h3 className="font-serif text-lg mb-4 text-stone-900">Key Concepts</h3>
            {concepts.map(c => (
              <details key={c.id} className="mb-3">
                <summary className="text-sm font-medium cursor-pointer text-stone-800 hover:text-stone-900">
                  {c.name}
                </summary>
                <p className="mt-2 text-sm text-stone-700 leading-relaxed">
                  {c.short_definition}
                </p>
              </details>
            ))}
          </aside>
        )}
      </main>
    </div>
  )
}
