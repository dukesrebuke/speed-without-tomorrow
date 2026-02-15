'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

type Concept = {
  id: string
  name: string
  short_definition: string
}

type ModuleLink = {
  module_number: number
  module_title: string
  module_slug: string
}

type ConceptWithModules = Concept & {
  modules: ModuleLink[]
}

export default function ConceptGraph({ 
  concepts,
  currentModuleNumber 
}: { 
  concepts: ConceptWithModules[]
  currentModuleNumber?: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedConcept, setSelectedConcept] = useState<ConceptWithModules | null>(null)

  // Don't show if no concepts
  if (!concepts || concepts.length === 0) return null

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-lg hover:bg-stone-800 transition flex items-center justify-center z-40"
        aria-label="Open concept web"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
          <line x1="12" y1="9" x2="12" y2="6" />
          <line x1="9" y1="12" x2="6" y2="12" />
          <line x1="15" y1="12" x2="18" y2="12" />
          <line x1="12" y1="15" x2="12" y2="18" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif text-stone-900">Concept Web</h2>
                <p className="text-sm text-stone-600 mt-1">
                  Navigate ideas across modules
                </p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setSelectedConcept(null)
                }}
                className="p-2 hover:bg-stone-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {!selectedConcept ? (
                // Concept List View
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {concepts.map(concept => (
                    <button
                      key={concept.id}
                      onClick={() => setSelectedConcept(concept)}
                      className="text-left p-4 border border-stone-200 rounded hover:border-stone-400 hover:shadow-sm transition group"
                    >
                      <h3 className="font-medium text-stone-900 group-hover:text-stone-950 mb-1">
                        {concept.name}
                      </h3>
                      <p className="text-xs text-stone-600 mb-2 line-clamp-2">
                        {concept.short_definition}
                      </p>
                      <p className="text-xs text-stone-500">
                        Appears in {concept.modules.length} module{concept.modules.length !== 1 ? 's' : ''}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                // Concept Detail View
                <div className="p-6">
                  <button
                    onClick={() => setSelectedConcept(null)}
                    className="text-sm text-stone-600 hover:text-stone-900 mb-6 flex items-center gap-2"
                  >
                    ← Back to all concepts
                  </button>

                  <h3 className="text-2xl font-serif text-stone-900 mb-3">
                    {selectedConcept.name}
                  </h3>
                  <p className="text-stone-700 leading-relaxed mb-8">
                    {selectedConcept.short_definition}
                  </p>

                  <h4 className="text-sm font-medium text-stone-900 mb-4">
                    Explored in these modules:
                  </h4>

                  <div className="space-y-2">
                    {selectedConcept.modules
                      .sort((a, b) => a.module_number - b.module_number)
                      .map(mod => (
                        <Link
                          key={mod.module_slug}
                          href={`/module/${mod.module_slug}`}
                          onClick={() => setIsOpen(false)}
                          className="block p-4 border border-stone-200 rounded hover:border-stone-400 hover:shadow-sm transition"
                        >
                          <div className="flex items-baseline gap-2">
                            <span className={`text-xs ${mod.module_number === currentModuleNumber ? 'text-stone-900 font-medium' : 'text-stone-500'}`}>
                              Module {mod.module_number}
                            </span>
                            <span className={`text-sm font-serif ${mod.module_number === currentModuleNumber ? 'text-stone-900 font-medium' : 'text-stone-700'}`}>
                              {mod.module_title}
                            </span>
                            {mod.module_number === currentModuleNumber && (
                              <span className="ml-auto text-xs text-stone-500">
                                (current)
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}