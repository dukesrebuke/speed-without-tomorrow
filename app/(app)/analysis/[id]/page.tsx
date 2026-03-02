import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AudioPlayer from '@/components/AudioPlayer'

export default async function AnalysisPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: analysis } = await supabase
    .from('daily_accelerations')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!analysis) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link 
        href="/dashboard"
        className="text-sm text-stone-600 hover:text-stone-900 mb-6 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <article className="bg-white border border-stone-200 rounded-lg p-12">
        <div className="mb-8">
          <p className="text-sm text-stone-500 mb-2">
            {new Date(analysis.date).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
          <h1 className="text-3xl font-serif text-stone-900 mb-4">
            {analysis.headline}
          </h1>
          {analysis.source && (
            <p className="text-sm text-stone-600">
              Source: <a 
                href={analysis.source_url || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {analysis.source}
              </a>
            </p>
          )}
        </div>
        {analysis.audio_url && (
  <div className="mb-8">
    <AudioPlayer audioUrl={analysis.audio_url} />
  </div>
)}

        {/* Mythic Acceleration Lens */}
        <section className="mb-10">
          <h2 className="text-xl font-serif text-stone-900 mb-4 border-b pb-2">
            Mythic Acceleration Lens
          </h2>

          {analysis.ma_speed && (
            <div className="mb-6">
              <h3 className="font-medium text-stone-900 mb-2">Speed</h3>
              <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed">
                {analysis.ma_speed.split('\n\n').map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}

          {analysis.ma_spectacle && (
            <div className="mb-6">
              <h3 className="font-medium text-stone-900 mb-2">Spectacle</h3>
              <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed">
                {analysis.ma_spectacle.split('\n\n').map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}

          {analysis.ma_theology && (
            <div className="mb-6">
              <h3 className="font-medium text-stone-900 mb-2">Political Theology</h3>
              <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed">
                {analysis.ma_theology.split('\n\n').map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Sufrimiento Lens */}
        <section className="mb-10">
          <h2 className="text-xl font-serif text-stone-900 mb-4 border-b pb-2">
            Sufrimiento Lens
          </h2>

          {analysis.suf_visible && (
            <div className="mb-6">
              <h3 className="font-medium text-stone-900 mb-2">Visible Suffering</h3>
              <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed">
                {analysis.suf_visible.split('\n\n').map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}

          {analysis.suf_invisible && (
            <div className="mb-6">
              <h3 className="font-medium text-stone-900 mb-2">Invisible Suffering</h3>
              <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed">
                {analysis.suf_invisible.split('\n\n').map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Practice */}
        {analysis.practice_prompt && (
          <section className="bg-stone-50 border-l-4 border-stone-900 p-6 mb-8">
            <h3 className="font-medium text-stone-900 mb-2">Today's Practice</h3>
            <p className="text-stone-700 leading-relaxed">
              {analysis.practice_prompt}
            </p>
          </section>
        )}

        {/* Related Modules */}
        {analysis.module_numbers && analysis.module_numbers.length > 0 && (
          <section className="border-t pt-6">
            <h3 className="text-sm font-medium text-stone-900 mb-3">
              Explore Related Modules
            </h3>
            <div className="flex gap-2">
              {analysis.module_numbers.map((num: number) => (
                <Link
                  key={num}
                  href={`/dashboard`}
                  className="px-3 py-1 bg-stone-100 text-stone-700 rounded text-sm hover:bg-stone-200"
                >
                  Module {num}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}