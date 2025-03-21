const VITE_AUDIO_URL = import.meta.env.VITE_AUDIO_URL;

type MessageType = {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  fileNames?: string[];
};

export class AudioQueue {
  private audioQueue: MessageType[] = [];
  private isPlaying: boolean = false;
  private onFileStarted?: (message: MessageType) => void;
  private onFileFinished?: (message: MessageType) => void;

  constructor(
    onFileStarted?: (message: MessageType) => void,
    onFileFinished?: (message: MessageType) => void
  ) {
    this.onFileStarted = onFileStarted;
    this.onFileFinished = onFileFinished;
  }

  private playNextAudio() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return; // No onQueueFinished needed, handled in useChat useEffect
    }

    this.isPlaying = true;
    const message = this.audioQueue.shift()!; // Get the next message
    const fileName = message.fileNames![0]; // Single file name as per your requirement
    const audio = new Audio(`${VITE_AUDIO_URL}/${fileName}`);

    // Trigger onFileStarted with the full message when playback starts
    audio.onplay = () => {
      if (this.onFileStarted) {
        this.onFileStarted(message);
      }
    };

    // Trigger onFileFinished with the message when playback ends, then play next
    audio.onended = () => {
      if (this.onFileFinished) {
        this.onFileFinished(message);
      }
      this.playNextAudio();
    };

    // Handle errors by logging and moving to the next audio
    audio.onerror = () => {
      console.error(`Failed to play audio: ${fileName}`);
      this.playNextAudio();
    };

    audio.play().catch((error) => {
      console.error(`Error playing audio: ${fileName}`, error);
      this.playNextAudio();
    });
  }

  public queueMessage(message: MessageType) {
    this.audioQueue.push(message);
    if (!this.isPlaying) {
      this.playNextAudio();
    }
  }

  // Removing queueFiles since you’re only enqueuing one file per message now
}