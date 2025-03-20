import { useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

type InputFormProps = {
  value: string | null
  onChange: (value: string) => void
  onSubmit: (value: string) => void
}

export const InputForm = ({ value, onSubmit, onChange }: InputFormProps) => {
  const contentEditableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value && contentEditableRef.current) {
      contentEditableRef.current.innerText = value
    }
  }, [value, contentEditableRef])

  const onKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter' && !e.shiftKey) {
      ev.preventDefault()
      onSubmit()
    }
  }

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    onSubmit(value)
  }

  const handleChange = (ev: React.ChangeEvent<HTMLDivElement>) => {
    onChange(ev.target.innerText)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-[#F1F1F1] rounded-full px-4 py-2 w-full"
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
          className="ml-2 p-2 rounded-full text-bible-skyblue hover:bg-bible-skyblue/10 transition-colors"
          aria-label="Send message"
        >
          <Send size={36} />
        </button>
      )}
    </form>
  )
}
