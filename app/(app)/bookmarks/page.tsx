import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function BookmarksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <div>Please log in</div>

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select(`
      id,
      created_at,
      essay_cards (
        id,
        title,
        content,
        modules (
          slug,
          title,
          module_number
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-serif mb-8">Your Bookmarks</h1>
      
      <div className="space-y-4">
        {bookmarks?.map((bookmark: any) => (
          <Link
            key={bookmark.id}
            href={`/module/${bookmark.essay_cards.modules.slug}`}
            className="block p-6 bg-white border border-stone-200 rounded hover:shadow-md transition"
          >
            <div className="text-xs text-stone-500 mb-2">
              Module {bookmark.essay_cards.modules.module_number}: {bookmark.essay_cards.modules.title}
            </div>
            <h3 className="font-serif text-lg text-stone-900 mb-2">
              {bookmark.essay_cards.title}
            </h3>
            <p className="text-sm text-stone-600 line-clamp-2">
              {bookmark.essay_cards.content.substring(0, 200)}...
            </p>
          </Link>
        ))}

        {bookmarks?.length === 0 && (
          <p className="text-stone-500">No bookmarks yet. Bookmark cards as you read to save them here.</p>
        )}
      </div>
    </div>
  )
}