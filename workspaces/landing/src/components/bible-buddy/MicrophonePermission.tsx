
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

interface MicrophonePermissionProps {
  onRequestPermission: () => Promise<void>;
}

export const MicrophonePermission = ({ onRequestPermission }: MicrophonePermissionProps) => {
  return (
    <div className="text-center">
      <p className="mb-6 text-lg">Allow your Bible Buddy to hear your questions.</p>
      <Button 
        onClick={onRequestPermission} 
        className="bg-bible-skyblue hover:bg-bible-skyblue/90 flex items-center gap-2 text-white px-6 py-2 text-lg h-auto"
      >
        <Mic size={20} />
        Turn on microphone
      </Button>
    </div>
  );
};
