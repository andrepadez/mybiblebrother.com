
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Play } from 'lucide-react';

interface AudioRecorderProps {
  isRecording: boolean;
  audioBlob: Blob | null;
  startRecording: () => void;
  stopRecording: () => void;
  playRecording: () => void;
}

export const AudioRecorder = ({
  isRecording,
  audioBlob,
  startRecording,
  stopRecording,
  playRecording,
}: AudioRecorderProps) => {
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="text-center">
        <p className="mb-6 text-lg">Press and hold to record your question</p>
      </div>
      
      <button
        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
          isRecording 
            ? "bg-red-500 scale-110" 
            : "bg-bible-skyblue hover:bg-bible-skyblue/90"
        }`}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
      >
        <Mic className="text-white" size={48} />
      </button>
      
      {audioBlob && (
        <div className="mt-4 text-center">
          <p className="mb-4">Recording complete! Listen to your question:</p>
          <Button
            onClick={playRecording}
            className="bg-bible-scripture hover:bg-bible-scripture/90 flex items-center gap-2"
          >
            <Play size={18} />
            Play Recording
          </Button>
        </div>
      )}
    </div>
  );
};
