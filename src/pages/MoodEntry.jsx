import { useState } from 'react'

const moods=[
  {label:'😄 Happy',value:4,key:'happy'},
  {label:'🙂 Okay',value:3,key:'okay'},
  {label:'😐 Neutral',value:2,key:'neutral'},
  {label:'☁ Low',value:1,key:'low'},
  {label:'😴 Tired',value:0,key:'tired'}
]

const keywords = {
  happy:['happy','joy','great','good','excited'],
  sad:['sad','unhappy','down','cry','upset'],
  angry:['angry','mad','frustrated','annoyed'],
  tired:['tired','sleepy','exhausted'],
}

function detectFromText(txt=''){
  const t = txt.toLowerCase()
  for(const [k, list] of Object.entries(keywords)){
    if(list.some(w => t.includes(w))) return k
  }
  return 'neutral'
}

export default function MoodEntry(){
  const [selected,setSelected]=useState(2)
  const [note,setNote]=useState('')
  const [result,setResult]=useState(null)

  const onSubmit=()=>{
    const bySlider = moods.find(m=>m.value===selected)?.key || 'neutral'
    const byText = detectFromText(note)
    const detected = byText==='neutral'? bySlider : byText

    const mapEmoji = {
      happy:'😄', okay:'🙂', neutral:'😐', low:'☁',
      tired:'😴', sad:'😢', angry:'😡'
    }

    const line =
      detected==='happy' ? 'You seem happy today!' :
      detected==='sad' ? 'You’re feeling a bit low today?' :
      detected==='angry' ? 'It’s okay to feel angry sometimes.' :
      detected==='tired' ? 'Rest might help. Be gentle with yourself.' :
      detected==='low' ? 'Low energy happens. Small steps are fine.' :
      detected==='okay' ? 'You’re doing okay — keep going.' :
      'Mood noted.'

    setResult({ detected, text: `${line} ${mapEmoji[detected]||''}` })

    // TODO: POST /mood with { user_id, mood: detected, note }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Log a Mood 🙂</h1>

        <div className="grid gap-3 mt-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {moods.map((m,i)=>(
              <button
                key={i}
                className={`rounded-2xl px-3 py-3 border ${
                  selected===m.value
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white hover:bg-brand-50 border-slate-200'
                }`}
                onClick={()=>setSelected(m.value)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div>
            <label className="label">Or use slider</label>
            <input
              type="range"
              min="0"
              max="4"
              value={selected}
              onChange={e=>setSelected(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-slate-600">Selected: {selected}</div>
          </div>

          <div>
            <label className="label">Optional note</label>
            <textarea
              className="input h-24"
              value={note}
              onChange={e=>setNote(e.target.value)}
              placeholder="What’s influencing your mood? (keywords like happy/sad/angry/tired help detection)"
            />
          </div>

          <button className="btn" onClick={onSubmit}>Submit</button>

          {result && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-800">
              <strong>Detected mood:</strong> {result.detected} — {result.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
