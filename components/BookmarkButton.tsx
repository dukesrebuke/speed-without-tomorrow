'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function BookmarkButton({ 
  cardId, 
  userId 
}: { 
  cardId: string
  userId: string | null 
}) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    async function checkBookmark() {
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('card_id', cardId)
        .maybeSingle()

      setIsBookmarked(!!data)
    }

    checkBookmark()
  }, [userId, cardId])

  const toggleBookmark = async () => {
    if (!userId) return
    setLoading(true)

    try {
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('card_id', cardId)
        setIsBookmarked(false)
      } else {
        await supabase
          .from('bookmarks')
          .insert({ user_id: userId, card_id: cardId })
        setIsBookmarked(true)
      }
    } catch (error) {
      console.error('Bookmark error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!userId) return null

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`p-2 rounded transition ${
        isBookmarked 
          ? 'text-stone-900 bg-stone-200' 
          : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
      }`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Bookmark 
        size={20} 
        fill={isBookmarked ? 'currentColor' : 'none'}
      />
    </button>
  )
}