from flask import Flask, request, jsonify
from avatar_logic import generate_avatar_model

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_avatar():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    required_measurements = ['height', 'chest', 'waist', 'hips']
    if not all(m in data for m in required_measurements):
        return jsonify({"message": f"Missing required measurements: {', '.join(required_measurements)}"}), 400

    try:
        # Call the avatar generation logic
        avatar_url = generate_avatar_model(data)
        return jsonify({"avatar_url": avatar_url}), 200
    except Exception as e:
        app.logger.error(f"Error generating avatar: {e}")
        return jsonify({"message": f"Failed to generate avatar: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
