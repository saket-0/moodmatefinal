// src/pages/SavedJournals.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api'; // Import api

export default function SavedJournals() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      api.get(`/journal/${user.id}`).then(data => {
        if (!data.error) {
          setItems(data);
        }
        setLoading(false);
      });
    }
  }, [user?.id]);

  const open = (id) => {
    localStorage.setItem('mm_current_journal_id', id); // This logic remains
    navigate('/journal');
  };

  const remove = async (id) => {
    if (!confirm('Delete this journal? This cannot be undone.')) return;
    
    const data = await api.delete(`/journal/session/${id}`);
    
    if (data.error) {
      alert('Error deleting journal: ' + data.error);
    } else {
      // Remove from state locally
      setItems(prevItems => prevItems.filter(i => i.journalId !== id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-bold mb-3">Saved Journals ✍️</h1>
        {loading && <p className="text-slate-600">Loading journals...</p>}
        
        {!loading && items.length === 0 && (
          <p className="text-slate-600">
            No saved journals yet. Start one from the Journal page.
          </p>
        )}

        {!loading && items.length > 0 && (
          <ul className="divide-y">
            {items.map(it => (
              <li key={it.journalId} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-slate-600">
                    {new Date(it.updatedAt).toLocaleString()} • {it.count} messages
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-outline" onClick={() => open(it.journalId)}>Open</button>
                  <button className="btn" onClick={() => remove(it.journalId)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}