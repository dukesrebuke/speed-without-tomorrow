import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Module } from '@/types/database'
import TodaysAcceleration from '@/components/TodaysAcceleration'

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

    if (!maModules || !sufrimientoChapters) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="h-10 bg-stone-200 rounded w-64 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-24 bg-stone-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-24 bg-stone-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif mb-4 text-stone-900">Speed Without Tomorrow</h1>
        <p className="text-lg text-stone-600 mb-8">Choose your path</p>

        {/* Today's Acceleration Widget */}
        <div className="mb-12">
          <TodaysAcceleration />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mythic Acceleration */}
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

          {/* Sufrimiento */}
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

                     {/*  - Admin Quick Links  */}
        {user && (
  <div className="mt-16 pt-8 border-t border-stone-200">
    <p className="text-xs text-stone-500 mb-3">Admin Tools</p>
    <div className="flex flex-wrap gap-4">
      <Link
        href="/admin/analysis/submit"
        className="text-sm text-stone-600 hover:text-stone-900 transition"
      >
        Submit Story
      </Link>
      <Link
        href="/admin/analysis/review"
        className="text-sm text-stone-600 hover:text-stone-900 transition"
      >
        Review Queue
      </Link>
      <Link
        href="/admin/analysis/list"
        className="text-sm text-stone-600 hover:text-stone-900 transition"
      >
        All Analyses
      </Link>
      <Link
        href="/timeline"
        className="text-sm text-stone-600 hover:text-stone-900 transition"
      >
        Timeline
      </Link>
    </div>
    </div>
        )}
        </div>
        </main>
  
  );
}