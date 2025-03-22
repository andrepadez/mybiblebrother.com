import type { SSEStreamingApi } from 'hono/streaming'

type WriteSSEParams = { stream: SSEStreamingApi, event: string, data: any, id: string }
export const writeSSE = async ({ stream, event, data, id }: WriteSSEParams) => {
  const res = `event: ${event}\ndata: ${JSON.stringify(data)}\nid: ${id}\n\n`
  return stream.write(res);
}