import { HonoServer } from 'hono-server';
import { streamSSE } from 'hono/streaming';
import { transcribe } from './transcribe';
import { chatWithOllama } from './ollama/chat-with-ollama';

const { API_PORT: PORT } = process.env;

const app = HonoServer(PORT!, 'API Server');
app.use('/', async (ctx) => ctx.json({ bibleBuddyAPIServer: 'v0.1.0' }));
// app.route('/', apiRouter);

const formDataMap = new Map<string, FormData>();

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
  // const transcription = await transcribe(formData!);
  // const response = await chatWithOllama(transcription.text, [], ctx);
  return streamSSE(ctx, async (stream) => {
    let count = 0;
    while (count < 10) {
      await stream.writeSSE({
        data: JSON.stringify({ count: ++count, messageId }),
        event: 'progress',
        id: String(count),
      })
      await stream.sleep(1000)
    }
  })
});

export default app;

