import type { Context } from 'hono'
import fetch from 'node-fetch';
type TranscriptionResult = { text: string };
const { FAST_WHISPER_URL } = process.env;

const targetUrl = `${FAST_WHISPER_URL}/v1/transcriptions`;
console.log('FAST_WHISPER_URL', targetUrl);

export const transcribe = async (formData: FormData): Promise<TranscriptionResult> => {
  const transcribeFormData = new FormData();
  transcribeFormData.append('file', formData.get('file') as Blob, 'recording.wav');
  transcribeFormData.append('model', 'base');
  transcribeFormData.append('language', 'en');
  transcribeFormData.append('initial_prompt', 'string');
  transcribeFormData.append('vad_filter', 'false');
  transcribeFormData.append('min_silence_duration_ms', '1000');
  transcribeFormData.append('response_format', 'text');
  transcribeFormData.append('timestamp_granularities', 'segment');

  // Prepare the fetch options to mirror the original request
  const fetchOptions = {
    method: 'POST',
    headers: {
      'host': new URL(targetUrl).host,
      'authorization': 'Bearer dummy_api_key', // Ensure auth is preserved
    },
    body: transcribeFormData, // Forward the FormData directly
    mode: 'cors',
    credentials: 'include',
  };

  // Forward the request to FastAPI
  const response = await fetch(targetUrl, fetchOptions);
  const transcription = await response.json();
  return transcription as TranscriptionResult;
}