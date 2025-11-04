import React, { createContext, useContext, useState, useEffect } from 'react'
const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const raw = localStorage.getItem('mm_user')
    if(raw){ setUser(JSON.parse(raw)) }
  },[])

  useEffect(()=>{
    if(user) localStorage.setItem('mm_user', JSON.stringify(user))
    else localStorage.removeItem('mm_user')
  },[user])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}
export function useAuth(){ return useContext(AuthContext) }
