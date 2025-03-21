import { useState, useEffect, useMemo, useRef } from 'react';
import { useWebsocket } from '../useWebsocket';
import { AudioQueue } from './AudioQueue';

type MessageType = {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  fileNames?: string[];
};

export const useChat = () => {
  const { online, socketSend, onmessage } = useWebsocket();
  const [messages, setMessages] = useState<MessageType[]>([firstAgentMessage]);
  const [isChatting, setIsChatting] = useState(false);
  const [lineCount, setLineCount] = useState<number | null>(null);
  console.log(messages)
  // Instantiate the AudioQueue

  const audioQueue = useMemo(
    () => {
      const onFileStarted = (message: MessageType) => {
        console.log('started playing:', message.content, message.fileNames[0]);
        setMessages((prev) => ([...prev, message]));
      }
      const onFileFinished = () => {
        setLineCount((prev) => prev - 1);
      }
      return new AudioQueue(onFileStarted, onFileFinished);
    },
    []
  );

  useEffect(() => {
    if (isChatting && lineCount === 0) {
      setIsChatting(false);
      setLineCount(null);
      setMessages((prev) => {
        // If there are no messages or no agent messages, return unchanged
        if (!prev || prev.length === 0) return prev;

        // Find the latest consecutive agent messages at the end of the array
        let lastAgentMessages = [];
        for (let i = prev.length - 1; i >= 0; i--) {
          if (prev[i].role === 'agent') {
            lastAgentMessages.unshift(prev[i]); // Add to start to keep order
          } else {
            break; // Stop when we hit a non-agent message
          }
        }

        // If there are no agent messages or only one, no need to concatenate
        if (lastAgentMessages.length <= 1) return prev;

        // Concatenate the latest agent messages
        const concatenatedContent = lastAgentMessages
          .map((msg) => msg.content)
          .join('\n');
        const latestTimestamp = lastAgentMessages[lastAgentMessages.length - 1].timestamp;
        const fileNames = lastAgentMessages.flatMap((msg) => msg.fileNames || []);

        // Keep all messages before the last agent sequence, then append the concatenated one
        const newMessages = prev.slice(0, prev.length - lastAgentMessages.length);
        newMessages.push({
          role: 'agent',
          content: concatenatedContent,
          timestamp: latestTimestamp,
          fileNames: fileNames.length > 0 ? fileNames : undefined, // Only include if there are files
        });

        return newMessages;
      });
    }
  }, [lineCount, isChatting]);

  console.log('lineCount:', lineCount)

  useEffect(() => {
    onmessage((event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'line-count') {
        setLineCount(data.count);
      }
      if (data.type === 'agent-message') {
        const { message } = data;
        console.log('agent-message:', message)
        if (message.content.trim().length && message.fileNames?.length) {
          message.timestamp = new Date().toISOString();
          setIsChatting(true); // Set to true when a new message arrives
          audioQueue.queueMessage(message);
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
    const messagesForServer = messages.map(({ role, content }) => ({ role, content }));

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

const firstAgentMessage: MessageType = {
  role: 'agent',
  content: `
Good Morning. 
How can I be of service?
`,
  timestamp: new Date().toISOString(),
  fileNames: ['tts_85320e37-46e3-4b37-a87b-23f5bfb7ef11.wav']
};