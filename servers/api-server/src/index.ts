import { HonoServer } from 'hono-server';
import fetch from 'node-fetch';
// import { apiRouter } from './routes';
const { API_PORT: PORT, VITE_FAST_WHISPER_URL } = process.env;

const app = HonoServer(PORT!, 'API Server');
app.use('/', async (ctx) => ctx.json({ bibleBuddyAPIServer: 'v0.1.0' }));
// app.route('/', apiRouter);

app.post('/transcriptions', async (ctx) => {
  const targetUrl = `${VITE_FAST_WHISPER_URL}/transcriptions`;
  const origin = ctx.req.header('Origin');

  try {
    // Get the request body (FormData)
    const formData = await ctx.req.formData();
    formData.append('model', 'base');
    formData.append('language', 'en');
    formData.append('initial_prompt', 'string');
    formData.append('vad_filter', 'false');
    formData.append('min_silence_duration_ms', '1000');
    formData.append('response_format', 'text');
    formData.append('timestamp_granularities', 'segment');

    // Prepare the fetch options to mirror the original request
    const fetchOptions = {
      method: ctx.req.method,
      headers: {
        'host': new URL(targetUrl).host,
        'authorization': ctx.req.header('authorization') || 'Bearer dummy_api_key', // Ensure auth is preserved
      },
      body: formData, // Forward the FormData directly
      mode: 'cors',
      credentials: 'include',
    };

    // Forward the request to FastAPI
    const response = await fetch(targetUrl, fetchOptions);

    // Get the response headers and body
    const responseHeaders: { [key: string]: string } = {};
    for (const [k, v] of response.headers.entries()) {
      responseHeaders[k] = v; // Simplifies to single value or last value
    }
    const responseBody = await response.text(); // Adjust based on response_format (text)

    if (!response.ok) {
      console.error('FastAPI Error:', response.status, responseBody);
      throw new Error(`FastAPI request failed with status ${response.status}`);
    }

    // Return the exact response to the browser
    return ctx.text(responseBody);

  } catch (error) {
    console.error('Proxy error:', error);
    return ctx.text('Internal Server Error', 500);
  }
});

export default app;

