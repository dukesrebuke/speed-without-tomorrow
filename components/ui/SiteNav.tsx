'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function SiteNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Don't show nav on landing page
  if (pathname === '/') return null

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-sm font-serif text-stone-900 hover:text-stone-600 transition"
        >
          Speed Without Tomorrow
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link 
                href="/dashboard"
                className="text-sm text-stone-600 hover:text-stone-900 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-stone-600 hover:text-stone-900 transition"
              >
                Sign Out
              </button>
            </>
          )}
          {!user && (
            <Link 
              href="/login"
              className="text-sm text-stone-600 hover:text-stone-900 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
