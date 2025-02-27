from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import qrcode
import base64
from io import BytesIO
import uuid

load_dotenv()

mongodb_uri = os.getenv('MONGODB_URI')
if not mongodb_uri:
    raise ValueError("MongoDB test URI not found in environment variables")

# Create MongoDB client
client = MongoClient(mongodb_uri)
db = client.MediScript
users_collection = db.Users
rooms_collection = db.Rooms 

app = Flask(__name__)
CORS(app)

def check_user_status(email):
    """Check if user exists and create if not found."""
    user = users_collection.find_one({
        "$or": [
            {"email": email},
            {f'"{email}"': "admin"}
        ]
    })
    
    if not user:
        new_user = {
            "email": email,
            "isAdmin": False,
            "isApproved": False
        }
        users_collection.insert_one(new_user)
        return False, False, False
    
    is_admin = (
        user.get('isAdmin', False) or
        user.get('"isAdmin"', '').lower() == 'true'
    )
    
    is_approved = user.get('isApproved', False)
    return True, is_admin, is_approved

@app.route('/session', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data = request.get_json()
        if data and 'user' in data:
            email = data['user']['emailAddresses'][0]['emailAddress']
            user_exists, is_admin, is_approved = check_user_status(email)
            return jsonify({
                'message': 'Login successful' if is_approved else 'User on waitlist',
                'Login': is_approved,
                'isAdmin': bool(is_admin)
            })
    return jsonify({'message': 'Login failed', 'Login': False, 'isAdmin': False})

@app.route('/users', methods=['GET'])
def get_users():
    """Get all users for admin panel."""
    users = list(users_collection.find())
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users)


@app.route('/create-room', methods=['POST'])
def create_room():
    data = request.get_json()
    email = data.get('session')
    room_name = data.get('roomName')

    if not email or not room_name:
        return jsonify({'error': 'Missing required fields'}), 400

    # Generate a unique room ID
    room_id = str(uuid.uuid4())

    # Generate QR code with room ID
    qr = qrcode.make(room_id)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    qr_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    # Store in MongoDB
    room_data = {
        "roomID": room_id,
        "roomName": room_name,
        "email": email,
        "qrCode": qr_base64  # Optional: Store QR in DB if needed
    }
    rooms_collection.insert_one(room_data)

    return jsonify({'message': 'Room created successfully', 'roomID': room_id, 'qrCode': qr_base64})

@app.route('/users/<email>', methods=['PUT'])
def update_user(email):
    """Update user permissions."""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    update_data = {}
    if 'isApproved' in data:
        update_data['isApproved'] = data['isApproved']
    if 'isAdmin' in data:
        update_data['isAdmin'] = data['isAdmin']
        
    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400
    
    result = users_collection.update_one(
        {"email": email},
        {"$set": update_data}
    )
    
    if result.modified_count:
        return jsonify({'message': 'User updated successfully'})
    return jsonify({'error': 'User not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
