import { Play } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/cn'

export const AgentChatBubble = ({ message }) => {
  const isMobile = useIsMobile()
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[80%] rounded-2xl px-4 py-2 grid bg-white rounded-tl-none">
        <div
          className={`grid grid-cols-[1fr,auto] gap-2 items-center ${message.role === 'agent' ? 'mb-1' : ''}`}
        >
          <p className="text-sm">{message.content}</p>
          {/* Play button - only for non-user messages */}
          {message.role === 'agent' && (
            <button
              // onClick={() => handlePlayMessage(index)}
              className={cn(
                `justify-self-end self-center p-2 rounded-full flex-shrink-0 transition-all shadow-sm`
                // playingMessageIndex === index
                //   ? 'bg-bible-skyblue text-white shadow-md scale-105'
                //   : 'bg-bible-skyblue text-white border border-bible-skyblue/30 hover:bg-bible-skyblue/90'
              )}
              aria-label="Play message"
            >
              <Play
                size={isMobile ? 18 : 22}
                className="flex-shrink-0"
                // fill={playingMessageIndex === index ? 'white' : 'none'}
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
  )
}
