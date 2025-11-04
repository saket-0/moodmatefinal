# MoodMate Final Frontend (v2+)
This is the final React + Vite + Tailwind frontend with:
- 🙂 MoodMate branding + subtle emojis
- Doodle background
- Mood detection after submit
- AI Journaling Assistant as counselor-style chat with timestamps, userId, journalId, and saved history
- Saved Journals page powered by localStorage
- Admin dashboard, Peer chat, Resource hub, Profile with mood summary

## How to run
1. Install Node.js LTS from https://nodejs.org/
2. Open this folder in VS Code.
3. In VS Code terminal, run:
   npm install
   npm run dev
4. Ctrl+Click the shown http://localhost:5173 link.

## Connect backend later
- Mood submission: see TODO comment in src/pages/MoodEntry.jsx (POST /mood)
- AI counselor chat: see TODO comment in src/pages/Journal.jsx (POST /ai-chat, GET history)
- Admin moderation / analytics: src/pages/Admin/Dashboard.jsx
