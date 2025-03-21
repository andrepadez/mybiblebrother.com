import { ChatWindow } from './ChatWindow'
import { useIsMobile } from '@/hooks/use-mobile'

export const TalkToBibleBuddy = () => {
  const isMobile = useIsMobile()

  // Expanded mock data with more messages
  const mockMessages = []

  return (
    <div className="h-screen overflow-hidden bg-bible-light pt-16">
      <div className={`mx-auto ${isMobile ? 'w-full' : 'container px-4'}`}>
        <ChatWindow />
      </div>
    </div>
  )
}
