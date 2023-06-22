import supabase from '../../supabase';
import EventSource from "eventsource";
import { NextApiRequest, NextApiResponse } from 'next';
// should be declared (!)
export const dynamic = 'force-dynamic';
export const runtime = "edge"


export function GET(req: NextApiRequest, res: NextApiResponse) {
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

  // 订阅实时更新事件
  // const subscription = supabase.from(table).on('*', (payload) => {
  //   res.setHeader('Content-Type', 'text/event-stream;charset=UTF-8');
  //   res.setHeader('Cache-Control', 'no-cache, no-transform');
  //   res.setHeader('Connection', 'keep-alive');

  //   console.log(1111)
  //   // 将新数据发送给客户端
  //   res.write(`data: ${JSON.stringify(payload)}\n\n`);
  // }).subscribe();
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
        //     res.setHeader('Content-Type', 'text/event-stream;charset=UTF-8');
        // res.setHeader('Cache-Control', 'no-cache, no-transform');
        // res.setHeader('Connection', 'keep-alive');

        // res.writeHead(200, {
        //   Connection: 'keep-alive',
        //   'Content-Encoding': 'none',
        //   'Cache-Control': 'no-cache, no-transform',
        //   'Content-Type': 'text/event-stream',
        // });
        // res.write(`data: ${JSON.stringify(payload)}\n\n`);
        //  arr=[...arr,payload]
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