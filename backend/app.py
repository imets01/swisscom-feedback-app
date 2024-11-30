from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash




app = Flask(__name__)
CORS(app)
CORS(app, origins="http://localhost:3000")

api = Api(app)

# JWT setup
app.config['JWT_SECRET_KEY'] = 'mGgh1kMZRp+cdsOmI1mIJpC+20kHZIeLogoGCj5Z/YY='
jwt = JWTManager(app)



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

class Feedback(Resource):
    @api.expect(feedback_model)
    def post(self):
        data = request.json

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

    def get(self):

        page = request.args.get('page', default=1, type=int)  # Default page = 1
        limit = request.args.get('limit', default=10, type=int)  # Default limit = 10

        offset = (page - 1) * limit

        conn = get_db()

        feedback_query = 'SELECT * FROM feedback LIMIT ? OFFSET ?'
        feedback = conn.execute(feedback_query, (limit, offset)).fetchall()

        total_feedback_query = 'SELECT COUNT(*) as total_feedback FROM feedback'
        total_feedback_result = conn.execute(total_feedback_query).fetchone()
        total_feedback = total_feedback_result['total_feedback']

        feedback_list = [dict(row) for row in feedback]

        return {
            'feedback': feedback_list,
            'total': total_feedback
        }, 200

class FeedbackByID(Resource):
    def get(self, id):
        conn = get_db()
        feedback = conn.execute('SELECT * FROM feedback WHERE id = ?', (id,)).fetchone()

        if feedback is None:
            return jsonify({"error": "Feedback not found"}), 404

        feedback_data = dict(feedback)

        return feedback_data, 200


# Resource for feedback statistics
class FeedbackStats(Resource):
    def get(self):
        conn = get_db()

        total_feedback_query = 'SELECT COUNT(*) as total_feedback FROM feedback'
        total_feedback_result = conn.execute(total_feedback_query).fetchone()
        total_feedback = total_feedback_result['total_feedback']

        # Calculate average rating for experience
        avg_rating_query = 'SELECT AVG(rating_experience) as avg_rating FROM feedback'
        avg_rating_result = conn.execute(avg_rating_query).fetchone()
        avg_rating = round(avg_rating_result['avg_rating'], 2)

        # Calculate the most common role
        role_query = 'SELECT role, COUNT(*) as role_count FROM feedback GROUP BY role ORDER BY role_count DESC LIMIT 1'
        role_result = conn.execute(role_query).fetchone()
        most_common_role = role_result['role'] if role_result else None

        # Calculate the interview mode distribution
        mode_query = '''
            SELECT interview_mode, COUNT(*) as mode_count
            FROM feedback
            GROUP BY interview_mode
        '''
        mode_results = conn.execute(mode_query).fetchall()

        interview_mode_distribution = {
            "In-Person": 0,
            "Virtual": 0,
            "Phone": 0,
        }

        for mode in mode_results:
            interview_mode = mode['interview_mode']
            if interview_mode in interview_mode_distribution:
                interview_mode_distribution[interview_mode] = mode['mode_count']

        return jsonify({
            'total_feedbacks': total_feedback,
            'average_rating': avg_rating,
            'most_common_role': most_common_role,
            'interview_mode_distribution': interview_mode_distribution
        })



class Signup(Resource):
    @api.expect(user_model)
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')


        conn = get_db()
        existing_user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()

        if existing_user:
            return {"error": "Username already taken"}, 400

        # # Hash the password before saving
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        conn.execute('''
            INSERT INTO users (email, password)
            VALUES (?, ?)
        ''', (email, hashed_password ))
        conn.commit()
        return {"message": "User created successfully!"}, 201

class Login(Resource):
    @api.expect(user_model)
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')
        conn = get_db()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        is_valid = check_password_hash(user['password'], password)
        
        if user and is_valid:
            access_token = create_access_token(identity=email)

            return {
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                },
                "token": access_token
            }, 200
        else:
            return {"error": "Invalid username or password"}, 401

class Admin(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return {"message": f"Welcome to the admin page, {current_user}!"}, 200

# Add resources to the API
api.add_resource(Feedback, '/feedback')
api.add_resource(FeedbackByID, '/feedback/<int:id>')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Admin, '/admin')
api.add_resource(FeedbackStats, '/stats')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)

