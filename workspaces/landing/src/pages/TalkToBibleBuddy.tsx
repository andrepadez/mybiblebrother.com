
import React from 'react';
import { MicrophonePermission } from '@/components/bible-buddy/MicrophonePermission';
import { MicrophoneError } from '@/components/bible-buddy/MicrophoneError';
import { LoadingIndicator } from '@/components/bible-buddy/LoadingIndicator';
import { AudioRecorder } from '@/components/bible-buddy/AudioRecorder';
import { TranscriptionList } from '@/components/bible-buddy/TranscriptionList';
import { useMicrophoneRecorder } from '@/hooks/useMicrophoneRecorder';

const TalkToBibleBuddy = () => {
  const {
    micPermission,
    isRecording,
    audioBlob,
    isSubmitting,
    transcriptions,
    audioRef,
    requestMicPermission,
    startRecording,
    stopRecording,
    playRecording,
    clearTranscriptions
  } = useMicrophoneRecorder();

  return (
    <div className="min-h-screen bg-bible-light pt-16 pb-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl font-bold text-bible-wood mb-12 text-center">
            Talk to Your Bible Buddy
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-10 flex flex-col items-center">
            {micPermission === null ? (
              <MicrophonePermission onRequestPermission={requestMicPermission} />
            ) : micPermission === false ? (
              <MicrophoneError />
            ) : isSubmitting ? (
              <LoadingIndicator />
            ) : (
              <>
                <AudioRecorder 
                  isRecording={isRecording}
                  audioBlob={audioBlob}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  playRecording={playRecording}
                />
                
                <audio ref={audioRef} className="hidden" />
                
                <TranscriptionList 
                  transcriptions={transcriptions}
                  onClear={clearTranscriptions} 
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalkToBibleBuddy;
