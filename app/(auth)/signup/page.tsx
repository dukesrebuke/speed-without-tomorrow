'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white p-8 rounded-lg border border-stone-200">
            <h2 className="text-xl font-serif text-stone-900 mb-4">Account Created!</h2>
            <p className="text-stone-700 mb-6">
              You can now sign in with your credentials.
            </p>
            <Link href="/login" className="text-stone-900 hover:underline font-medium">
              Go to login
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-stone-900 mb-2">Create Account</h1>
          <p className="text-stone-600">Begin your journey</p>
        </div>

        <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg border border-stone-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500 text-stone-900"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500 text-stone-900"
              minLength={6}
              required
            />
            <p className="mt-1 text-xs text-stone-500">At least 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-2 rounded hover:bg-stone-800 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="mt-4 text-center text-sm text-stone-600">
            Already have an account?{' '}
            <Link href="/login" className="text-stone-900 hover:underline">
              Sign in
            </Link>
          </p>
        </form>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-700">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
