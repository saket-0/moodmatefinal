from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash # Import hashing functions
import datetime
import uuid
import json # Import json for message history

app = Flask(__name__)
CORS(app)

# SQLite DB setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///moodmate.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False) # Increased length for hash
    isAdmin = db.Column(db.Boolean, default=False) # Added isAdmin
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Journal(db.Model): # Repurposed for AI Chat History
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    title = db.Column(db.String(200), default='Untitled Journal') # Added title
    messages = db.Column(db.Text) # Stores a JSON string of message history
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Mood(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    mood = db.Column(db.String(50))
    note = db.Column(db.Text)
    date = db.Column(db.Date)

# Removed the redundant Profile model

class PeerChat(db.Model):
    id = db.Column(db.String(36), primary_key=True)

class ChatMessage(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    chat_id = db.Column(db.String(36), db.ForeignKey('peer_chat.id'))
    sender = db.Column(db.String(50))
    text = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

@app.before_request
def create_tables():
    db.create_all()

def generate_id():
    return str(uuid.uuid4())

# Helper to format user object
def format_user(user):
    return {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'isAdmin': user.isAdmin
    }

# --- AUTH endpoints ---
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    hashed_password = generate_password_hash(data['password']) # Hash the password
    
    new_user = User(
        id=generate_id(),
        name=data['name'],
        email=data['email'],
        password=hashed_password, # Store the hash
        isAdmin=False # Default to false
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully', 'user': format_user(new_user)}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']): # Check hash
        return jsonify({'error': 'Invalid email or password'}), 401
        
    # Return the full user object, as expected by the frontend
    return jsonify({'message': 'Login successful', 'user': format_user(user)})

# --- Journal (AI Chat History) ---
@app.route('/journal', methods=['POST']) # Creates/Updates a chat session
def add_journal():
    data = request.json
    journal = Journal.query.get(data['journal_id'])
    
    if not journal:
        journal = Journal(
            id=data['journal_id'],
            user_id=data['user_id']
        )
        db.session.add(journal)
        
    journal.title = data.get('title', 'Untitled Journal')
    journal.messages = data.get('messages', '[]') # Expects a JSON string
    journal.timestamp = datetime.datetime.utcnow()
    
    db.session.commit()
    return jsonify({'message': 'Journal session saved', 'journal_id': journal.id})

@app.route('/journal/<user_id>', methods=['GET']) # Gets list of saved chats
def get_journals(user_id):
    journals = Journal.query.filter_by(user_id=user_id).order_by(Journal.timestamp.desc()).all()
    
    return jsonify([{
        'journalId': j.id, # Match frontend key
        'title': j.title,
        'updatedAt': j.timestamp.isoformat(), # Match frontend key
        'count': len(json.loads(j.messages or '[]')) # Match frontend key
    } for j in journals])

@app.route('/journal/session/<journal_id>', methods=['GET']) # Gets messages for one chat
def get_journal_session(journal_id):
    journal = Journal.query.get(journal_id)
    if not journal:
        return jsonify({'title': 'Untitled Journal', 'messages': []}) # Return empty state
        
    return jsonify({
        'title': journal.title,
        'messages': json.loads(journal.messages or '[]')
    })

@app.route('/journal/session/<journal_id>', methods=['DELETE']) # Deletes a chat
def delete_journal(journal_id):
    journal = Journal.query.get(journal_id)
    if journal:
        db.session.delete(journal)
        db.session.commit()
        return jsonify({'message': 'Journal deleted'})
    return jsonify({'error': 'Journal not found'}), 404


# --- Mood ---
@app.route('/mood', methods=['POST'])
def add_mood():
    data = request.json
    try:
        mood_date = datetime.datetime.strptime(data.get('date'), '%Y-%m-%d').date()
    except:
        mood_date = datetime.datetime.utcnow().date()

    new_mood = Mood(
        id=generate_id(),
        user_id=data['user_id'],
        mood=data['mood'],
        note=data.get('note'),
        date=mood_date
    )
    db.session.add(new_mood)
    db.session.commit()
    return jsonify({'message': 'Mood added', 'mood_id': new_mood.id})

@app.route('/mood/<user_id>', methods=['GET'])
def get_moods(user_id):
    moods = Mood.query.filter_by(user_id=user_id).order_by(Mood.date.desc()).all()
    # Frontend recharts needs a number, not a string
    mood_map = { 'happy': 4, 'okay': 3, 'neutral': 2, 'low': 1, 'tired': 0, 'sad': 1, 'angry': 1 }
    
    return jsonify([{
        'id': m.id,
        'mood': mood_map.get(m.mood.lower(), 2), # Convert to number
        'note': m.note,
        'date': m.date.isoformat()
    } for m in moods])

# --- Profile ---
@app.route('/profile', methods=['POST']) # Uses User model
def save_profile():
    data = request.json
    user = User.query.get(data['user_id']) # Get user by ID
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    user.name = data['name']
    user.email = data['email']
    db.session.commit()
    return jsonify({'message': 'Profile saved', 'user': format_user(user)})

@app.route('/profile/<user_id>', methods=['GET']) # Uses User model
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({
        'name': user.name,
        'email': user.email
    })

# --- Peer chat ---
@app.route('/peer-chat', methods=['POST'])
def create_peer_chat():
    chat = PeerChat(id=generate_id())
    db.session.add(chat)
    db.session.commit()
    return jsonify({'chat_id': chat.id, 'messages': []})

@app.route('/peer-chat/<chat_id>/message', methods=['POST'])
def add_peer_message(chat_id):
    data = request.json
    chat = PeerChat.query.get(chat_id)
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404
    msg = ChatMessage(
        id=generate_id(),
        chat_id=chat_id,
        sender=data.get('from'),
        text=data.get('text')
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify({'message': 'Message added'})

@app.route('/peer-chat/<chat_id>', methods=['GET'])
def get_peer_chat(chat_id):
    messages = ChatMessage.query.filter_by(chat_id=chat_id).order_by(ChatMessage.timestamp).all()
    return jsonify([{
        'id': msg.id,
        'from': msg.sender,
        'text': msg.text,
        'at': msg.timestamp.isoformat()
    } for msg in messages])

# --- Empathy AI chat ---
def empathy_bot(text):
    t = text.lower()
    if any(word in t for word in ['sad','lonely','upset','down','depressed']):
        return "I'm sorry you're feeling this way. What triggered it today?"
    if any(word in t for word in ['happy','great','excited','proud','joy']):
        return "That's wonderful! What happened that made you feel this way?"
    if any(word in t for word in ['angry','mad','frustrated','annoyed']):
        return "Anger is a signal. What boundary felt crossed?"
    if any(word in t for word in ['tired','exhausted','sleepy','burnt']):
        return "Sounds like you need rest. Try a few deep breaths."
    return "Tell me more. What happened, and what do you need right now?"

@app.route('/ai-chat', methods=['POST'])
def ai_chat():
    data = request.json
    message = data.get('message', '')
    response = empathy_bot(message)
    return jsonify({'response': response})

@app.route('/suggestions/<user_id>', methods=['GET'])
def suggestions(user_id):
    user_moods = Mood.query.filter_by(user_id=user_id).all()
    tags = set()
    for entry in user_moods:
        if entry.mood and 'sad' in entry.mood.lower():
            tags.add('mood')
        if entry.note and 'sleep' in entry.note.lower():
            tags.add('sleep')
        if entry.note and 'breath' in entry.note.lower():
            tags.add('breathing')
    return jsonify({'tags': list(tags)})

@app.route('/resources', methods=['GET'])
def get_resources():
    resources = [
        {'title':'Breathing Basics', 'description':'Simple techniques to calm quickly', 'tags':['basics','breathing'], 'link':'#'},
        {'title':'Sleep Hygiene', 'description':'Habits to improve your sleep', 'tags':['sleep','habit'], 'link':'#'},
        {'title':'Mood Basics', 'description':'Understand your mood patterns', 'tags':['mood','basics'], 'link':'#'},
        {'title':'Start Journaling', 'description':'Capture thoughts to gain clarity', 'tags':['journal','habit'], 'link':'#'},
    ]
    return jsonify(resources)

if __name__ == '__main__':
    app.run(debug=True, port=5000)