from flask import Flask, request, jsonify
from mapping_logic import map_garment_to_avatar

app = Flask(__name__)

@app.route('/map', methods=['POST'])
def map_garment():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    avatar_model_url = data.get('avatar_model_url')
    garment_model_url = data.get('garment_model_url')

    if not avatar_model_url or not garment_model_url:
        return jsonify({"message": "Both avatar_model_url and garment_model_url are required"}), 400

    try:
        # Call the garment mapping logic
        mapping_result = map_garment_to_avatar(avatar_model_url, garment_model_url)
        return jsonify(mapping_result), 200
    except Exception as e:
        app.logger.error(f"Error mapping garment: {e}")
        return jsonify({"message": f"Failed to map garment: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)
