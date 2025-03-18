import type { Message } from 'ollama';
import { Ollama } from 'ollama';
import { systemPrompt } from './system-prompt';
const ollama = new Ollama();

export const chatWithOllama = async (transcription: string, messages: Message[]) => {
  const messagesForOllama = [
    { role: 'system', content: systemPrompt },
    ...messages,
    { role: 'user', content: transcription }
  ];

  try {
    // Create a readable stream to collect the response chunks
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Enable streaming in the Ollama chat options
          const response = await ollama.chat({
            model: 'gemma3:4b',
            messages: messagesForOllama,
            stream: true, // Enable streaming
          });

          let fullResponse = '';

          // Collect stream chunks
          for await (const chunk of response) {
            const content = chunk.message.content;
            fullResponse += content;
            console.log('Stream chunk:', content); // Log each chunk as it arrives
          }

          console.log('Response:', fullResponse);

          // Enqueue the final result and close the stream
          controller.enqueue({ text: fullResponse });
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue({ text: 'Error occurred', correctedQuestion: null });
          controller.close();
        }
      }
    });

    // Read the stream and return the first (and only) value
    const reader = stream.getReader();
    const { value } = await reader.read();
    return value;

  } catch (error) {
    console.error('Error:', error);
    return { text: 'Error occurred', correctedQuestion: null };
  }
}
