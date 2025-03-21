import { useIsMobile } from '@/hooks/use-mobile'

// Custom loading animation component
export const LoadingIndicator = () => {
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
