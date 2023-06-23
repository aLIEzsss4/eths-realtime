"use client"
import React, { useState, useEffect } from 'react';
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


function RealtimeUpdates() {
  const [messages, setMessages] = useState([]);


  useEffect(() => {
    // 使用 EventSource 对象监听实时更新事件
    const eventSource = new EventSource('/api/realtime');

    eventSource.onmessage = (event) => {
      // console.log({event})
      setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    };


    return () => {
      eventSource.close();
    }
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


