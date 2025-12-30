const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// GET /api/users/:id - Retrieve user profile
router.get('/:id', authenticateJWT, userController.getUserProfile);

// PUT /api/users/:id - Update user profile (e.g., measurements, avatar_url)
router.put('/:id', authenticateJWT, userController.updateUserProfile);

module.exports = router;
