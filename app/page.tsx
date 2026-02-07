import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-serif text-stone-900">
          Speed Without Tomorrow
        </h1>
        
        <p className="text-lg text-stone-600">
          A map for living after the collapse of shared meaning
        </p>

        <Link 
          href="/dashboard" 
          className="inline-block px-8 py-3 bg-stone-900 text-stone-50 rounded hover:bg-stone-800 transition"
        >
          Enter
        </Link>
      </div>
    </main>
  )
}
