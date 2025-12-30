const axios = require('axios');
require('dotenv').config();

const AI_BODY_SCAN_SERVICE_URL = process.env.AI_BODY_SCAN_SERVICE_URL;

if (!AI_BODY_SCAN_SERVICE_URL) {
  console.warn('AI_BODY_SCAN_SERVICE_URL is not defined. AI Body Scan service calls will fail.');
}

/**
 * Sends an image (or image data) to the AI body scanner microservice for measurement extraction.
 * @param {Buffer | string} imageData - The image data, either as a Buffer or a base64 encoded string.
 * @param {string} [contentType='image/jpeg'] - The content type of the image (e.g., 'image/jpeg', 'image/png').
 * @returns {Promise<object>} - A promise that resolves to the body measurements (e.g., { height, chest, waist, hips }).
 */
const sendImageForScan = async (imageData, contentType = 'image/jpeg') => {
  if (!AI_BODY_SCAN_SERVICE_URL) {
    throw new Error('AI Body Scan service URL is not configured.');
  }

  try {
    const response = await axios.post(`${AI_BODY_SCAN_SERVICE_URL}/scan`, imageData, {
      headers: {
        'Content-Type': contentType,
      },
      maxBodyLength: Infinity, // Allow large image payloads
      maxContentLength: Infinity,
    });
    console.log('AI Body Scan service response:', response.data);
    return response.data; // Expecting { height, chest, waist, hips }
  } catch (error) {
    console.error('Error calling AI Body Scan service:', error.message);
    if (error.response) {
      console.error('AI Body Scan service response error:', error.response.data);
      throw new Error(`AI Body Scan service error: ${error.response.status} - ${error.response.data.message || error.response.data}`);
    } else if (error.request) {
      console.error('AI Body Scan service no response:', error.request);
      throw new Error('AI Body Scan service did not respond.');
    } else {
      throw new Error(`Failed to send image to AI Body Scan service: ${error.message}`);
    }
  }
};

module.exports = {
  sendImageForScan,
};
