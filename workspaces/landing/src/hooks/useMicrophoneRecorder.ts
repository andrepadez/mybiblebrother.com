
import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface TranscriptionResult {
  text: string;
  timestamp: string;
}

const LOCAL_STORAGE_KEY = 'bible-buddy-transcriptions';

export const useMicrophoneRecorder = () => {
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptionResult[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Load transcriptions from localStorage on mount
  useEffect(() => {
    const savedTranscriptions = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTranscriptions) {
      try {
        setTranscriptions(JSON.parse(savedTranscriptions));
      } catch (error) {
        console.error('Error parsing saved transcriptions:', error);
      }
    }
  }, []);

  // Save transcriptions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transcriptions));
  }, [transcriptions]);

  // Check microphone permission on mount
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
      sendAudioToAPI(audioBlob);
    };
    
    mediaRecorderRef.current = mediaRecorder;
  };

  // Start recording when the button is pressed
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

  // Clear all transcriptions
  const clearTranscriptions = () => {
    setTranscriptions([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast({
      title: "Transcriptions Cleared",
      description: "All your conversation history has been deleted.",
    });
  };

  // Format history for API
  const formatHistoryForAPI = () => {
    return transcriptions.map(item => ({
      text: item.text,
      timestamp: item.timestamp
    }));
  };

  // Send audio to API
  const sendAudioToAPI = async (audioBlob: Blob) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      formData.append('model', 'base');
      formData.append('language', 'en');
      formData.append('initial_prompt', 'string');
      formData.append('vad_filter', 'false');
      formData.append('min_silence_duration_ms', '1000');
      formData.append('response_format', 'text');
      formData.append('timestamp_granularities', 'segment');
      
      // Add conversation history to the request
      formData.append('history', JSON.stringify(formatHistoryForAPI()));

      const response = await fetch(
        'https://e90d-2a12-26c0-2105-1f00-84db-fc8b-f-9a95.ngrok-free.app/v1/transcriptions',
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer dummy_api_key',
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      
      // Only add the transcription if there's actual text content
      if (result.text && result.text.trim() !== '') {
        // Add new transcription to the list
        const newTranscription = {
          text: result.text,
          timestamp: new Date().toISOString(),
        };
        
        setTranscriptions(prev => [newTranscription, ...prev]);
        toast({
          title: "Transcription Complete",
          description: "Your audio has been processed successfully.",
        });
      } else {
        // Provide feedback when no text was detected
        toast({
          title: "No Speech Detected",
          description: "No transcribable speech was detected in your recording.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error sending audio to API:', error);
      toast({
        title: "Transcription Failed",
        description: "There was an error processing your audio.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
