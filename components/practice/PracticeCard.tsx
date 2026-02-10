'use client'

import { useState } from 'react'
import type { Practice } from '@/types/database'

interface PracticeCardProps {
  practice: Practice
  isCompleted: boolean
  onToggleCompletion: () => void
}

export default function PracticeCard({ 
  practice, 
  isCompleted, 
  onToggleCompletion 
}: PracticeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const practiceTypeLabels: Record<string, string> = {
    meditation: 'Meditation',
    writing: 'Writing',
    embodied: 'Embodied Practice',
    observation: 'Observation',
    contemplation: 'Contemplation'
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header - Always Visible */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                {practiceTypeLabels[practice.practice_type] || practice.practice_type}
              </span>
              {practice.duration_minutes && (
                <span className="text-xs text-stone-400">
                  {practice.duration_minutes} min
                </span>
              )}
            </div>
            <h3 className="text-xl font-serif text-stone-900 mb-3">
              {practice.title}
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-stone-600 hover:text-stone-900 underline"
            >
              {isExpanded ? 'Hide Instructions' : 'View Instructions'}
            </button>
          </div>

          {/* Completion Checkbox */}
          <button
            onClick={onToggleCompletion}
            className={`flex-shrink-0 w-6 h-6 rounded border-2 transition ${
              isCompleted
                ? 'bg-stone-900 border-stone-900'
                : 'bg-white border-stone-300 hover:border-stone-400'
            }`}
          >
            {isCompleted && (
              <svg
                className="w-full h-full text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-stone-200 p-6 bg-stone-50">
          {/* Instructions */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-stone-700 mb-3">Instructions</h4>
            <div className="prose prose-stone prose-sm max-w-none">
              {practice.instructions.split('\n\n').map((paragraph, i) => {
                // Handle markdown-style bold
                const formattedParagraph = paragraph
                  .split('**')
                  .map((part, idx) => 
                    idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                  )

                return (
                  <p key={i} className="mb-3 text-stone-700 leading-relaxed">
                    {formattedParagraph}
                  </p>
                )
              })}
            </div>
          </div>

          {/* Reflection Prompt */}
          {practice.reflection_prompt && (
            <div className="pt-4 border-t border-stone-200">
              <h4 className="text-sm font-semibold text-stone-700 mb-2">
                Reflection Prompt
              </h4>
              <p className="text-sm text-stone-600 italic leading-relaxed">
                {practice.reflection_prompt}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
