import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin(){
  const navigate=useNavigate()
  const { setUser }=useAuth()
  const [password,setPassword]=useState('')

  const submit=(e)=>{
    e.preventDefault()
    setUser({
      name:'Admin',
      email:'admin@example.com',
      isAdmin:true,
      id:'admin'
    })
    navigate('/admin/dashboard')
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <form className="mt-3 space-y-3" onSubmit={submit}>
          <input
            className="input"
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
          <button className="btn w-full">Enter</button>
        </form>
        <p className="text-xs text-slate-600 mt-2">
          Frontend-only check. Replace with real admin auth on backend.
        </p>
      </div>
    </div>
  )
}
