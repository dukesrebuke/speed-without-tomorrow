'use client'

import { useState, useEffect } from 'react'
import { Practice } from '@/types/database'

interface PracticeCardProps {
  practice: Practice
  onComplete?: () => void
}

export default function PracticeCard({ practice, onComplete }: PracticeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    if (!isTimerRunning || timeRemaining === null) return

    if (timeRemaining <= 0) {
      setIsTimerRunning(false)
      return
    }

    const interval = setInterval(() => {
      setTimeRemaining(t => t ? t - 1 : 0)
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning, timeRemaining])

  const startTimer = () => {
    if (practice.duration_minutes) {
      setTimeRemaining(practice.duration_minutes * 60)
      setIsTimerRunning(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPracticeTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      meditation: 'bg-purple-100 text-purple-800',
      writing: 'bg-blue-100 text-blue-800',
      observation: 'bg-green-100 text-green-800',
      dialogue: 'bg-orange-100 text-orange-800',
      embodied: 'bg-pink-100 text-pink-800',
      creative: 'bg-yellow-100 text-yellow-800',
      study: 'bg-indigo-100 text-indigo-800',
    }
    return colors[type] || 'bg-stone-100 text-stone-800'
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-stone-50 transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPracticeTypeColor(practice.practice_type)}`}>
                {practice.practice_type}
              </span>
              {practice.duration_minutes && (
                <span className="text-xs text-stone-500">
                  {practice.duration_minutes} min
                </span>
              )}
            </div>
            <h3 className="text-lg font-serif text-stone-900">{practice.title}</h3>
          </div>
          <svg 
            className={`w-5 h-5 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-stone-100">
          <div className="mt-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-stone-900 mb-3">Instructions</h4>
              <div className="prose prose-sm prose-stone max-w-none">
                {practice.instructions.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-3 text-stone-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {practice.duration_minutes && (
              <div className="flex items-center gap-4">
                {timeRemaining !== null ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono text-stone-900">
                      {formatTime(timeRemaining)}
                    </span>
                    {isTimerRunning ? (
                      <button
                        onClick={() => setIsTimerRunning(false)}
                        className="px-4 py-2 text-sm border border-stone-300 rounded hover:bg-stone-50 transition"
                      >
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsTimerRunning(true)}
                        className="px-4 py-2 text-sm bg-stone-900 text-white rounded hover:bg-stone-800 transition"
                      >
                        Resume
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setTimeRemaining(null)
                        setIsTimerRunning(false)
                      }}
                      className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition"
                    >
                      Reset
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startTimer}
                    className="px-6 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 transition"
                  >
                    Start Timer ({practice.duration_minutes} min)
                  </button>
                )}
              </div>
            )}

            {practice.reflection_prompt && (
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-stone-900 mb-2">Reflection</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {practice.reflection_prompt}
                </p>
              </div>
            )}

            {onComplete && (
              <button
                onClick={onComplete}
                className="w-full px-6 py-3 border-2 border-stone-900 text-stone-900 rounded hover:bg-stone-900 hover:text-white transition font-medium"
              >
                Mark as Complete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
