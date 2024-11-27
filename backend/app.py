from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from http import HTTPStatus

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication
api = Api(app)  # Initialize Flask-RESTX API

# Define the Feedback model using Flask-RESTX's fields
feedback_model = api.model('Feedback', {
    'rating': fields.Integer(required=True, description='The rating of the feedback'),
    'comments': fields.String(required=True, description='The comments from the user'),
    'recommendation': fields.String(required=True, description='Recommendation (Yes/No)')
})

# Connect to the SQLite database
def get_db():
    conn = sqlite3.connect('feedback.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize the database (only need to run once)
def init_db():
    conn = get_db()
    conn.execute('CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY, rating INTEGER, comments TEXT, recommendation TEXT)')
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
        rating = data.get('rating')
        comments = data.get('comments')
        recommendation = data.get('recommendation')

        if not rating or not comments or recommendation is None:
            return jsonify({"error": "Missing required fields"}), 400

        # Save feedback in the database
        conn = get_db()
        conn.execute('INSERT INTO feedback (rating, comments, recommendation) VALUES (?, ?, ?)',
                     (rating, comments, recommendation))
        conn.commit()

        return {"message": "Feedback submitted successfully!"}, 201

    # GET method to retrieve all feedback
    def get(self):
        conn = get_db()
        feedback = conn.execute('SELECT * FROM feedback').fetchall()

        # Convert feedback rows to dictionaries (so it's serializable)
        feedback_list = [dict(row) for row in feedback]  # Convert each row to a dictionary

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
        feedback_data = dict(feedback)  # Convert single row to dictionary

        # Return the feedback as JSON
        return feedback_data, 200

# Add resources to the API
api.add_resource(Feedback, '/feedback')  # All feedback actions (POST, GET)
api.add_resource(FeedbackByID, '/feedback/<int:id>')  # Feedback by ID (GET)

if __name__ == '__main__':
    init_db()  # Initialize the database table
    app.run(debug=True)  # Run the Flask app
