import { Link } from 'react-router-dom'

export default function ChatLobby(){
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card text-center">
        <h1 className="text-2xl font-bold">Anonymous Chat 💬</h1>
        <p className="text-slate-700">Searching for a peer…</p>
        <div className="animate-pulse mt-2 text-sm text-slate-500">Connecting...</div>
        <div className="mt-4">
          <Link to="/chat/window" className="btn">Open Chat Window</Link>
        </div>
      </div>
    </div>
  )
}
