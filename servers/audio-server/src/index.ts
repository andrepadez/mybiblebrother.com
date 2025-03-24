import { HonoServer } from 'hono-server';
import { stat } from "fs/promises";
import { join } from "path";
import * as musicMetadata from 'music-metadata';

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


const audioDir = `/Volumes/ExtremeSSD/biblepal/audio_bible/bm_george/`;
app.get('/stream/*', async (ctx) => {
  const metadata = musicMetadata as any;
  const urlPath = ctx.req.path.replace(/^\/stream\//, "");
  const filePath = join(audioDir, urlPath);

  // Basic security: prevent directory traversal
  if (!filePath.startsWith(audioDir)) {
    return ctx.text("Invalid filename", 400);
  }

  try {
    // Verify file exists and get stats
    console.log('Streaming file:', filePath);
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) {
      return ctx.text("File not found", 404);
    }
    const fileSize = fileStats.size;

    // Extract MP3 metadata using music-metadata
    let duration: number | undefined;
    let bitrate: number | undefined;
    try {
      const meta = await metadata.parseFile(filePath);
      duration = meta.format.duration; // Duration in seconds
      bitrate = meta.format.bitrate; // Bitrate in bps
    } catch (err) {
      console.error('Failed to parse MP3 metadata:', err);
    }

    // Estimate duration if not found in metadata
    if (!duration && bitrate) {
      duration = (fileSize * 8) / bitrate; // Duration = (file size in bits) / bitrate
    }

    const range = ctx.req.header("range");
    if (!range) {
      // Full file streaming
      const fileStream = Bun.file(filePath).stream();
      if (!fileStream) {
        return ctx.text("Failed to stream file", 500);
      }

      const headers: Record<string, string> = {
        "Content-Type": "audio/mpeg",
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes",
      };

      if (duration) {
        headers["X-Audio-Duration"] = duration.toString();
      }

      return ctx.body(fileStream, 200, headers);
    }

    // Handle range request
    const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

    if (isNaN(start) || start < 0 || end >= fileSize || start > end) {
      return ctx.text("Invalid range", 416); // Range Not Satisfiable
    }

    const chunkSize = end - start + 1;
    const fileStream = Bun.file(filePath).slice(start, end + 1).stream();
    if (!fileStream) {
      return ctx.text("Failed to stream file chunk", 500);
    }

    const headers: Record<string, string> = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Content-Length": chunkSize.toString(),
      "Content-Type": "audio/mpeg",
      "Accept-Ranges": "bytes",
    };

    if (duration) {
      headers["X-Audio-Duration"] = duration.toString();
    }

    return ctx.body(fileStream, 206, headers);
  } catch (err) {
    console.error('Error in stream handler:', err);
    return ctx.text("File not found or inaccessible", 404);
  }
});



