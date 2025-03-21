const VITE_AUDIO_URL = import.meta.env.VITE_AUDIO_URL;
type MessageType = {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  fileName?: string;
};

interface AudioQueueItem {
  message: MessageType;
  fileName: string;
}

export class AudioQueue {
  private audioQueue: AudioQueueItem[] = [];
  private isPlaying: boolean = false;
  private onQueueFinished: () => void;
  private addMessage: (message: MessageType) => void;

  constructor(
    addMessage: (message: MessageType) => void,
    onQueueFinished: () => void
  ) {
    this.addMessage = addMessage;
    this.onQueueFinished = onQueueFinished;
  }

  private playNextAudio() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      this.onQueueFinished(); // Call the callback when the queue is empty
      return;
    }

    this.isPlaying = true;
    const { message, fileName } = this.audioQueue.shift()!; // Get the next item in the queue
    const audio = new Audio(`${VITE_AUDIO_URL}/${fileName}`);

    // Add the message to the state when the audio starts playing
    audio.onplay = () => {
      this.addMessage(message);
    };

    // Play the next audio when this one ends
    audio.onended = () => {
      this.playNextAudio();
    };

    audio.onerror = () => {
      console.error(`Failed to play audio: ${fileName}`);
      this.playNextAudio();
    };

    audio.play().catch((error) => {
      console.error(`Error playing audio: ${fileName}`, error);
      this.playNextAudio();
    });
  }

  public queueAudio(message: MessageType, fileName: string) {
    this.audioQueue.push({ message, fileName });

    // Start playing if nothing is currently playing
    if (!this.isPlaying) {
      this.playNextAudio();
    }
  }
}