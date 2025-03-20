import React, { useState, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { useIsMobile } from '@/hooks/use-mobile'
import { Mic, Play, AudioWaveform } from 'lucide-react'
import { InputForm } from './InputForm'
import { useMicrophone } from './useMicrophone'
import { useChat } from './useChat'

interface Message {
  text: string
  timestamp: string
  isUser: boolean
}

interface ChatWindowProps {
  messages: Message[]
}

export const ChatWindow = ({ messages }: ChatWindowProps) => {
  const isMobile = useIsMobile()
  const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null)
  const microphone = useMicrophone()
  const { micPermission, isRecording, audioBlob } = microphone
  const { requestMicPermission, startRecording, stopRecording } = microphone
  const { transcription, setTranscription, isTranscribing } = useChat(audioBlob)
  const contentEditableRef = useRef<HTMLDivElement>(null)

  // Handle input changes from the contentEditable div
  const handleContentChange = () => {
    if (contentEditableRef.current) {
      setTranscription(contentEditableRef.current.innerText)
    }
  }

  const handleSubmit = () => {
    // Handle message submission here
    setTranscription('')
  }

  const handleRecordPress = async () => {
    if (!micPermission) {
      await requestMicPermission()
      return
    }
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleRecordRelease = () => {
    // setIsRecording(false)
    // Handle recording completion here
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
        <h2 className="text-lg font-semibold text-center">Bible Buddy</h2>
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
        <div className="flex items-center gap-3">
          <InputForm value={transcription} onSubmit={handleSubmit} onChange={setTranscription} />
          {/* Microphone button outside the form on desktop */}
          <button
            type="button"
            className={`flex items-center justify-center rounded-full transition-all ${
              isRecording
                ? 'bg-red-500 animate-pulse'
                : 'bg-bible-skyblue hover:bg-bible-skyblue/90'
            } ${isMobile ? 'h-8 w-8 ml-[-48px]' : 'h-16 w-16'}`}
            onMouseDown={handleRecordPress}
            onMouseUp={handleRecordRelease}
            onTouchStart={handleRecordPress}
            onTouchEnd={handleRecordRelease}
          >
            {isRecording ? (
              <AudioWaveform className={`text-white ${isMobile ? 'h-4 w-4' : 'h-8 w-8'}`} />
            ) : (
              <Mic className={`text-white ${isMobile ? 'h-4 w-4' : 'h-8 w-8'}`} />
            )}
          </button>
        </div>
      </div>
    </Card>
  )
}
