import { useState } from 'react'

export default function ChatWindow(){
  const [messages,setMessages]=useState([
    {id:1,from:'system',text:'You are anonymous. Be kind. No personal info.'},
    {id:2,from:'peer',text:'hey! how are you feeling today?',time:'12:01'}
  ])
  const [input,setInput]=useState('')

  const send=()=>{
    if(!input.trim())return
    setMessages(prev=>[
      ...prev,
      {id:Date.now(),from:'me',text:input,time:new Date().toLocaleTimeString().slice(0,5)}
    ])
    setInput('')
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Chat</h1>
          <div className="flex gap-2">
            <button className="btn-outline" onClick={()=>alert('Report sent (placeholder)')}>Report</button>
            <button className="btn-outline" onClick={()=>alert('User blocked (placeholder)')}>Block</button>
          </div>
        </div>

        <div className="h-80 overflow-y-auto rounded-xl border border-slate-200 p-3 bg-white">
          {messages.map(m=>(
            <div key={m.id} className={`my-2 flex ${m.from==='me'?'justify-end':'justify-start'}`}>
              <div className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm ${
                m.from==='me'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-800'
              }`}>
                {m.from==='system' && <strong>System: </strong>}{m.text}
                {m.time && (
                  <div className="text-[10px] opacity-70 mt-1">{m.time}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            className="input"
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder="Type a message…"
            onKeyDown={e=>e.key==='Enter'&&send()}
          />
          <button className="btn" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  )
}
