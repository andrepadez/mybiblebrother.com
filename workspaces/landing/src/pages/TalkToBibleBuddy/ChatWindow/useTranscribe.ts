import { useState, useEffect } from 'react';
import { useMicrophone } from './useMicrophone'
const { VITE_API_URL } = import.meta.env;

export const useTranscribe = () => {
  const microphone = useMicrophone()
  const { isRecording, audioBlob, micPermission } = microphone
  const { startRecording, stopRecording, requestMicPermission } = microphone
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [blob, setBlob] = useState<Blob | null>(() => audioBlob);
  const [transcription, setTranscription] = useState<string | null>(null);

  const transcribe = async () => {
    const result = await sendAudio(blob!);
    setTranscription(result.text);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsTranscribing(false);
    setBlob(null);
  }

  useEffect(() => {
    setBlob(audioBlob);
  }, [audioBlob]);

  useEffect(() => {
    if (blob) {
      setIsTranscribing(true);
      transcribe();
    } if (!blob) {
      setIsTranscribing(false);
    }
  }, [blob]);

  const handleRecordPress = async () => {
    if (!micPermission) {
      await requestMicPermission()
      return
    }
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return { transcription, setTranscription, isTranscribing, handleRecordPress, ...microphone }
}

export type useTranscribeType = ReturnType<typeof useTranscribe>

const sendAudio = async (audioBlob: Blob) => {
  console.log('Transcribing...');
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.wav');
  const response = await fetch(
    `${VITE_API_URL}/transcribe`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        // 'Authorization': 'Bearer dummy_api_key',
      },
      body: formData,
    }
  );

  const result = await response.json();
  return result;
}
