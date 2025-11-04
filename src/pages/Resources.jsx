import { useMemo, useState } from 'react'
import { resourceList } from '../utils/dummyData'

export default function Resources(){
  const [q,setQ]=useState('')
  const [tag,setTag]=useState('')

  const items=useMemo(()=>resourceList.filter(r=>(
    (!q||r.title.toLowerCase().includes(q.toLowerCase())||r.description.toLowerCase().includes(q.toLowerCase())) &&
    (!tag||r.tags.includes(tag))
  )),[q,tag])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Resource Hub 📚</h1>

        <div className="grid md:grid-cols-3 gap-3 mt-3">
          <input
            className="input md:col-span-2"
            placeholder="Search resources..."
            value={q}
            onChange={e=>setQ(e.target.value)}
          />
          <select className="input" value={tag} onChange={e=>setTag(e.target.value)}>
            <option value="">All tags</option>
            <option value="basics">Basics</option>
            <option value="mood">Mood</option>
            <option value="anxiety">Anxiety</option>
            <option value="breathing">Breathing</option>
            <option value="sleep">Sleep</option>
            <option value="habit">Habit</option>
            <option value="journal">Journal</option>
            <option value="creativity">Creativity</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {items.map((r,i)=>(
            <a key={i} href={r.link} className="card hover:shadow-lg transition block">
              <div className="font-semibold">{r.title}</div>
              <p className="text-sm text-slate-600 mt-1">{r.description}</p>
            </a>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-sky-100 to-violet-100">
          <strong>Personalised suggestions (placeholder):</strong> connect to backend to show items based on your recent moods.
        </div>
      </div>
    </div>
  )
}
