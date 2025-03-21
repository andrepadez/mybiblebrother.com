import { useState, useEffect } from 'react';
import { useWebsocket } from '../useWebsocket';
const { VITE_API_URL } = import.meta.env;


type MessageType = {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
};

export const useChat = () => {
  const { online, socketSend, onmessage } = useWebsocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    onmessage((event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'agent-message') {
        data.message.timestamp = new Date().toISOString();
        setMessages(prev => [...prev, data.message]);
        if (data.finished) setTimeout(() => setIsChatting(false), 500);
      }
    });
  }, [])


  const sendMessage = async (text: string) => {
    const timestamp = new Date().toISOString();
    // Keep timestamp in the local message object
    const message = { role: 'user' as const, content: text, timestamp } as MessageType;
    const newMessages: MessageType[] = [...messages, message];

    // Create versions without timestamp for server
    const messageForServer = { role: 'user' as const, content: text };
    const messagesForServer = newMessages.map(({ role, content }) => ({ role, content }));

    socketSend({
      type: 'user-message',
      message: messageForServer,
      messages: messagesForServer,
    });

    setMessages(_ => newMessages);
    setIsChatting(true);
  };

  return { sendMessage, messages, online, isChatting };
}

export type useChatType = ReturnType<typeof useChat>



// const response = await fetch(
//   `${VITE_API_URL}/chat`,
//   {
//     method: 'POST',
//     headers: {
//       'accept': 'application/json',
//       // 'Authorization': 'Bearer dummy_api_key',
//     },
//     body: JSON.stringify({ message }),
//   }
// );