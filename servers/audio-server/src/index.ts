import { HonoServer } from 'hono-server';
import { transcribe } from './transcribe';
import { onSocketMessage } from './websocket';

const { API_PORT: PORT } = process.env;

const app = HonoServer(PORT!, 'API Server', onSocketMessage);
app.use('/', async (ctx) => ctx.json({ bibleBuddyAPIServer: 'v0.1.0' }));

app.post('/transcribe', async (ctx) => {
  const formData = await ctx.req.formData();
  const transcription = await transcribe(formData!);
  return ctx.json(transcription);
});

// app.post('/chat', async (ctx) => {
//   const { message } = await ctx.req.json();
//   // const origin = ctx.req.header('Origin');
//   const response = await chatWithOllama(message, []);
//   return ctx.json(response);
// });




export default app;

