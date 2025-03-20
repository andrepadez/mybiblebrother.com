import React, { useState, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { useIsMobile } from '@/hooks/use-mobile'
import { Mic, Play, AudioWaveform } from 'lucide-react'
import { InputForm } from './InputForm'
import { useMicrophone } from './useMicrophone'
import { useTranscribe } from './useTranscribe'

interface Message {
  text: string
  timestamp: string
  isUser: boolean
}

interface ChatWindowProps {
  messages: Message[]
}

// Custom loading animation component
const LoadingIndicator = () => {
  const isMobile = useIsMobile()
  return (
    <div className="flex items-center justify-center gap-1">
      <span
        className={`inline-block w-2 h-2 rounded-full bg-white animate-[pulse_1.5s_ease-in-out_infinite] ${
          isMobile ? 'w-1 h-1' : ''
        }`}
        style={{ animationDelay: '0s' }}
      />
      <span
        className={`inline-block w-2 h-2 rounded-full bg-white animate-[pulse_1.5s_ease-in-out_infinite] ${
          isMobile ? 'w-1 h-1' : ''
        }`}
        style={{ animationDelay: '0.3s' }}
      />
      <span
        className={`inline-block w-2 h-2 rounded-full bg-white animate-[pulse_1.5s_ease-in-out_infinite] ${
          isMobile ? 'w-1 h-1' : ''
        }`}
        style={{ animationDelay: '0.6s' }}
      />
    </div>
  )
}

export const ChatWindow = ({ messages }: ChatWindowProps) => {
  const isMobile = useIsMobile()
  const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null)
  const microphone = useMicrophone()
  const { isRecording, audioBlob } = microphone
  const { transcription, setTranscription, isTranscribing, handleRecordPress } =
    useTranscribe(audioBlob)

  const handleSubmit = () => {
    // Handle message submission here
    setTranscription('')
  }

  const handlePlayMessage = (index: number) => {
    // Toggle playing state for the message
    setPlayingMessageIndex(playingMessageIndex === index ? null : index)
    // Here you would implement actual audio playback functionality
    console.log('Playing message:', messages[index].text)
  }

  return (
    <Card
      className={`w-full mx-auto h-[calc(100vh-140px)] bg-[#F6F6F7] overflow-hidden flex flex-col ${isMobile ? 'rounded-none' : ''}`}
    >
      {/* Header */}
      <div className="bg-white p-4 border-b">
        <h2 className="text-lg font-semibold text-center">Bible Pal</h2>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 grid ${
                  message.isUser
                    ? 'bg-bible-skyblue text-white rounded-tr-none'
                    : 'bg-white rounded-tl-none'
                }`}
              >
                <div
                  className={`grid grid-cols-[1fr,auto] gap-2 items-center ${!message.isUser ? 'mb-1' : ''}`}
                >
                  <p className="text-sm">{message.text}</p>
                  {/* Play button - only for non-user messages */}
                  {!message.isUser && (
                    <button
                      onClick={() => handlePlayMessage(index)}
                      className={`justify-self-end self-center p-2 rounded-full flex-shrink-0 transition-all shadow-sm
                        ${
                          playingMessageIndex === index
                            ? 'bg-bible-skyblue text-white shadow-md scale-105'
                            : 'bg-bible-skyblue text-white border border-bible-skyblue/30 hover:bg-bible-skyblue/90'
                        }`}
                      aria-label="Play message"
                    >
                      <Play
                        size={isMobile ? 18 : 22}
                        className="flex-shrink-0"
                        fill={playingMessageIndex === index ? 'white' : 'none'}
                        strokeWidth={2}
                      />
                    </button>
                  )}
                </div>
                <p className="text-[10px] opacity-70 justify-self-start">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex justify-between items-center gap-3">
          <InputForm
            value={transcription}
            onSubmit={handleSubmit}
            onChange={setTranscription}
            disabled={isTranscribing || isRecording}
          />
          {/* Microphone button outside the form on desktop */}
          <div>
            <button
              type="button"
              className={`flex items-center justify-center rounded-full transition-all ${
                isTranscribing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isRecording
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-bible-skyblue hover:bg-bible-skyblue/90'
              } ${isMobile ? 'h-8 w-8 ml-[-48px]' : 'h-16 w-16'}`}
              onMouseDown={handleRecordPress}
              // onMouseUp={handleRecordRelease}
              onTouchStart={handleRecordPress}
              // onTouchEnd={handleRecordRelease}
              disabled={isTranscribing}
            >
              {isTranscribing ? (
                <LoadingIndicator />
              ) : isRecording ? (
                <AudioWaveform className={`text-white ${isMobile ? 'h-4 w-4' : 'h-8 w-8'}`} />
              ) : (
                <Mic className={`text-white ${isMobile ? 'h-4 w-4' : 'h-8 w-8'}`} />
              )}
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
