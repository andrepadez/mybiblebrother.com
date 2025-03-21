import type { useTranscribeType } from '../useTranscribe'
import type { useChatType } from '../useChat'
import { useRef, useEffect } from 'react'
import { Send, Mic, AudioWaveform } from 'lucide-react'
import { LoadingIndicator } from './LoadingIndicator'
import { useIsMobile } from '@/hooks/use-mobile'
import { useChat } from '../useChat'

type InputFormProps = {
  transcribe: useTranscribeType
  chat: useChatType
}

export const InputForm = ({ transcribe, chat }: InputFormProps) => {
  const isMobile = useIsMobile()
  const contentEditableRef = useRef<HTMLDivElement>(null)
  const { transcription, isTranscribing, setTranscription } = transcribe
  const { isRecording, handleRecordPress } = transcribe
  const { sendMessage } = chat

  const disabled = isTranscribing || isRecording

  const onChange = (ev: React.ChangeEvent<HTMLDivElement>) => {
    const newValue = ev.target.innerText
    setTranscription(newValue)

    // Restore cursor position
    const selection = window.getSelection()
    if (selection && contentEditableRef.current) {
      const range = document.createRange()
      range.selectNodeContents(contentEditableRef.current)
      range.collapse(false) // collapse to end
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  // Add this to initialize the content when component mounts or value changes externally
  useEffect(() => {
    if (
      contentEditableRef.current &&
      transcription !== null &&
      contentEditableRef.current.innerText !== transcription
    ) {
      contentEditableRef.current.innerText = transcription
    }
  }, [transcription])

  const onKeyDown = async (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault()
      await sendMessage(transcription)
      setTranscription('')
    }
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    await sendMessage(transcription)
    setTranscription('')
  }

  return (
    <div className="flex w-full justify-between items-center gap-3">
      <form
        onSubmit={onSubmit}
        className="flex items-center bg-[#F1F1F1] rounded-full px-4 py-2 flex-1"
      >
        <div
          ref={contentEditableRef}
          contentEditable="true"
          className="flex-grow bg-transparent min-h-[24px] max-h-[100px] overflow-y-auto whitespace-pre-wrap focus:outline-none text-sm py-1 pl-3"
          onInput={onChange}
          onKeyDown={onKeyDown}
          data-placeholder="Message Bible Buddy..."
          role="textbox"
          aria-multiline="true"
          aria-label="Message input"
          style={{ wordBreak: 'break-word' }}
        ></div>

        {transcription && (
          <button
            type="submit"
            className={`ml-2 p-2 rounded-full transition-colors ${
              disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-bible-skyblue hover:bg-bible-skyblue/10'
            }`}
            aria-label="Send message"
            disabled={disabled}
          >
            <Send size={36} />
          </button>
        )}
      </form>
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
  )
}
