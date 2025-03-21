import { useMemo } from 'react'; // Add useMemo for creating the AudioQueue instance
import { AudioQueue } from './AudioQueue';

type MessageType = {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  fileNames?: string[];
};

export const useAudio = () => {
  // Instantiate a separate AudioQueue instance for the play button use case
  const audioQueue = useMemo(() => {
    const onFileStarted = (message: MessageType) => {
      console.log('Started playing file for message:', message.content);
    };
    const onFileFinished = (message: MessageType) => {
      console.log('Finished playing file for message:', message.content);
    };
    return new AudioQueue(onFileStarted, onFileFinished);
  }, []);

  const playMessage = (message: MessageType) => {
    if (message.fileNames && message.fileNames.length > 0) {
      audioQueue.queueMessage(message); // Queue the message with multiple files
    }
  };

  return { AudioQueue, playMessage };
};