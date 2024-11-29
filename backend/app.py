from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity



app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication
CORS(app, origins="http://localhost:3000")  # Allow requests from localhost:3000

api = Api(app)  # Initialize Flask-RESTX API

# JWT setup
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this in production!
jwt = JWTManager(app)



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

user_model = api.model('Signup', {
    'email': fields.String(description='Email Address'),
    'password': fields.String(description='Password'),

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

    # Create a user table for login (username, password)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
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

# Resource for user signup (register new user)
class Signup(Resource):
    @api.expect(user_model)
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')


        # Check if username already exists
        conn = get_db()
        existing_user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()

        if existing_user:
            return {"error": "Username already taken"}, 400

        # # Hash the password before saving
        # hashed_password = generate_password_hash(password, method='sha256')

        # Insert new user into the database
        conn.execute('''
            INSERT INTO users (email, password)
            VALUES (?, ?)
        ''', (email, password))
        conn.commit()
        return {"message": "User created successfully!"}, 201

# Resource for login (JWT token generation)
class Login(Resource):
    @api.expect(user_model)
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')

        # Check if user exists and password matches
        conn = get_db()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()

        if user and user['password'] == password:  # In a real app, password should be hashed
            # Create a JWT token
            access_token = create_access_token(identity=email)
            # Return the user object along with the token
            return {
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                },
                "token": access_token
            }, 200
        else:
            return {"error": "Invalid username or password"}, 401

# Protected route (requires JWT)
class Admin(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()  # Get the current logged-in user
        return {"message": f"Welcome to the admin page, {current_user}!"}, 200

# Add resources to the API
api.add_resource(Feedback, '/feedback')  # All feedback actions (POST, GET)
api.add_resource(FeedbackByID, '/feedback/<int:id>')  # Feedback by ID (GET)
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')  # Login for JWT token
api.add_resource(Admin, '/admin')  # Admin page (protected by JWT)

if __name__ == '__main__':
    init_db()  # Initialize the database table
    app.run(debug=True)  # Run the Flask app

