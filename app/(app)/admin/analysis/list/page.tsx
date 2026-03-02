import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AnalysisListPage() {
  const supabase = await createClient()

  const { data: analyses } = await supabase
    .from('daily_accelerations')
    .select('*')
    .order('publish_date', { ascending: false })
    .limit(50)

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif">All Analyses</h1>
        <Link
          href="/admin/analysis/submit"
          className="px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800"
        >
          + New Story
        </Link>
      </div>

      {analyses && analyses.length === 0 && (
        <p className="text-stone-600">No analyses yet.</p>
      )}

      <div className="space-y-4">
        {analyses?.map(analysis => (
          <div 
            key={analysis.id}
            className="border border-stone-200 rounded-lg p-6 bg-white"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-serif text-lg text-stone-900">
                  {analysis.headline}
                </h3>
                <p className="text-sm text-stone-500">
                  {new Date(analysis.publish_date || analysis.date).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 text-xs rounded ${
                analysis.status === 'published' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {analysis.status}
              </span>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/admin/analysis/edit/${analysis.id}`}
                className="text-sm text-stone-900 hover:text-stone-700"
              >
                Edit
              </Link>
              
              {analysis.status === 'published' && (
                <Link
                  href={`/analysis/${analysis.id}`}
                  target="_blank"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t">
        <Link
          href="/dashboard"
          className="text-sm text-stone-600 hover:text-stone-900"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}