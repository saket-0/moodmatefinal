import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function Navbar(){
  const { user, setUser } = useAuth()
  const [open, setOpen] = useState(false)

  const navItem = (to,label)=>(
    <NavLink
      to={to}
      className={({isActive})=>
        `px-3 py-2 rounded-xl ${isActive?'bg-brand-600 text-white':'hover:bg-white/70'}`
      }
      onClick={()=>setOpen(false)}
    >
      {label}
    </NavLink>
  )

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-white/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <button className="md:hidden btn-outline p-2" onClick={()=>setOpen(!open)} aria-label="Toggle menu">
          <Menu size={20} />
        </button>

        <Link to="/" className="font-extrabold text-xl text-brand-700">🙂 MoodMate</Link>

        <nav className="hidden md:flex gap-1 ml-4">
          {navItem('/mood','Mood Entry')}
          {navItem('/trends','Mood Trends')}
          {navItem('/journal','Journal 🤝')}
          {navItem('/journals','Saved Journals')}
          {navItem('/chat','Peer Chat')}
          {navItem('/resources','Resources 📚')}
          {navItem('/profile','Profile')}
          {navItem('/admin','Admin')}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-700">Hi, {user.name}</span>
              <button className="btn-outline" onClick={()=>setUser(null)}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/signup" className="btn">Sign up</Link>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-2">
          {navItem('/mood','Mood Entry')}
          {navItem('/trends','Mood Trends')}
          {navItem('/journal','Journal 🤝')}
          {navItem('/journals','Saved Journals')}
          {navItem('/chat','Peer Chat')}
          {navItem('/resources','Resources 📚')}
          {navItem('/profile','Profile')}
          {navItem('/admin','Admin')}
        </div>
      )}
    </header>
  )
}
