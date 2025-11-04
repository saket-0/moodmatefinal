// src/pages/Auth/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api'; // Import api

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
          {/* ... (form inputs for name, age, gender, email, password remain the same) ... */}
          <input className="input" value={form.name} onChange={e=>update('name',e.target.value)} required/>
          {/* ... other inputs ... */}
          <input className="input" type="email" value={form.email} onChange={e=>update('email',e.target.value)} required/>
          <input className="input" type="password" value={form.password} onChange={e=>update('password',e.target.value)} required/>
          <button className="btn w-full" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}