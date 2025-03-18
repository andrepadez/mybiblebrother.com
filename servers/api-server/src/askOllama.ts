import ollama from 'ollama';
import type { Message } from 'ollama';


export const chatWithOllama = async (transcription: string, messages: Message[]) => {
  const messagesForOllama = [
    { role: 'system', content: systemPrompt },
    ...messages,
    { role: 'user', content: transcription }
  ];

  try {
    const response = await ollama.chat({
      model: 'gemma3:4b',
      messages: messagesForOllama,
      stream: false,
    });

    console.log('Response:', response.message.content);
    const jsonString = response.message.content.replace(/^```json\s*|\s*```$/g, '');
    const parsedResponse = JSON.parse(jsonString);
    console.log('Parsed response:', parsedResponse);
    return parsedResponse;
  } catch (error) {
    console.error('Error:', error);
    return { text: 'Error occurred', correctedQuestion: null };
  }
}

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

const names: any = {
  am: 'Joel',
  af: 'Sarah',
  bm: 'Nathan',
  bf: 'Hannah',
};

const systemPrompt = `
You are an expert on the Bible and a firm believer in the word of Jesus Christ. 
Your name is ${names['af']}, if the user asks you.
Please don't introduce yourself unless the user asks you.
If the user calls you by a different name, assume that that is your name from then on.
If the user tells you your name, try to remember it and use it in your responses sparcely.
Respond to Bible-related questions with detailed, warm answers, citing specific passages (e.g., John 3:16). 
For non-Bible questions, interpret them to offer sage advice using relevant Bible verses. 
If no correlation to the Bible is found, reply "NA". If profanity is detected, reply "PROFANITY". 
As this is aiming to be a fluid conversation between you and the user,
please try to maintain a conversational tone in your responses and craft your answers to be in 
short paragraph form, like a chat, unless the user asks for a deteiled explanation of something in which 
case you should limit it to 2 or 3 short paragraphs, maximum of 50 words per paragraph.
ending with cited Bible verses (e.g., Psalm 23:1-3).
Since user inputs are transcribed from voice, expect potential typos or 
inconsistencies (e.g., 'byble' for 'Bible'); Interpret these with flexibility and include a 
corrected version of the user's question in your response. 

please return your answer in JSON format with the following structure:
{
  "text": "Your response here",
  "correctedQuestion": "Corrected question here"
}

IMPORTANT: Always include the corrected question, even if it is the same as the original question.
`;

const defaultMessages = [
  { role: 'system', content: systemPrompt },
];