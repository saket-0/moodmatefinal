import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function SavedJournals(){
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const INDEX_KEY = `mm_chats_index_${userId}`
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    const raw = localStorage.getItem(INDEX_KEY)
    setItems(raw ? JSON.parse(raw) : [])
  }, [INDEX_KEY])

  const open = (id)=>{
    localStorage.setItem('mm_current_journal_id', id)
    navigate('/journal')
  }

  const remove = (id)=>{
    if(!confirm('Delete this journal?')) return
    const rest = items.filter(i => i.journalId !== id)
    setItems(rest)
    localStorage.setItem(INDEX_KEY, JSON.stringify(rest))
    localStorage.removeItem(`mm_chat_${userId}_${id}`)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold mb-3">Saved Journals ✍️</h1>
        {items.length===0 ? (
          <p className="text-slate-600">
            No saved journals yet. Start one from the Journal page.
          </p>
        ) : (
          <ul className="divide-y">
            {items.map(it=>(
              <li key={it.journalId} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-slate-600">
                    {new Date(it.updatedAt).toLocaleString()} • {it.count} messages
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-outline" onClick={()=>open(it.journalId)}>Open</button>
                  <button className="btn" onClick={()=>remove(it.journalId)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
