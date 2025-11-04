import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Profile(){
  const { user, setUser } = useAuth()
  const [name,setName]=useState(user?.name||'')
  const [email,setEmail]=useState(user?.email||'')
  const [preview,setPreview]=useState(null)

  const onSave=(e)=>{
    e.preventDefault()
    setUser(prev=>({...prev,name,email}))
    alert('Profile saved (frontend only). Connect to backend to persist.')
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Your Profile 🙂</h1>
        <div className="text-xs text-slate-600 mt-1">
          User ID: <code>{user?.id}</code>
        </div>

        <form className="grid md:grid-cols-2 gap-4 mt-4" onSubmit={onSave}>
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={email} onChange={e=>setEmail(e.target.value)}/>
          </div>

          <div className="md:col-span-2">
            <label className="label">Profile Picture (optional)</label>
            <input className="input" type="file" accept="image/*"
              onChange={e=>{
                const f=e.target.files?.[0]
                if(f){
                  const url=URL.createObjectURL(f)
                  setPreview(url)
                }
              }}
            />
            {preview && <img src={preview} alt="preview" className="mt-3 h-24 w-24 rounded-full object-cover"/>}
          </div>

          <div className="md:col-span-2">
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-100 to-sky-100">
              <p className="text-sm text-slate-700">
                <strong>Mood summary (preview):</strong> You’ve logged 6 entries this week. Trending calmer. Keep going! 😌
              </p>
            </div>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button className="btn" type="submit">Save</button>
            <button className="btn-outline" type="button"
              onClick={()=>alert('Connect this to backend: Delete account / Logout etc.')}
            >
              More actions
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
