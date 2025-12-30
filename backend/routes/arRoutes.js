const express = require('express');
const router = express.Router();
const arController = require('../controllers/arController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const bodyParser = require('body-parser');

// All AR routes require JWT authentication
router.use(authenticateJWT);

// POST /api/ar/scan - Accepts image/video, forwards to AI body scanner service
// Use raw body parser for image upload
router.post('/scan', bodyParser.raw({ type: 'image/*', limit: '5mb' }), arController.processBodyScan);

// POST /api/ar/avatar - Accepts measurements, forwards to 3D avatar generation service
router.post('/avatar', arController.generateAvatar);

// POST /api/ar/garment-map - Accepts avatar_id/url, garment_3d_model_url, forwards to AR garment mapping service
router.post('/garment-map', arController.mapGarmentToAvatar);

module.exports = router;
