import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Module } from '@/types/database'

export default async function Dashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: maModules } = await supabase
    .from('modules')
    .select('*')
    .eq('status', 'published')
    .eq('reading_path', 'mythic-acceleration')
    .order('module_number')

  const { data: sufrimientoChapters } = await supabase
    .from('modules')
    .select('*')
    .eq('status', 'published')
    .eq('reading_path', 'sufrimiento')
    .order('module_number')

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif mb-4 text-stone-900">Speed Without Tomorrow</h1>
        <p className="text-lg text-stone-600 mb-16">Choose your path</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-serif text-stone-900 mb-2">Mythic Acceleration</h2>
              <p className="text-stone-600 text-sm">Diagnostic. Analytical. Sharp.</p>
            </div>
            
            <div className="space-y-3">
              {maModules?.map((m: Module) => (
                <Link
                  key={m.id}
                  href={`/module/${m.slug}`}
                  className="block p-4 bg-white border border-stone-200 rounded hover:shadow-md transition"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs text-stone-500">Module {m.module_number}</span>
                    <h3 className="text-base font-serif text-stone-900">{m.title}</h3>
                  </div>
                  {m.description && (
                    <p className="text-stone-600 text-xs line-clamp-2">{m.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-serif text-stone-900 mb-2">Sufrimiento</h2>
              <p className="text-stone-600 text-sm">Contemplative. Reflective. Slow.</p>
            </div>
            
            <div className="space-y-3">
              {sufrimientoChapters?.map((m: Module) => (
                <Link
                  key={m.id}
                  href={`/chapter/${m.slug}`}
                  className="block p-4 bg-white border border-stone-200 rounded hover:shadow-md transition"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs text-stone-500">Chapter {m.module_number}</span>
                    <h3 className="text-base font-serif text-stone-900">{m.title}</h3>
                  </div>
                  {m.description && (
                    <p className="text-stone-600 text-xs line-clamp-2">{m.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
