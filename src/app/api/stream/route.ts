// app/api/netusage/route.ts
import EventSource from "eventsource";

// should be declared (!)
export const dynamic = 'force-dynamic';

export async function GET() {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const resp = new EventSource("http://localhost:8000/stream")
  resp.onmessage = async (e) => {
    await writer.write(encoder.encode(`event: message\ndata: ${e.data}\n\n`));
  }

  resp.onerror =async () => {
    resp.close();
    await writer.close();
  }

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
