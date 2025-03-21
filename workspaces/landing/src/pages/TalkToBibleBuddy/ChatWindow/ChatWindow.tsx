import { useState, useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { useIsMobile } from '@/hooks/use-mobile'
import { UserChatBubble, AgentChatBubble, WaitingChatBubble } from './ChatBubbles'
import { InputForm } from './InputForm'
import { useTranscribe } from './useTranscribe'
import { useChat } from './useChat'

interface Message {
  content: string
  timestamp: string
  role: 'user' | 'agent'
}

export const ChatWindow = () => {
  const isMobile = useIsMobile()
  const transcribe = useTranscribe()
  const chat = useChat()
  const { messages, online, isChatting } = chat

  const messagesEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <Card
      className={`w-full mx-auto h-[calc(100vh-140px)] bg-[#F6F6F7] overflow-hidden flex flex-col ${isMobile ? 'rounded-none' : ''}`}
    >
      {/* Header */}
      <div className="bg-white p-4 border-b relative flex items-center justify-between">
        <div></div>
        <h2 className="text-lg font-semibold text-center">Sarah</h2>
        <div
          className={`size-4 ${online ? 'bg-green-500' : 'bg-red-500'} top-0 right-0 rounded-full`}
        ></div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message, idx) => {
            return message.role === 'user' ? (
              <UserChatBubble key={idx} message={message} />
            ) : (
              <AgentChatBubble key={idx} message={message} />
            )
          })}
          {isChatting && <WaitingChatBubble />}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex justify-between items-center gap-3">
          <InputForm transcribe={transcribe} chat={chat} />
        </div>
      </div>
    </Card>
  )
}

// const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null)
// const handlePlayMessage = (index: number) => {
//   // Toggle playing state for the message
//   setPlayingMessageIndex(playingMessageIndex === index ? null : index)
//   // Here you would implement actual audio playback functionality
//   console.log('Playing message:', messages[index].content)
// }
