from flask import Flask, request, jsonify
from io import BytesIO
from PIL import Image
from model import process_image_for_measurements

app = Flask(__name__)

@app.route('/scan', methods=['POST'])
def scan_body():
    if 'image' not in request.files and not request.data:
        return jsonify({"message": "No image provided"}), 400

    image_data = None
    if 'image' in request.files:
        image_data = request.files['image'].read()
    elif request.data:
        image_data = request.data # Expect raw image bytes or base64 encoded string

    if not image_data:
        return jsonify({"message": "No image data found"}), 400

    try:
        # Assuming process_image_for_measurements can handle raw image bytes
        # or base64 (if decoded first). For simplicity, let's assume raw bytes.
        # If it's a base64 string, you'd decode it first:
        # from base64 import b64decode
        # image_data = b64decode(image_data)
        
        # For this mock, we'll just pass the raw bytes.
        # The `model.py` should handle loading it into an image format.
        measurements = process_image_for_measurements(image_data)
        return jsonify(measurements), 200
    except Exception as e:
        app.logger.error(f"Error processing image for measurements: {e}")
        return jsonify({"message": f"Failed to process image: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
