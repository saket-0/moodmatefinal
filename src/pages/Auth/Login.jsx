// src/pages/Auth/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api'; // Import the api helper

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for errors
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = await api.post('/login', { email, password });

    setLoading(false);
    if (data.user) {
      setUser(data.user); // Set the full user object from backend
      navigate(data.user.isAdmin ? '/admin/dashboard' : '/profile');
    } else {
      setError(data.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {/* Admin checkbox is removed, isAdmin is now determined by the backend */}
          <button className="btn w-full" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-3 flex justify-between text-sm">
          <Link className="link" to="#">Forgot password?</Link>
          <Link className="link" to="/signup">No account? Sign up</Link>
        </div>
      </div>
    </div>
  );
}