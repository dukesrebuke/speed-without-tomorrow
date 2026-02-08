'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-stone-600 hover:text-stone-900 border border-stone-300 px-3 py-1 rounded hover:bg-stone-100 transition"
    >
      Sign Out
    </button>
  )
}
