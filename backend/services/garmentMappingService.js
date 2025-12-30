const axios = require('axios');
require('dotenv').config();

const AI_GARMENT_MAP_SERVICE_URL = process.env.AI_GARMENT_MAP_SERVICE_URL;

if (!AI_GARMENT_MAP_SERVICE_URL) {
  console.warn('AI_GARMENT_MAP_SERVICE_URL is not defined. AI Garment Mapping service calls will fail.');
}

/**
 * Sends avatar and garment 3D model URLs to the AR garment mapping microservice.
 * @param {string} avatar3dModelUrl - URL to the user's 3D avatar model.
 * @param {string} garment3dModelUrl - URL to the 3D garment model.
 * @returns {Promise<object>} - A promise that resolves to an object containing information
 *                               for mapping (e.g., transformed garment model URL, or pose data).
 */
const sendAvatarAndGarmentForMapping = async (avatar3dModelUrl, garment3dModelUrl) => {
  if (!AI_GARMENT_MAP_SERVICE_URL) {
    throw new Error('AI Garment Mapping service URL is not configured.');
  }

  try {
    const response = await axios.post(`${AI_GARMENT_MAP_SERVICE_URL}/map`, {
      avatar_model_url: avatar3dModelUrl,
      garment_model_url: garment3dModelUrl,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('AI Garment Mapping service response:', response.data);
    return response.data; // Expecting { mapped_garment_url: 'http://example.com/mapped_garment.glb' } or pose data
  } catch (error) {
    console.error('Error calling AI Garment Mapping service:', error.message);
    if (error.response) {
      console.error('AI Garment Mapping service response error:', error.response.data);
      throw new Error(`AI Garment Mapping service error: ${error.response.status} - ${error.response.data.message || error.response.data}`);
    } else if (error.request) {
      console.error('AI Garment Mapping service no response:', error.request);
      throw new Error('AI Garment Mapping service did not respond.');
    } else {
      throw new Error(`Failed to send models to AI Garment Mapping service: ${error.message}`);
    }
  }
};

module.exports = {
  sendAvatarAndGarmentForMapping,
};
