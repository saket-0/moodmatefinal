// src/pages/Auth/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api'; // CORRECTED PATH: Was ../api

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', age: '', gender: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = await api.post('/register', {
      name: form.name,
      email: form.email,
      password: form.password
      // Note: age and gender are not in the backend User model, so they are ignored here.
      // You would need to add them to the User model in app.py if you want to save them.
    });

    setLoading(false);
    if (data.user) {
      alert('Sign up successful! Please log in.');
      navigate('/login'); // Redirect to login after successful signup
    } else {
      setError(data.error || 'Signup failed. Please try again.');
    }
  };

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Sign up</h1>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
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
          <button className="btn w-full" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}