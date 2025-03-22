import { HonoServer } from 'hono-server';
// import { onSocketMessage } from './websocket';

const { AUDIO_PORT: PORT } = process.env;
const { MLX_AUDIO_URL } = process.env;

const app = HonoServer(PORT!, 'Audio Server');
app.use('/', async (ctx) => ctx.json({ bibleBuddyAudioServer: 'v0.1.0' }));

app.get('/audio/:filename', async (ctx) => {
  const { filename } = ctx.req.param();
  const remoteFileUrl = `${MLX_AUDIO_URL}/audio/${filename}`;
  console.log('Fetching audio file:', remoteFileUrl);

  try {
    const response = await fetch(remoteFileUrl);

    if (!response.ok) {
      return ctx.json({ error: 'Audio file not found' }, 404);
    }

    // Forward the headers from the remote server
    ctx.header('Content-Type', response.headers.get('Content-Type') || 'audio/wav');

    // Directly return the response body
    return ctx.body(response.body as ReadableStream<Uint8Array>);
  } catch (error) {
    console.error('Error fetching audio file:', error);
    return ctx.json({ error: 'Internal server error' }, 500);
  }
});

