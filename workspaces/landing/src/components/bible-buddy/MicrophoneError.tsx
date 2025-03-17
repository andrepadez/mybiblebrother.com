
import React from 'react';
import { MicOff } from 'lucide-react';

export const MicrophoneError = () => {
  return (
    <div className="text-center text-red-500">
      <MicOff className="mx-auto mb-4" size={48} />
      <p>Microphone access denied. Please enable microphone access in your browser settings.</p>
    </div>
  );
};
