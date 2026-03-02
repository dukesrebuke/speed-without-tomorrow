import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AdminNav() {
  return (
    <nav className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
            
            <div className="h-4 w-px bg-stone-300"></div>
            
            <Link 
              href="/admin/analysis/submit"
              className="text-sm text-stone-700 hover:text-stone-900 transition"
            >
              Submit Story
            </Link>
            
            <Link 
              href="/admin/analysis/review"
              className="text-sm text-stone-700 hover:text-stone-900 transition"
            >
              Review Queue
            </Link>
            
            <Link 
              href="/admin/analysis/list"
              className="text-sm text-stone-700 hover:text-stone-900 transition"
            >
              All Analyses
            </Link>

            <Link 
              href="/timeline"
              className="text-sm text-stone-700 hover:text-stone-900 transition"
            >
              Timeline
            </Link>
          </div>

          <div className="text-xs text-stone-500">
            Admin Tools
          </div>
        </div>
      </div>
    </nav>
  )
}