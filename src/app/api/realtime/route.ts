//@ts-nocheck
// import supabase from '../../supabase';
import EventSource from "eventsource";
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// should be declared (!)
export const dynamic = 'force-dynamic';
export const runtime = "edge"



const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
console.log(supabase.supabaseUrl)



export function  GET(req: NextApiRequest, res: NextApiResponse) {
  const table = 'ethscriptions'
  // const { action } = req.query;
  // console.log({q:req,url:req.url})

  // let subscription


  // if (action == 'exit') {
  //   supabase
  //   .removeChannel('custom-all-channel')
  //   .then(() => console.log('Unsubscribed from my_channel.'))
  //   .catch(console.error);
  // }

  
  // let arr=[]
  

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

  


  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}