import BookmarkButton from '@/components/BookmarkButton'
import NoteEditor from '@/components/NoteEditor'

export default function ModuleReader({ module, cards, practices, concepts }) {

  return (
  <div className="min-h-screen bg-stone-50">
    <div className="bg-white border-b border-stone-200 py-6">
      {/* header content */}
    </div>

    <main className="max-w-2xl mx-auto px-4 py-16">
      <article className="bg-white border border-stone-200 rounded-lg p-12 shadow-sm min-h-[400px]">
        
        {/* Bookmark/Note buttons */}
        <div className="flex gap-2 mb-6 justify-end">
          <BookmarkButton cardId={card.id} userId={user?.id || null} />
          <NoteEditor cardId={card.id} userId={user?.id || null} />
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
        
      </div>

      

    </main>  
  </div>  
)