import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useMicrophone = () => {
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        // Check if permission was already granted
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasMicrophonePermission = devices.some(
          device => device.kind === 'audioinput' && device.label !== ''
        );

        if (hasMicrophonePermission) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicPermission(true);
          setupMediaRecorder(stream);
        }
      } catch (error) {
        // If there's an error, we'll wait for the user to request permission
        console.log('Microphone permission not yet granted');
      }
    };

    checkMicPermission();
  }, []);

  // Request microphone permission
  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
      setupMediaRecorder(stream);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMicPermission(false);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check your settings.",
        variant: "destructive",
      });
    }
  };

  // Set up the media recorder with the stream
  const setupMediaRecorder = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstart = () => {
      audioChunksRef.current = [];
    };

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioBlob(audioBlob);
      // sendAudioToAPI(audioBlob);
    };

    mediaRecorderRef.current = mediaRecorder;
  };

  const startRecording = () => {
    if (mediaRecorderRef.current && !isRecording) {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  // Stop recording when the button is released
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Play recorded audio
  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  return {
    micPermission,
    isRecording,
    audioBlob,
    audioRef,
    requestMicPermission,
    startRecording,
    stopRecording,
    playRecording,
  };
}