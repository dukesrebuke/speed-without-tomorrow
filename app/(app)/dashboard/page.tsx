import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Module } from '@/types/database'

export default async function Dashboard() {
  const supabase = await createClient()
  
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .eq('status', 'published')
    .order('module_number')

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-stone-600 hover:text-stone-900 mb-8 inline-block">
          ← Home
        </Link>

        <h1 className="text-3xl font-serif mb-12 text-stone-900">Modules</h1>
        
        <div className="space-y-4">
          {modules?.map((m: Module) => (
            <Link
              key={m.id}
              href={`/module/${m.slug}`}
              className="block p-6 bg-white border border-stone-200 rounded-lg hover:shadow-lg transition"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-sm text-stone-500">
                  Module {m.module_number}
                </span>
                <h2 className="text-xl font-serif text-stone-900">{m.title}</h2>
              </div>
              
              {m.description && (
                <p className="text-stone-700 text-sm leading-relaxed">{m.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
