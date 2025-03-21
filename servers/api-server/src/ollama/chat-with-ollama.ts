import type { Message } from 'ollama';
import { Ollama } from 'ollama';
import { systemPrompt } from './system-prompt';
import { synth } from './synthesize';
import { Queue } from './Queue';

const ollama = new Ollama();

const audioQueue = new Queue();

export type SendMessageParams = { text: string, fileName?: string, finished?: boolean };

type ChatWithOllamaParams = {
  message: Message,
  messages: Message[],
  sendMessage: ({ text, finished, fileName }: SendMessageParams) => void
}

export const chatWithOllama = async (params: ChatWithOllamaParams) => {
  const { message, messages, sendMessage } = params;
  const messagesForOllama = [
    { role: 'system', content: systemPrompt },
    ...messages,
    message
  ];

  try {
    // Create a readable stream to collect the response chunks
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await ollama.chat({
            model: 'gemma3:4b',
            messages: messagesForOllama,
            stream: true,
          });

          let fullResponse = '';
          let section = 'answer';
          let buffer = '';
          let answerSentence = '';

          const onAnswerSentence = async (text: string, section: string) => {
            if (text.trim().length < 0) return;
            const finished = text.includes('-----');

            if (!finished) {
              audioQueue.add(
                () => synth(text, 'af_heart'),
                async (fileName) => {
                  console.log('synth finished', fileName, text);
                  sendMessage({ text, fileName });
                }
              );
            } else {
              audioQueue.add(
                () => Promise.resolve(),
                async () => sendMessage({ text: '', finished })
              );
            }
          };

          for await (const chunk of response) {
            const content = chunk.message.content;
            fullResponse += content;
            buffer += content;

            if (section === 'answer') {
              answerSentence += content;
              // Split on sentence-ending punctuation OR newlines
              if (/([.!?]\s|\n)/.test(answerSentence) || buffer.includes('------ Bible References: ------')) {
                const sentences = answerSentence.split(/([.!?]\s|\n)/); // Split on either
                let currentSentence = '';
                for (let i = 0; i < sentences.length; i++) {
                  if (sentences[i].match(/([.!?]\s|\n)/)) {
                    if (currentSentence.trim()) {
                      onAnswerSentence(currentSentence.trim(), section); // Trigger callback
                    }
                    currentSentence = '';
                  } else {
                    currentSentence += sentences[i];
                  }
                }
                answerSentence = currentSentence; // Keep remainder
              }
              if (buffer.includes('------ Bible References: ------')) {
                if (answerSentence.trim()) onAnswerSentence(answerSentence.trim(), section);
                section = 'references';
                buffer = '';
              }
            }
          }

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

    let correctedPrompt: string = '';
    let correctedPromptFinished: boolean = false;
    let answer: string = '';
    let answerFinished: boolean = false;
    let references: string[] = [];

    const lines = value.text.split('\n')
    for (let line of lines) {
      const is1stSeparator = line.includes('------');
      const is2ndSeparator = line.includes('- Bible References: -');
      if (!correctedPromptFinished && !is1stSeparator) correctedPrompt += line + '\n';
      if (correctedPromptFinished && !answerFinished && !is2ndSeparator) {
        answer += line + '\n';
      }
      if (is1stSeparator) correctedPromptFinished = true;
      if (correctedPromptFinished && is2ndSeparator) answerFinished = true;
      if (answerFinished && !is2ndSeparator) references.push(line);
    }

    // console.log('\n\nValue:');
    // lines.forEach((line: string) => console.log(line));
    // console.log({ correctedPrompt, answer, references });

    return { correctedPrompt, text: answer, references };

  } catch (error) {
    console.error('Error:', error);
    return { text: 'Error occurred', correctedQuestion: null };
  }
}
