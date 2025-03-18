import { HonoServer } from 'hono-server';
import { transcribe } from './transcribe';
import { chatWithOllama } from './ollama/chat-with-ollama';

const { API_PORT: PORT } = process.env;

const app = HonoServer(PORT!, 'API Server');
app.use('/', async (ctx) => ctx.json({ bibleBuddyAPIServer: 'v0.1.0' }));
// app.route('/', apiRouter);

app.post('/transcriptions', async (ctx) => {
  const origin = ctx.req.header('Origin');
  const transcription = await transcribe(ctx)
  const response = await chatWithOllama(transcription.text, []);
  return ctx.json(response);
});

export default app;

