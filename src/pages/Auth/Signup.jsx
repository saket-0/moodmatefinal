import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Signup(){
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [form,setForm]=useState({name:'',age:'',gender:'',email:'',password:''})

  const onSubmit=(e)=>{
    e.preventDefault()
    setUser({
      name: form.name || 'User',
      email: form.email,
      isAdmin:false,
      id: form.email || ('user-'+Date.now())
    })
    navigate('/profile')
  }

  const update=(k,v)=>setForm(p=>({...p,[k]:v}))

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Sign up</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={e=>update('name',e.target.value)} required/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Age</label>
              <input className="input" type="number" value={form.age} onChange={e=>update('age',e.target.value)} required/>
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={e=>update('gender',e.target.value)} required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={e=>update('email',e.target.value)} required/>
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password} onChange={e=>update('password',e.target.value)} required/>
          </div>
          <button className="btn w-full" type="submit">Create account</button>
        </form>
      </div>
    </div>
  )
}
