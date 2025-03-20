import { useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

type InputFormProps = {
  value: string | null
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  disabled?: boolean
}

export const InputForm = ({ value, onSubmit, onChange, disabled }: InputFormProps) => {
  const contentEditableRef = useRef<HTMLDivElement>(null)

  const handleChange = (ev: React.ChangeEvent<HTMLDivElement>) => {
    const newValue = ev.target.innerText
    onChange(newValue)

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
      value !== null &&
      contentEditableRef.current.innerText !== value
    ) {
      contentEditableRef.current.innerText = value
    }
  }, [value])

  const onKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault()
      onSubmit(value)
    }
  }

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    onSubmit(value)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-[#F1F1F1] rounded-full px-4 py-2 flex-1"
    >
      <div
        ref={contentEditableRef}
        contentEditable="true"
        className="flex-grow bg-transparent min-h-[24px] max-h-[100px] overflow-y-auto whitespace-pre-wrap focus:outline-none text-sm py-1 pl-3"
        onInput={handleChange}
        onKeyDown={onKeyDown}
        data-placeholder="Message Bible Buddy..."
        role="textbox"
        aria-multiline="true"
        aria-label="Message input"
        style={{ wordBreak: 'break-word' }}
      ></div>

      {value && (
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
  )
}
