import { HonoServer } from 'hono-server';
import { streamSSE } from 'hono/streaming';
import { writeSSE } from './ollama/write-sse'
import { transcribe } from './transcribe';
import { chatWithOllama } from './ollama/chat-with-ollama';

const { API_PORT: PORT } = process.env;

const app = HonoServer(PORT!, 'API Server');
app.use('/', async (ctx) => ctx.json({ bibleBuddyAPIServer: 'v0.1.0' }));
// app.route('/', apiRouter);

const formDataMap = new Map<string, FormData>();

app.post('/transcribe', async (ctx) => {
  console.log('/transcribe');
  const formData = await ctx.req.formData();
  const transcription = await transcribe(formData!);
  return ctx.json(transcription);
});

app.post('/chat', async (ctx) => {
  const origin = ctx.req.header('Origin');
  const messageId = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const formData = await ctx.req.formData();
  formDataMap.set(messageId, formData);
  return ctx.json({ messageId });
});

app.get('/chat-sse/:messageId', async (ctx) => {
  const { messageId } = ctx.req.param();
  const formData = formDataMap.get(messageId);
  if (!formData) return ctx.json({ error: 'Message not found' }, 404);
  return streamSSE(ctx, async (stream) => {
    const transcription = await transcribe(formData!);
    const { text } = transcription;
    const event = 'transcription';
    for (let i = 0; i < 10; i++) {
      await stream.writeSSE({
        data: text,
        event: 'time-update',
        id: String(i),
      })
    }
    // const response = await chatWithOllama(transcription.text, [], stream, messageId);
    stream.close();
  })
});



export default app;

