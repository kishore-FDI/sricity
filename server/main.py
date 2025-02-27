from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/session', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data = request.get_json()  # This properly parses JSON data
        print(data)
        return jsonify({'message': 'Data received'})
    return jsonify({'message': 'Hello, World!'})

if __name__ == '__main__':
    app.run(debug=True)
