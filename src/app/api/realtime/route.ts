import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import  EventSource  from "eventsource";

// should be declared (!)
export const dynamic = 'force-dynamic';
export const runtime = "nodejs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// console.log(supabase)

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  let closed = false;

  const subscription = supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ethscriptions' },
      async (payload) => {
        // console.log('Change received!', payload)
        const newData = JSON.stringify(payload.new)
        await writer.write(encoder.encode("data: " + newData + "\n\n"));
      }
    )
    .subscribe()

    // const events =  new EventSource('http://localhost:8000/realtime')

    // console.log(events,'events')
      
    // events.onmessage(async msg=>{
    //   await writer.write(encoder.encode("data: " + msg + "\n\n"))
    // })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}