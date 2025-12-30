const axios = require('axios');
require('dotenv').config();

const AI_AVATAR_GEN_SERVICE_URL = process.env.AI_AVATAR_GEN_SERVICE_URL;

if (!AI_AVATAR_GEN_SERVICE_URL) {
  console.warn('AI_AVATAR_GEN_SERVICE_URL is not defined. AI Avatar Generation service calls will fail.');
}

/**
 * Sends user measurements to the 3D avatar generation microservice.
 * @param {object} measurements - An object containing user body measurements (e.g., { height, chest, waist, hips }).
 * @returns {Promise<object>} - A promise that resolves to an object containing the URL to the generated 3D avatar model.
 */
const sendMeasurementsForAvatar = async (measurements) => {
  if (!AI_AVATAR_GEN_SERVICE_URL) {
    throw new Error('AI Avatar Generation service URL is not configured.');
  }

  try {
    const response = await axios.post(`${AI_AVATAR_GEN_SERVICE_URL}/generate`, measurements, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('AI Avatar Generation service response:', response.data);
    return response.data; // Expecting { avatar_url: 'http://example.com/avatar.glb' }
  } catch (error) {
    console.error('Error calling AI Avatar Generation service:', error.message);
    if (error.response) {
      console.error('AI Avatar Generation service response error:', error.response.data);
      throw new Error(`AI Avatar Generation service error: ${error.response.status} - ${error.response.data.message || error.response.data}`);
    } else if (error.request) {
      console.error('AI Avatar Generation service no response:', error.request);
      throw new Error('AI Avatar Generation service did not respond.');
    } else {
      throw new Error(`Failed to send measurements to AI Avatar Generation service: ${error.message}`);
    }
  }
};

module.exports = {
  sendMeasurementsForAvatar,
};
