# feedback_stats.py

import sqlite3


def get_db():
    conn = sqlite3.connect('feedback.db')
    conn.row_factory = sqlite3.Row
    return conn


def get_total_feedback(conn):
    query = 'SELECT COUNT(*) as total_feedback FROM feedback'
    result = conn.execute(query).fetchone()
    return result['total_feedback']


def get_avg_rating(conn):
    query = 'SELECT AVG(rating_experience) as avg_rating FROM feedback'
    result = conn.execute(query).fetchone()
    return round(result['avg_rating'], 2)


def get_most_common_role(conn):
    query = 'SELECT role, COUNT(*) as role_count FROM feedback GROUP BY role ORDER BY role_count DESC LIMIT 1'
    result = conn.execute(query).fetchone()
    return result['role'] if result else None


def get_interview_mode_distribution(conn):
    query = '''
        SELECT interview_mode, COUNT(*) as mode_count
        FROM feedback
        GROUP BY interview_mode
    '''
    results = conn.execute(query).fetchall()
    distribution = {
        "In-Person": 0,
        "Virtual": 0,
        "Phone": 0,
    }
    for mode in results:
        distribution[mode['interview_mode']] = mode['mode_count']
    return distribution


def get_interview_type_distribution(conn):
    query = '''
        SELECT interview_type, COUNT(*) as type_count
        FROM feedback
        GROUP BY interview_type
    '''
    results = conn.execute(query).fetchall()
    distribution = {}
    for type_data in results:
        distribution[type_data['interview_type']] = type_data['type_count']
    return distribution


def get_difficulty_distribution(conn):
    query = '''
        SELECT difficulty, COUNT(*) as difficulty_count
        FROM feedback
        GROUP BY difficulty
    '''
    results = conn.execute(query).fetchall()
    distribution = {
        "Very Easy": 0,
        "Easy": 0,
        "Neutral": 0,
        "Challenging": 0,
        "Very Difficult": 0,
    }
    for diff in results:
        distribution[diff['difficulty']] = diff['difficulty_count']
    return distribution


def get_experience_rating_distribution(conn):
    query = '''
        SELECT rating_experience, COUNT(*) as experience_count
        FROM feedback
        GROUP BY rating_experience
    '''
    results = conn.execute(query).fetchall()
    distribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    }
    for exp in results:
        distribution[exp['rating_experience']] = exp['experience_count']
    return distribution


def get_heard_about_distribution(conn):
    query = '''
        SELECT heard_about, COUNT(*) as heard_count
        FROM feedback
        GROUP BY heard_about
    '''
    results = conn.execute(query).fetchall()
    distribution = {}
    for heard in results:
        distribution[heard['heard_about']] = heard['heard_count']
    return distribution


def get_feedback_stats():
    conn = get_db()

    total_feedback = get_total_feedback(conn)
    avg_rating = get_avg_rating(conn)
    most_common_role = get_most_common_role(conn)
    interview_mode_distribution = get_interview_mode_distribution(conn)
    interview_type_distribution = get_interview_type_distribution(conn)
    difficulty_distribution = get_difficulty_distribution(conn)
    experience_rating_distribution = get_experience_rating_distribution(conn)
    heard_about_distribution = get_heard_about_distribution(conn)

    return {
        'total_feedbacks': total_feedback,
        'average_rating': avg_rating,
        'most_common_role': most_common_role,
        'interview_mode_distribution': interview_mode_distribution,
        'interview_type_distribution': interview_type_distribution,
        'difficulty_distribution': difficulty_distribution,
        'experience_rating_distribution': experience_rating_distribution,
        'heard_about_distribution': heard_about_distribution
    }
