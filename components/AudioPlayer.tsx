'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

export default function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const [playing, setPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setMounted(true)
    audioRef.current = new Audio(audioUrl)
    
    const audio = audioRef.current
    audio.onended = () => setPlaying(false)

    return () => {
      if (audio) {
        audio.pause()
        audio.src = ''
      }
    }
  }, [audioUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-200 rounded-lg">
        <div className="w-10 h-10 bg-stone-200 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-stone-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-200 rounded-lg">
      <button
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center bg-stone-900 text-white rounded-full hover:bg-stone-800 transition"
      >
        {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-stone-700">
          <Volume2 size={16} />
          <span>Listen to this analysis</span>
        </div>
      </div>

      <a
        href={audioUrl}
        download
        className="text-xs text-stone-600 hover:text-stone-900"
      >
        Download MP3
      </a>
    </div>
  )
}