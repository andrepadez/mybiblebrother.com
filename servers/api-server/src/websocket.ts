import type { SendMessageParams } from './ollama/chat-with-ollama';
import { chatWithOllama } from './ollama/chat-with-ollama';

export const onSocketMessage = async (ws: any, payload: any) => {
  const socket = ws as WebSocket;
  if (payload.type === 'user-message') {
    // console.log(payload);
    const { message, messages } = payload;
    const sendMessage = setupSendMessage(socket);
    const reportLineCount = setupReportLineCount(socket);
    await chatWithOllama({ message, messages, sendMessage, reportLineCount });
  }
}

export const setupReportLineCount = (ws: WebSocket) => (count: number) => {
  console.log('sending line-count', count);
  const payload = {
    type: 'line-count',
    count,
  }
  ws.send(JSON.stringify(payload));
}


export const setupSendMessage = (ws: WebSocket) =>
  ({ text, finished, fileName }: SendMessageParams) => {
    const payload = {
      type: 'agent-message',
      finished: finished,
      message: {
        content: text,
        role: 'agent',
        fileNames: [fileName],
      }
    }
    ws.send(JSON.stringify(payload));
  };



const loremipsum = `
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
`

