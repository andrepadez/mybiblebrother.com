import type { Context } from 'hono'
import fetch from 'node-fetch';
type TranscriptionResult = { text: string };
const { VITE_FAST_WHISPER_URL } = process.env;

const targetUrl = `${VITE_FAST_WHISPER_URL}/transcriptions`;

export const transcribe = async (ctx: Context): Promise<TranscriptionResult> => {
  const formData = await ctx.req.formData();
  formData.append('model', 'base');
  formData.append('language', 'en');
  formData.append('initial_prompt', 'string');
  formData.append('vad_filter', 'false');
  formData.append('min_silence_duration_ms', '1000');
  formData.append('response_format', 'text');
  formData.append('timestamp_granularities', 'segment');

  // Prepare the fetch options to mirror the original request
  const fetchOptions = {
    method: ctx.req.method,
    headers: {
      'host': new URL(targetUrl).host,
      'authorization': ctx.req.header('authorization') || 'Bearer dummy_api_key', // Ensure auth is preserved
    },
    body: formData, // Forward the FormData directly
    mode: 'cors',
    credentials: 'include',
  };

  // Forward the request to FastAPI
  const response = await fetch(targetUrl, fetchOptions);
  const transcription = await response.json();
  return transcription as TranscriptionResult;
}