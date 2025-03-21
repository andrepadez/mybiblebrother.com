import { file } from 'bun';
import { AudioQueue } from './AudioQueue';

type MessageType = {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  fileNames?: string[];
};

export const useAudio = () => {
  const playFiles = (message: MessageType) => {
    const { fileNames } = message;
    if (!fileNames || fileNames.length === 0) return;

    const audioQueue = new AudioQueue();
    audioQueue.queueFiles(fileNames);

  };

  return { AudioQueue, playFiles };
}