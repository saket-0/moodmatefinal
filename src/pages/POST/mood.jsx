// src/pages/MoodEntry.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { api } from '../../api'; // Import api

// ... (moods, keywords, detectFromText functions remain the same)

export default function MoodEntry() {
  const { user } = useAuth(); // Get the user
  const [selected, setSelected] = useState(2);
  const [note, setNote] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!user) {
      alert('Please log in to save your mood.');
      return;
    }
    setLoading(true);

    // ... (logic for detecting mood remains the same)
    const bySlider = moods.find(m=>m.value===selected)?.key || 'neutral'
    const byText = detectFromText(note)
    const detected = byText==='neutral'? bySlider : byText
    // ... (logic for mapEmoji and line remains the same)
    
    setResult({ detected, text: `...` });

    // POST /mood with { user_id, mood: detected, note }
    const data = await api.post('/mood', {
      user_id: user.id,
      mood: detected,
      note: note,
      date: new Date().toISOString().split('T')[0] // Send YYYY-MM-DD
    });

    setLoading(false);
    if (data.error) {
      setResult({ detected, text: 'Could not save mood: ' + data.error });
    } else {
      // Result text is already set
    }
  };

  return (
    // ... (JSX remains the same, add disabled={loading} to submit button)
    <button className="btn" onClick={onSubmit} disabled={loading}>
      {loading ? 'Submitting...' : 'Submit'}
    </button>
    // ...
  );
}