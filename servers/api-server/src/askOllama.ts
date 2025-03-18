import ollama from 'ollama';
import type { Message } from 'ollama';

const names: any = {
  am: 'Joel',
  af: 'Sarah',
  bm: 'Nathan',
  bf: 'Hannah',
};

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
Please start with a disrtinct paragraph that includes the corrected question, always, even if 
the corrected question is the same as the original question.
CRITICAL FORMATTING REQUIREMENT: You MUST format every response EXACTLY as follows, with no deviations, or my application will break. Adhere to this precise structure, including quotation marks, separators, and spacing as shown, without adding extra text, skipping sections, or altering the layout in any way:

"<your response text here, written naturally but concisely>"
"------ Bible References: ------"
<book>:<chapter>:<verse> - <quote>
----- 
<book>:<chapter>:<verse> - <quote>
----- 
<book>:<chapter>:<verse> - <quote>

- Use EXACTLY 25 dashes ("-------------------------") to separate the corrected prompt and response.
- Use EXACTLY "------ Bible References: ------" (6 dashes, "Bible References: ", 6 dashes) to introduce the references section.
- Use EXACTLY 5 dashes ("----- ") with a trailing space as separators between reference entries.
- Do NOT use different separators, add extra lines, or deviate from this structure. Strict consistency is non-negotiable.
"
`;

const defaultMessages = [
  { role: 'system', content: systemPrompt },
];





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