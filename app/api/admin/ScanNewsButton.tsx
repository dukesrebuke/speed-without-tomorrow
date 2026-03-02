'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

export default function ScanNewsButton({ onScanComplete }: { onScanComplete?: () => void }) {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runScan = async () => {
    setScanning(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/scan-news', {
        method: 'POST'
      })

      const data = await response.json()
      setResult(data)

      if (data.success && onScanComplete) {
        setTimeout(onScanComplete, 1000)
      }
    } catch (error) {
      console.error('Scan error:', error)
      setResult({ error: 'Scan failed' })
    } finally {
      setScanning(false)
    }
  }

  return (
    <div>
      <button
        onClick={runScan}
        disabled={scanning}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
      >
        <RefreshCw size={16} className={scanning ? 'animate-spin' : ''} />
        {scanning ? 'Scanning News...' : 'Scan News'}
      </button>

      {result && (
        <div className={`mt-3 p-3 rounded text-sm ${
          result.success 
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {result.success ? (
            <>
              ✓ Scanned {result.scanned} articles, found {result.candidates_found} relevant stories
            </>
          ) : (
            <>
              ✗ {result.error}: {result.details}
            </>
          )}
        </div>
      )}
    </div>
  )
}