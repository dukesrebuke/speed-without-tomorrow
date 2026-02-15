'use client'

import { useState, useEffect } from 'react'
import { FileText, Save, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NoteEditor({ 
  cardId, 
  userId 
}: { 
  cardId: string
  userId: string | null 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [hasNote, setHasNote] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    async function loadNote() {
      const { data } = await supabase
        .from('notes')
        .select('content')
        .eq('user_id', userId)
        .eq('card_id', cardId)
        .maybeSingle()

      if (data) {
        setContent(data.content)
        setHasNote(true)
      }
    }

    loadNote()
  }, [userId, cardId])

  const saveNote = async () => {
    if (!userId || !content.trim()) return
    setSaving(true)

    try {
      await supabase
        .from('notes')
        .upsert({
          user_id: userId,
          card_id: cardId,
          content: content.trim()
        }, {
          onConflict: 'user_id,card_id'
        })
      
      setHasNote(true)
      setIsOpen(false)
    } catch (error) {
      console.error('Save note error:', error)
    } finally {
      setSaving(false)
    }
  }

  const deleteNote = async () => {
    if (!userId) return
    setSaving(true)

    try {
      await supabase
        .from('notes')
        .delete()
        .eq('user_id', userId)
        .eq('card_id', cardId)
      
      setContent('')
      setHasNote(false)
      setIsOpen(false)
    } catch (error) {
      console.error('Delete note error:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!userId) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded transition ${
          hasNote 
            ? 'text-stone-900 bg-stone-200' 
            : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
        }`}
        aria-label="Add note"
      >
        <FileText size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif text-stone-900">Your Note</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-stone-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts about this card..."
              className="w-full h-48 p-4 border border-stone-300 rounded resize-none focus:outline-none focus:border-stone-500"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={saveNote}
                disabled={saving || !content.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 disabled:opacity-50 transition"
              >
                <Save size={16} />
                Save Note
              </button>

              {hasNote && (
                <button
                  onClick={deleteNote}
                  disabled={saving}
                  className="px-4 py-2 border border-stone-300 rounded hover:bg-stone-100 transition text-stone-700"
                >
                  Delete Note
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}