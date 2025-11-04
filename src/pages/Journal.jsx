import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api' // Import the api helper

// Helper to generate unique IDs
function uid(){
  return 'mm-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)
}

export default function Journal(){
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const [loading, setLoading] = useState(false) // For AI responses
  const [pageLoading, setPageLoading] = useState(true) // For loading the chat history

  const [journalId, setJournalId] = useState(()=>{
    // Get the last-opened journal ID from local storage
    return localStorage.getItem('mm_current_journal_id') || uid()
  })

  const [title, setTitle] = useState('Untitled Journal')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  // Load chat history from backend when component loads or journalId changes
  useEffect(()=>{
    if (userId === 'guest') {
      setPageLoading(false)
      return; // Don't load for guest
    }
    
    setPageLoading(true)
    // Keep local storage updated with the current ID
    localStorage.setItem('mm_current_journal_id', journalId)
    
    api.get(`/journal/session/${journalId}`).then(data => {
      if (data.error || !data.messages) {
        // Journal doesn't exist on backend yet, create a new one
        const seed = [{
          id: uid(),
          from:'system',
          text:"Hi, I'm your MoodMate counselor 🙂. What's on your mind today?",
          at: new Date().toISOString()
        }]
        setMessages(seed)
        setTitle('Untitled Journal')
        save(seed, 'Untitled Journal') // Save the new seed to backend
      } else {
        // Journal loaded successfully
        setTitle(data.title)
        setMessages(data.messages)
      }
      setPageLoading(false)
    })
    // eslint-disable-next-line
  }, [journalId, userId]) // Re-run if journalId or user changes

  // Save chat history to backend
  async function save(msgs, t){
    if (userId === 'guest') return; // Don't save for guest
    
    // We can "fire and forget" this, no need to await
    api.post('/journal', {
      journal_id: journalId,
      user_id: userId,
      title: t,
      messages: JSON.stringify(msgs) // Send messages as JSON string
    })
  }

  // Send a message
  async function send(){
    const text = input.trim()
    if(!text || loading || pageLoading) return
    
    setLoading(true) // Start loading for AI response
    const now = new Date().toISOString()
    const me = { id: uid(), from:'me', text, at: now }
    
    // Show user's message immediately
    const nextWithMe = [...messages, me]
    setMessages(nextWithMe)
    setInput('')

    // 1. Get AI response from backend
    const aiData = await api.post('/ai-chat', { message: text })
    
    const ai = {
      id: uid(),
      from:'ai',
      text: aiData.response || "I'm not sure what to say. Can you tell me more?",
      at: new Date().toISOString()
    }

    const nextWithAi = [...nextWithMe, ai]
    setMessages(nextWithAi)
    
    // 2. Save the full new history to backend
    await save(nextWithAi, title)
    setLoading(false) // Stop loading
  }

  // Start a new journal
  function newJournal(){
    const id = uid()
    setJournalId(id) // This will trigger the useEffect to load/create the new journal
  }

  // Rename the current journal
  async function rename(){
    const t = prompt('Rename journal to:', title) || title
    setTitle(t)
    await save(messages, t) // Save the new title to the backend
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
              Journal ID: <code>{journalId.slice(0, 10)}...</code>
            </span>
            <button className="btn-outline" onClick={rename}>Rename</button>
            <button className="btn" onClick={newJournal}>New Journal</button>
          </div>
        </div>

        <div className="text-sm text-slate-600 mt-1">
          Title: {title}
        </div>

        <div className="h-80 overflow-y-auto rounded-xl border border-slate-200 p-3 bg-white mt-3">
          {pageLoading ? (
            <p>Loading journal...</p>
          ) : (
            messages.map(m=>(
              <div key={m.id} className={`my-2 flex ${m.from==='me'?'justify-end':'justify-start'}`}>
                <div className={`bubble ${m.from==='me'?'bubble-me':'bubble-ai'}`}>
                  {m.from==='system' && <strong>System: </strong>}{m.text}
                  <div className="text-[10px] opacity-70 mt-1">
                    {new Date(m.at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* This is the corrected section. 
          The <input> and <button> are inside their parent <div> 
        */}
        <div className="mt-3 flex gap-2">
          <input
            className="input"
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder={loading ? "Thinking..." : "Type what’s on your mind…"}
            onKeyDown={e=>e.key==='Enter' && send()}
            disabled={loading || pageLoading}
          />
          <button className="btn" onClick={send} disabled={loading || pageLoading}>
            {loading ? "..." : "Send"}
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-2">
          Your journal is now saved to your account.
        </p>
      </div>
    </div>
  )
}