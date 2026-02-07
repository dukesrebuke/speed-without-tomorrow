'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Module, EssayCard, Concept } from '@/types/database'

export default function ModuleReader({ 
  module, 
  cards, 
  concepts 
}: { 
  module: Module
  cards: EssayCard[]
  concepts: Concept[] 
}) {
  const [idx, setIdx] = useState(0)
  const card = cards[idx]
  
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
              Card {idx + 1} of {cards.length}
            </p>
          </div>
          <p className="text-xs text-stone-500 mb-1">Module {module.module_number}</p>
          <h1 className="text-lg font-serif text-stone-900">{module.title}</h1>
        </div>
      </header>

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

        {concepts.length > 0 && (
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
