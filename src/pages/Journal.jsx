import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'

function uid(){
  return 'mm-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)
}

function empathyBot(text){
  const t = text.toLowerCase()
  if(/\b(sad|lonely|upset|down|depressed)\b/.test(t))
    return "I'm sorry you're feeling this way. Do you want to share what triggered it today? I'm listening."
  if(/\b(happy|great|excited|proud|joy)\b/.test(t))
    return "That's wonderful! What happened that made you feel this way? Capture a few details so you can revisit this moment."
  if(/\b(angry|mad|frustrated|annoyed)\b/.test(t))
    return "Anger is a signal. What boundary felt crossed? A short walk and slow breathing can help before responding."
  if(/\b(tired|exhausted|sleepy|burnt)\b/.test(t))
    return "Sounds like you need rest. One tiny action: 2 minutes of deep breathing or a glass of water."
  return "Tell me more. What happened, how did it make you feel, and what do you need right now?"
}

export default function Journal(){
  const { user } = useAuth()
  const userId = user?.id || 'guest'

  const [journalId, setJournalId] = useState(()=>{
    return localStorage.getItem('mm_current_journal_id') || uid()
  })

  const CHAT_KEY = useMemo(
    ()=>`mm_chat_${userId}_${journalId}`,
    [userId,journalId]
  )
  const INDEX_KEY = `mm_chats_index_${userId}`

  const [title, setTitle] = useState('Untitled Journal')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  // load from storage
  useEffect(()=>{
    const raw = localStorage.getItem(CHAT_KEY)
    if(raw){
      const obj = JSON.parse(raw)
      setTitle(obj.title || 'Untitled Journal')
      setMessages(obj.messages || [])
    } else {
      const seed = [{
        id: uid(),
        from:'system',
        text:"Hi, I'm your MoodMate counselor 🙂. What's on your mind today?",
        at: new Date().toISOString()
      }]
      setMessages(seed)
      save(seed, title)
    }
    localStorage.setItem('mm_current_journal_id', journalId)
    // eslint-disable-next-line
  }, [CHAT_KEY])

  function save(msgs, t){
    localStorage.setItem(
      CHAT_KEY,
      JSON.stringify({ journalId, userId, title: t, messages: msgs })
    )
    // update user index of journals
    const idxRaw = localStorage.getItem(INDEX_KEY)
    const idx = idxRaw ? JSON.parse(idxRaw) : []
    const existing = idx.find(i=>i.journalId===journalId)
    const item = {
      journalId,
      title: t,
      updatedAt: new Date().toISOString(),
      count: msgs.length
    }
    if(existing){
      Object.assign(existing, item)
    } else {
      idx.unshift(item)
    }
    localStorage.setItem(INDEX_KEY, JSON.stringify(idx.slice(0,200)))
  }

  function send(){
    const text = input.trim()
    if(!text) return
    const now = new Date().toISOString()

    const me = { id: uid(), from:'me', text, at: now }
    const ai = {
      id: uid(),
      from:'ai',
      text: empathyBot(text),
      at: new Date().toISOString()
    }

    const next = [...messages, me, ai]
    setMessages(next)
    setInput('')
    save(next, title)

    // TODO: POST /ai-chat { user_id: userId, message: text } and merge real response
  }

  function newJournal(){
    const id = uid()
    setJournalId(id)
    localStorage.setItem('mm_current_journal_id', id)
    const seed = [{
      id: uid(),
      from:'system',
      text:"New journal started. What's on your mind?",      at: new Date().toISOString()
    }]
    setMessages(seed)
    setTitle('Untitled Journal')
    save(seed, 'Untitled Journal')
  }

  function rename(){
    const t = prompt('Rename journal to:', title) || title
    setTitle(t)
    save(messages, t)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="card">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <h1 className="text-2xl font-bold">AI Journaling Assistant 🤝</h1>
          <div className="flex flex-wrap gap-2">
            <span className="badge">
              User ID: <code>{userId}</code>
            </span>
            <span className="badge">
              Journal ID: <code>{journalId}</code>
            </span>
            <button className="btn-outline" onClick={rename}>Rename</button>
            <button className="btn" onClick={newJournal}>New Journal</button>
          </div>
        </div>

        <div className="text-sm text-slate-600 mt-1">
          Title: {title}
        </div>

        <div className="h-80 overflow-y-auto rounded-xl border border-slate-200 p-3 bg-white mt-3">
          {messages.map(m=>(
            <div key={m.id} className={`my-2 flex ${m.from==='me'?'justify-end':'justify-start'}`}>
              <div className={`bubble ${m.from==='me'?'bubble-me':'bubble-ai'}`}>
                {m.from==='system' && <strong>System: </strong>}{m.text}
                <div className="text-[10px] opacity-70 mt-1">
                  {new Date(m.at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            className="input"
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder="Type what’s on your mind…"
            onKeyDown={e=>e.key==='Enter' && send()}
          />
          <button className="btn" onClick={send}>Send</button>
        </div>

        <p className="text-xs text-slate-500 mt-2">
          Frontend-only. Connect to backend: <code>POST /ai-chat</code>, <code>GET /ai-chat/&lt;user_id&gt;</code>
        </p>
      </div>
    </div>
  )
}
