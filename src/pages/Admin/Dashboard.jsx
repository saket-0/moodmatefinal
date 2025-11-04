import { useState } from 'react'

const TabButton=({active,onClick,children})=>(
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl font-semibold ${
      active
        ? 'bg-brand-600 text-white'
        : 'bg-white border border-slate-200 hover:bg-brand-50'
    }`}
  >
    {children}
  </button>
)

export default function AdminDashboard(){
  const [tab,setTab]=useState('flagged')

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Admin Dashboard 🛠</h1>

        <div className="mt-3 flex gap-2">
          <TabButton active={tab==='flagged'} onClick={()=>setTab('flagged')}>Flagged Chats</TabButton>
          <TabButton active={tab==='reports'} onClick={()=>setTab('reports')}>Reports</TabButton>
          <TabButton active={tab==='analytics'} onClick={()=>setTab('analytics')}>Analytics</TabButton>
        </div>

        {tab==='flagged'&&(
          <div className="mt-4 space-y-3">
            {[
              {id:1,reason:'Abusive language',user:'user123'},
              {id:2,reason:'Spam',user:'user22'}
            ].map(it=>(
              <div
                key={it.id}
                className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">Chat #{it.id}</div>
                  <div className="text-sm text-slate-600">
                    Reason: {it.reason} • by {it.user}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn-outline"
                    onClick={()=>alert('Warn sent (placeholder)')}
                  >
                    Warn
                  </button>
                  <button
                    className="btn"
                    onClick={()=>alert('User removed (placeholder)')}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='reports'&&(
          <div className="mt-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              Reports inbox placeholder. Connect to backend to list and resolve reports.
            </div>
          </div>
        )}

        {tab==='analytics'&&(
          <div className="mt-4 grid md:grid-cols-3 gap-3">
            {[
              {k:'Users',v:'1,204'},
              {k:'Active this week',v:'332'},
              {k:'Chats today',v:'89'}
            ].map((m,i)=>(
              <div key={i} className="card text-center">
                <div className="text-3xl font-extrabold text-brand-700">{m.v}</div>
                <div className="text-sm text-slate-600">{m.k}</div>
              </div>
            ))}

            <div className="md:col-span-3 p-4 rounded-2xl bg-gradient-to-r from-sky-100 to-emerald-100">
              Charts placeholder. Hook up with real analytics once backend is ready.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
