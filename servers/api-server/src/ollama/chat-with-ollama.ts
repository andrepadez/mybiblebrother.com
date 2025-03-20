import type { Context } from 'hono-server';
import type { SSEStreamingApi } from 'hono/streaming'
import type { Message } from 'ollama';
import { writeSSE } from './write-sse'
import { Ollama } from 'ollama';
import { systemPrompt } from './system-prompt';
import { synth } from './synthesize';
import { Queue } from './Queue';

const ollama = new Ollama();

const audioQueue = new Queue();

export const chatWithOllama = async (transcription: string, messages: Message[], sseStream: SSEStreamingApi) => {
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
          const response = await ollama.chat({
            model: 'gemma3:4b',
            messages: messagesForOllama,
            stream: true,
          });

          let fullResponse = '';
          let section = 'answer';
          let buffer = '';
          let answerSentence = '';

          const onCorrectedPrompt = (correctedQuestion: string) => {
            // console.log('Corrected question:', correctedQuestion);
          };

          const onAnswerSentence = async (answerSentence: string, section: string) => {
            if (section !== 'answer' || answerSentence.includes('-----')) return;
            const event = 'answer-sentence';
            const data = { text: answerSentence };
            writeSSE({ stream: sseStream, event, id: 'lalala', data });
            // audioQueue.add(() => synth(answerSentence, 'af_heart'), (fileName: string) => {
            // audioQueue.add(() => synth(answerSentence, 'af_heart'), (fileName: string) => {
            //   console.log(fileName, answerSentence);
            //   const data = { fileName, text: answerSentence };
            //   writeSSE({ stream: sseStream, event, id: 'lalala', data });
            // });
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

    const event = 'bible-references';
    const data = { references };
    await writeSSE({ stream: sseStream, event, id: 'lalala', data });

    return { correctedPrompt, text: answer, references };

  } catch (error) {
    console.error('Error:', error);
    return { text: 'Error occurred', correctedQuestion: null };
  }
}
