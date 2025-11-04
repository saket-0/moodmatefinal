import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'

import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Profile from './pages/Profile'
import MoodEntry from './pages/MoodEntry'
import MoodTrends from './pages/MoodTrends'
import Journal from './pages/Journal'
import SavedJournals from './pages/SavedJournals'
import ChatLobby from './pages/Chat/Lobby'
import ChatWindow from './pages/Chat/Window'
import SafetyModal from './pages/Chat/SafetyModal'
import Resources from './pages/Resources'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/Dashboard'

function Home(){
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h1 className="text-3xl font-extrabold text-brand-700">Welcome to MoodMate 🙂</h1>
          <p className="mt-2 text-slate-700">
            Track moods, journal with a gentle AI counselor, chat anonymously, and discover resources.
            This is a <strong>frontend-only</strong> demo with placeholders where your backend connects.
          </p>
          <div className="mt-4 flex gap-3">
            <Link className="btn" to="/mood">Track Mood 😄</Link>
            <Link className="btn-outline" to="/journal">Write Journal ✍️</Link>
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-2">What’s inside</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Auth (Login / Signup) and Profile editing</li>
            <li>Mood tracking + Trends (Recharts)</li>
            <li>AI Journaling Assistant (counselor-style chat with timestamps)</li>
            <li>Anonymous Peer Chat UI + Safety modal</li>
            <li>Resource Hub with search & filters</li>
            <li>Admin Dashboard (frontend access only)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function App(){
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />

        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />

        <Route path="/mood" element={<MoodEntry/>} />
        <Route path="/trends" element={<MoodTrends/>} />

        <Route path="/journal" element={<ProtectedRoute><Journal/></ProtectedRoute>} />
        <Route path="/journals" element={<ProtectedRoute><SavedJournals/></ProtectedRoute>} />

        <Route path="/chat" element={<SafetyModal/>} />
        <Route path="/chat/lobby" element={<ChatLobby/>} />
        <Route path="/chat/window" element={<ChatWindow/>} />

        <Route path="/resources" element={<Resources/>} />

        <Route path="/admin" element={<AdminLogin/>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard/></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
      <footer className="text-center text-sm text-slate-600 py-8">
        Built with ❤️ Frontend-only demo. Replace placeholders with backend calls.
      </footer>
    </div>
  )
}
