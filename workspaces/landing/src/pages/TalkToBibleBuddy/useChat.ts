import { useState, useEffect } from 'react';
const { VITE_API_URL } = import.meta.env;

export const useChat = (audioBlob: Blob) => {
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [blob, setBlob] = useState<Blob | null>(() => audioBlob);
  const [transcription, setTranscription] = useState<string | null>(null);

  console.log('blob', blob);

  const transcribe = async () => {
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
    console.log('result.text', result.text);
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

  return { transcription, setTranscription, isTranscribing }
}

