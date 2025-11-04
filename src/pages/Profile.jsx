// src/pages/Profile.jsx
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { api } from '../../api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch profile data on load
  useEffect(() => {
    if (user?.id) {
      api.get(`/profile/${user.id}`).then((data) => {
        if (!data.error) {
          setName(data.name);
          setEmail(data.email);
        }
      });
    }
  }, [user?.id]);

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await api.post('/profile', {
      user_id: user.id,
      name,
      email,
    });
    
    setLoading(false);
    if (data.user) {
      setUser(data.user); // Update context with new user info
      alert('Profile saved!');
    } else {
      alert('Error saving profile: ' + data.error);
    }
  };
  // ... (rest of the component JSX is the same)
  // ... (make sure to add disabled={loading} to the save button)
  return (
    // ...
    <form className="grid md:grid-cols-2 gap-4 mt-4" onSubmit={onSave}>
      {/* ... inputs ... */}
      <button className="btn" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
      {/* ... */}
    </form>
    // ...
  )
}