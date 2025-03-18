import React from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface TranscriptionResult {
  text: string
  timestamp: string
}

interface TranscriptionListProps {
  transcriptions: TranscriptionResult[]
  onClear: () => void
}

export const TranscriptionList = ({ transcriptions, onClear }: TranscriptionListProps) => {
  if (transcriptions.length === 0) return null

  return (
    <div className="mt-8 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Questions</h2>
        <Button
          variant="destructive"
          size="sm"
          onClick={onClear}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Clear History
        </Button>
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {transcriptions.map((item, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-gray-800 text-wrap">{item.text}</pre>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
