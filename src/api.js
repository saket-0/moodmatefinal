// src/api.js
const API_URL = 'http://127.0.0.1:5000';

export const api = {
  post: async (endpoint, body) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      return { error: error.message };
    }
  },
  
  get: async (endpoint) => {
     try {
      const res = await fetch(`${API_URL}${endpoint}`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      return { error: error.message };
    }
  },

  delete: async (endpoint) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      return { error: error.message };
    }
  }
};