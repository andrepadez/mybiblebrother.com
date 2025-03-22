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
  private currentMessageFiles: string[] = []; // Track files for the current message
  private currentMessage?: MessageType; // Track the current message being played

  constructor(
    onFileStarted?: (message: MessageType) => void,
    onFileFinished?: (message: MessageType) => void
  ) {
    this.onFileStarted = onFileStarted;
    this.onFileFinished = onFileFinished;
  }

  private playNextFile() {
    // If there are no more files in the current message, move to the next message
    if (this.currentMessageFiles.length === 0) {
      if (this.audioQueue.length === 0) {
        this.isPlaying = false;
        this.currentMessage = undefined;
        return; // Queue is done
      }

      // Get the next message and its files
      this.currentMessage = this.audioQueue.shift()!;
      this.currentMessageFiles = this.currentMessage.fileNames?.slice() || []; // Copy the fileNames array
      this.playNextFile(); // Recursively call to start playing the first file
      return;
    }

    this.isPlaying = true;
    const fileName = this.currentMessageFiles.shift()!; // Get the next file from the current message
    const audio = new Audio(`${VITE_AUDIO_URL}/audio/${fileName}`);

    // Trigger onFileStarted with the full message when playback starts
    audio.onplay = () => {
      if (this.onFileStarted && this.currentMessage) {
        this.onFileStarted(this.currentMessage);
      }
    };

    // Trigger onFileFinished with the message when playback ends, then play next file
    audio.onended = () => {
      console.log('finished playing:', this.currentMessage.content);
      if (this.onFileFinished && this.currentMessage) {
        console.log('this.onFileFinished');
        this.onFileFinished(this.currentMessage);
      }
      this.playNextFile();
    };

    // Handle errors by logging and moving to the next file
    audio.onerror = () => {
      console.error(`Failed to play audio: ${fileName}`);
      this.playNextFile();
    };

    audio.play().catch((error) => {
      console.error(`Error playing audio: ${fileName}`, error);
      this.playNextFile();
    });
  }

  public queueMessage(message: MessageType) {
    this.audioQueue.push(message);
    if (!this.isPlaying) {
      this.playNextFile();
    }
  }
}