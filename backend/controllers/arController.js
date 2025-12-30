const { User, Product } = require('../models');
const aiBodyScanService = require('../services/aiBodyScanService');
const avatarGenerationService = require('../services/avatarGenerationService');
const garmentMappingService = require('../services/garmentMappingService');

/**
 * Processes an image/video for body dimension scanning using the AI body scanner service.
 * Updates the user's profile with the new measurements.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const processBodyScan = async (req, res, next) => {
  const userId = req.user.id; // Authenticated user
  const imageData = req.body; // Expecting raw image buffer or base64 string
  const contentType = req.headers['content-type']; // E.g., 'image/jpeg', 'image/png'

  if (!imageData) {
    return res.status(400).json({ message: 'Image data is required for body scan.' });
  }
  if (!contentType || !contentType.startsWith('image/')) {
    return res.status(400).json({ message: 'Content-Type must be an image type (e.g., image/jpeg).' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Call AI Body Scan Service
    const measurements = await aiBodyScanService.sendImageForScan(imageData, contentType);

    // Update user's measurements
    user.measurements = { ...user.measurements, ...measurements };
    await user.save();

    res.status(200).json({
      message: 'Body scan processed and measurements updated.',
      measurements: user.measurements,
    });
  } catch (error) {
    console.error('Error in processBodyScan:', error);
    next(error);
  }
};

/**
 * Generates a 3D avatar based on user measurements using the AI avatar generation service.
 * Updates the user's profile with the avatar URL.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const generateAvatar = async (req, res, next) => {
  const userId = req.user.id; // Authenticated user
  const { measurements } = req.body; // Measurements can also be taken from user's profile

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Use provided measurements or fallback to user's stored measurements
    const actualMeasurements = measurements || user.measurements;

    if (!actualMeasurements || Object.keys(actualMeasurements).length === 0) {
      return res.status(400).json({ message: 'Measurements are required to generate an avatar.' });
    }

    // Call AI Avatar Generation Service
    const { avatar_url } = await avatarGenerationService.sendMeasurementsForAvatar(actualMeasurements);

    // Update user's avatar URL
    user.avatar_url = avatar_url;
    await user.save();

    res.status(200).json({
      message: '3D avatar generated successfully.',
      avatar_url: user.avatar_url,
    });
  } catch (error) {
    console.error('Error in generateAvatar:', error);
    next(error);
  }
};

/**
 * Forwards avatar and garment 3D model URLs to the AR garment mapping service.
 * Returns the mapped garment data/URL for frontend AR rendering.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const mapGarmentToAvatar = async (req, res, next) => {
  const userId = req.user.id; // Authenticated user
  const { garment_3d_model_url, product_id } = req.body;

  if (!garment_3d_model_url && !product_id) {
    return res.status(400).json({ message: 'Garment 3D model URL or product ID is required.' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (!user.avatar_url) {
      return res.status(400).json({ message: 'User does not have a generated 3D avatar. Please generate one first.' });
    }

    let actualGarment3dModelUrl = garment_3d_model_url;
    if (product_id) {
      const product = await Product.findByPk(product_id);
      if (!product || !product['3d_model_url']) {
        return res.status(404).json({ message: 'Product not found or does not have a 3D model.' });
      }
      actualGarment3dModelUrl = product['3d_model_url'];
    }

    if (!actualGarment3dModelUrl) {
      return res.status(400).json({ message: 'Garment 3D model URL could not be determined.' });
    }

    // Call AI Garment Mapping Service
    const mappingResult = await garmentMappingService.sendAvatarAndGarmentForMapping(
      user.avatar_url,
      actualGarment3dModelUrl
    );

    res.status(200).json({
      message: 'Garment mapping data retrieved successfully.',
      mapping_data: mappingResult,
    });
  } catch (error) {
    console.error('Error in mapGarmentToAvatar:', error);
    next(error);
  }
};

module.exports = {
  processBodyScan,
  generateAvatar,
  mapGarmentToAvatar,
};
