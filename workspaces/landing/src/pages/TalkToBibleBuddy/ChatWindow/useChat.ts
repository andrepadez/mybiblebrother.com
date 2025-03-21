import { useState, useEffect, useMemo } from 'react';
import { useWebsocket } from '../useWebsocket';
import { AudioQueue } from './AudioQueue';

type MessageType = {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  fileName?: string;
};

export const useChat = () => {
  const { online, socketSend, onmessage } = useWebsocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  // Instantiate the AudioQueue
  const audioQueue = useMemo(
    () =>
      new AudioQueue(
        (message: MessageType) => {
          setMessages((prev) => [...prev, message]);
        },
        () => {
          // Set isChatting to false when the queue is finished
          setTimeout(() => setIsChatting(false), 500);
        }
      ),
    []
  );

  useEffect(() => {
    onmessage((event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'agent-message') {
        if (data.finished) {
          // No need to setIsChatting(false) here; AudioQueue handles it via onQueueFinished
          return;
        }
        const { message } = data;
        if (message.content.trim().length && message.fileName) {
          message.timestamp = new Date().toISOString();
          setIsChatting(true); // Set to true when a new message arrives
          audioQueue.queueAudio(message, message.fileName);
        }
      }
    });
  }, [onmessage, audioQueue]);


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
// 
// quote me a song from the book of Genesis and inspire me with it.