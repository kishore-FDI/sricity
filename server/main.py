from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

def check_user_status(email):
    with open('data.json', 'r') as f:
        data = json.load(f)
        for user in data:
            if user.get('email') == email:
                return True, user.get('isAdmin', False)
    return False, False

@app.route('/session', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data = request.get_json()
        if data and 'user' in data:
            email = data['user']['emailAddresses'][0]['emailAddress']
            user_exists, is_admin = check_user_status(email)
            return jsonify({
                'message': 'Login successful' if user_exists else 'User on waitlist',
                'Login': user_exists,
                'isAdmin': is_admin
            })
    return jsonify({'message': 'Login failed', 'Login': False, 'isAdmin': False})

if __name__ == '__main__':
    app.run(debug=True)
