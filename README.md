Here is a complete `README.md` file for your full-stack project. You can copy this, save it as `README.md` in your project's main (root) folder, and it will replace the old one.

-----

# 🙂 MoodMate: Full Stack Mood Journal

MoodMate is a full-stack web application designed to help you track your moods, journal your thoughts with an AI companion, and view your emotional trends over time.

This project consists of a **React frontend** (using Vite and Tailwind CSS) and a **Python Flask backend** that serves a REST API and connects to a SQLite database.

## Features

  * **Secure User Authentication:** Sign up and log in for a personal account. Passwords are hashed on the backend.
  * **Mood Logging:** Log your daily mood (Happy, Okay, Neutral, Low, Tired) with an optional note.
  * **Mood Trends:** View a chart of your mood history, filterable by week or month.
  * **AI Journal:** A private, counselor-style chat interface. Your conversations are saved to your account, and you can create, rename, and delete multiple journal sessions.
  * **Saved Journals:** A dashboard to see all your past journal conversations.
  * **Resource Hub:** (Placeholder) A page for helpful articles and resources.
  * **Peer Chat:** (Placeholder) UI for a future anonymous peer-to-peer chat.

## Tech Stack

  * **Frontend:**
      * React.js
      * Vite
      * React Router
      * Tailwind CSS
      * Recharts (for charts)
  * **Backend:**
      * Python (Flask)
      * Flask-SQLAlchemy (for ORM)
      * Flask-CORS (for cross-origin requests)
      * Werkzeug (for password hashing)
  * **Database:**
      * SQLite

-----

## How to Run This Project

To run this application, you must run **both** the backend and frontend servers simultaneously in two separate terminals.

### 1\. Run the Backend (Flask)

> **Terminal 1**

1.  **Navigate to the backend folder:**

    ```bash
    cd backend
    ```

2.  **Create and activate a Python virtual environment: (OPTIONAL)**

      * On macOS/Linux:
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
      * On Windows:
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```

3.  **Install the required Python packages:**

    ```bash
    pip install flask flask_cors flask_sqlalchemy werkzeug
    ```

4.  **Run the backend server:**

    ```bash
    python app.py
    ```

    The server will start on `http://127.0.0.1:5000`.

### 2\. Run the Frontend (React)

> **Terminal 2**

1.  **Navigate to the root project folder** (the one with `package.json`):

    ```bash
    # If you are in the backend folder, go back up
    cd ..
    ```

2.  **Install the Node.js dependencies:**

    ```bash
    npm install
    ```

3.  **Run the frontend development server:**

    ```bash
    npm run dev
    ```

    The server will start on `http://localhost:5173`.

4.  **Open the app:**
    Open your browser and go to **`http://localhost:5173`** to use MoodMate.

-----

## Exploring the Database

All user data, moods, and journals are stored in a `moodmate.db` file located in the `/backend` folder.

To view the data, you can use a free tool like **[DB Browser for SQLite](https://sqlitebrowser.org/)**. Just open the `moodmate.db` file with it, and you can browse the `user`, `mood`, and `journal` tables to see the data you've created.

## API Endpoints (Quick Reference)

The Flask backend provides the following API:

  * **Auth**

      * `POST /register`: Create a new user.
      * `POST /login`: Log in a user and get their data.

  * **Profile**

      * `GET /profile/<user_id>`: Get user profile details (name, email).
      * `POST /profile`: Update a user's profile.

  * **Moods**

      * `GET /mood/<user_id>`: Get all moods for a user.
      * `POST /mood`: Save a new mood entry.

  * **AI Journals**

      * `GET /journal/<user_id>`: Get a list of all saved journal sessions for a user.
      * `GET /journal/session/<journal_id>`: Get the full message history for one journal.
      * `POST /journal`: Create or update a journal session (saves title and messages).
      * `DELETE /journal/session/<journal_id>`: Delete a journal session.

  * **AI Chat (Empathy Bot)**

      * `POST /ai-chat`: Send a message and get an AI response.