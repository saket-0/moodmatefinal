import { Link } from 'react-router-dom'

export default function SafetyModal(){
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Before you start ⚠️</h1>
        <p className="text-slate-700 mt-1">
          You’re about to start an anonymous chat. Do not share personal info. Be supportive and respectful.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 mt-2">
          <li>Stay anonymous.</li>
          <li>Be kind; avoid harmful advice.</li>
          <li>Use the Report/Block buttons if needed.</li>
        </ul>
        <div className="mt-4 flex gap-2">
          <Link to="/" className="btn-outline w-full text-center">Cancel</Link>
          <Link to="/chat/lobby" className="btn w-full text-center">I Understand</Link>
        </div>
      </div>
    </div>
  )
}
