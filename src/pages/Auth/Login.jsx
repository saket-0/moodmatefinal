import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login(){
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [isAdmin,setIsAdmin]=useState(false)

  const onSubmit=(e)=>{
    e.preventDefault()
    setUser({
      name: email.split('@')[0] || 'User',
      email,
      isAdmin,
      id: email || ('user-'+Date.now())
    })
    navigate(isAdmin?'/admin/dashboard':'/profile')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          </div>
          <div className="flex items-center gap-2">
            <input id="admin" type="checkbox" checked={isAdmin} onChange={e=>setIsAdmin(e.target.checked)}/>
            <label htmlFor="admin" className="text-sm">Login as Admin</label>
          </div>
          <button className="btn w-full" type="submit">Login</button>
        </form>
        <div className="mt-3 flex justify-between text-sm">
          <Link className="link" to="#">Forgot password?</Link>
          <Link className="link" to="/signup">No account? Sign up</Link>
        </div>
      </div>
    </div>
  )
}
