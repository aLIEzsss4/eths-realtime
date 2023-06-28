"use client"
import React, { useState, useEffect } from 'react';
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


function RealtimeUpdates() {
  const [messages, setMessages] = useState([]);


  const relatimeFn=()=>{
    const subscription = supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ethscriptions' },
      async (payload) => {
        console.log('Change received!', payload)
        const newData = JSON.stringify(payload.new)
      setMessages((prevMessages) => [...prevMessages, JSON.parse(newData)]);

        // await writer.write(encoder.encode("data: " + newData + "\n\n"));
      }
    )
    .subscribe()
  }


  useEffect(() => {
    // 使用 EventSource 对象监听实时更新事件
    // const eventSource = new EventSource("http://localhost:8000/");

    // eventSource.onmessage = (event) => {
    //   console.log({event})
    //   setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    // };


    // return () => {
    //   eventSource.close();
    // }
    relatimeFn()
  }, []);

  const exit=()=>{
    fetch('/api/realtime?action=exit')
      .then(res=>console.log(res))
      .catch(console.log)
  }

  return (
    <div>
      <div onClick={exit}>x</div>
      {
        [...messages].reverse().map((message, index) => (
          <div key={index} >
            <div className='mb-4 w-full font-mono border aspect-square p-4 grid place-items-center whitespace-pre-wrap break-all overflow-x-hidden overflow-y-auto'>{message.decode_data} </div>
            <p>Owner:{message.owner} </p>
            <p>Creator:{message.creator} </p>
            <p>Created:{dayjs(message.block_time).fromNow()} </p>
            <p>tx:{message.hash} </p>
            {/* <small > Sent by {message.sender} at {new Date(message.sent_at).toLocaleString()} </small> */}
          </div>
        ))
      }
    </div>
  );
}

export default RealtimeUpdates;


