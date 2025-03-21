export const UserChatBubble = ({ message }) => {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl px-4 py-2 grid bg-bible-skyblue text-white rounded-tr-none">
        <div className="grid grid-cols-[1fr,auto] gap-2 items-center">
          <p className="text-sm">{message.content}</p>
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
