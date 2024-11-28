from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
from flask_restx import Api, Resource, fields


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication
CORS(app, resources={r"/feedback": {"origins": "http://localhost:3000"}})
api = Api(app)  # Initialize Flask-RESTX API


# Define the Feedback model using Flask-RESTX's fields
feedback_model = api.model('Feedback', {
    'full_name': fields.String(description='Full Name (Optional)'),
    'email': fields.String(description='Email Address (Optional)'),
    'phone': fields.String(description='Phone Number (Optional)'),
    'contact_permission': fields.Boolean(description='Permission to contact about feedback'),
    'role': fields.String(required=True, description='Role Interviewed For'),
    'interview_date': fields.String(required=True, description='Date of Interview'),
    'interview_type': fields.String(required=True, description='Type of Interview'),
    'interview_mode': fields.String(required=True, description='Mode of Interview'),
    'rating_experience': fields.Integer(required=True, description='Overall Experience Rating (1-5)'),
    'rating_professionalism': fields.Integer(required=True, description='Interviewer Professionalism Rating (1-5)'),
    'difficulty': fields.String(required=True, description='Interview Difficulty'),
    'description_clear': fields.Boolean(description='Was the role description clear?'),
    'liked': fields.String(description='What did you like about the interview process?'),
    'improved': fields.String(description='What could be improved?'),
    'recommendation': fields.String(required=True, description='Would you recommend Swisscom?'),
    'heard_about': fields.String(description='How did you hear about this opportunity?')
})

# Connect to the SQLite database
def get_db():
    conn = sqlite3.connect('feedback.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize the database with all fields
def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY,
            full_name TEXT,
            email TEXT,
            phone TEXT,
            contact_permission BOOLEAN,
            role TEXT NOT NULL,
            interview_date TEXT NOT NULL,
            interview_type TEXT NOT NULL,
            interview_mode TEXT NOT NULL,
            rating_experience INTEGER NOT NULL,
            rating_professionalism INTEGER NOT NULL,
            difficulty TEXT NOT NULL,
            description_clear BOOLEAN,
            liked TEXT,
            improved TEXT,
            recommendation TEXT NOT NULL,
            heard_about TEXT
        )
    ''')
    conn.commit()

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Swisscom Feedback API"})

# Resource to handle feedback submission
class Feedback(Resource):
    # POST method to submit feedback
    @api.expect(feedback_model)
    def post(self):
        data = request.json

        # Extract fields from the request
        full_name = data.get('full_name')
        email = data.get('email')
        phone = data.get('phone')
        contact_permission = data.get('contact_permission')
        role = data['role']
        interview_date = data['interview_date']
        interview_type = data['interview_type']
        interview_mode = data['interview_mode']
        rating_experience = data['rating_experience']
        rating_professionalism = data['rating_professionalism']
        difficulty = data['difficulty']
        description_clear = data.get('description_clear')
        liked = data.get('liked')
        improved = data.get('improved')
        recommendation = data['recommendation']
        heard_about = data.get('heard_about')

        # Save feedback in the database
        conn = get_db()
        conn.execute('''
            INSERT INTO feedback 
            (full_name, email, phone, contact_permission, role, interview_date, interview_type, interview_mode,
             rating_experience, rating_professionalism, difficulty, description_clear, liked, improved,
             recommendation, heard_about)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (full_name, email, phone, contact_permission, role, interview_date, interview_type, interview_mode,
              rating_experience, rating_professionalism, difficulty, description_clear, liked, improved,
              recommendation, heard_about))
        conn.commit()

        return {"message": "Feedback submitted successfully!"}, 201

    # GET method to retrieve all feedback
    def get(self):
        conn = get_db()
        feedback = conn.execute('SELECT * FROM feedback').fetchall()

        # Convert feedback rows to dictionaries (so it's serializable)
        feedback_list = [dict(row) for row in feedback]

        # Return feedback as JSON
        return feedback_list, 200

# Resource to handle retrieving feedback by ID
class FeedbackByID(Resource):
    def get(self, id):
        conn = get_db()
        feedback = conn.execute('SELECT * FROM feedback WHERE id = ?', (id,)).fetchone()

        if feedback is None:
            return jsonify({"error": "Feedback not found"}), 404

        # Convert the row to a dictionary for easy JSON response
        feedback_data = dict(feedback)

        return feedback_data, 200

# Add resources to the API
api.add_resource(Feedback, '/feedback')  # All feedback actions (POST, GET)
api.add_resource(FeedbackByID, '/feedback/<int:id>')  # Feedback by ID (GET)

if __name__ == '__main__':
    init_db()  # Initialize the database table
    app.run(debug=True)  # Run the Flask app
