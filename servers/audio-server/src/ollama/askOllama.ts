import { Ollama } from 'ollama';
const ollama = new Ollama();

export const askOllama = async (transcription: string) => {
  try {
    const response = await ollama.generate({
      model: 'gemma3:4b', // Use the model you pulled
      prompt: transcription, // The text you want to generate from
      stream: false, // Set to true for streaming (see below)
    });

    return { text: response.response }
  } catch (error) {
    console.error('Error:', error);
  }
}