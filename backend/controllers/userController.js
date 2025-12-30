const { User } = require('../models');

/**
 * Retrieves a user's profile by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const getUserProfile = async (req, res, next) => {
  const userId = req.params.id;

  // Ensure the requesting user is authorized to view this profile
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Forbidden: You can only view your own profile.' });
  }

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'measurements', 'avatar_url', 'createdAt', 'updatedAt'], // Exclude password hash
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    next(error);
  }
};

/**
 * Updates a user's profile by ID.
 * Allows updating measurements and avatar_url. Password updates should be a separate route.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const updateUserProfile = async (req, res, next) => {
  const userId = req.params.id;
  const { measurements, avatar_url } = req.body;

  // Ensure the requesting user is authorized to update this profile
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Only update allowed fields
    if (measurements !== undefined) {
      user.measurements = { ...user.measurements, ...measurements }; // Merge new measurements
    }
    if (avatar_url !== undefined) {
      user.avatar_url = avatar_url;
    }

    await user.save();

    res.status(200).json({
      message: 'User profile updated successfully.',
      user: {
        id: user.id,
        email: user.email,
        measurements: user.measurements,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
