const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// POST /api/payment/initiate - Initiates payment with gateway for a given order
router.post('/initiate', authenticateJWT, paymentController.initiatePayment);

// POST /api/payment/webhook - Receives payment status updates from gateway
// This route should NOT use authenticateJWT as it's called by the payment gateway directly.
// It might need custom middleware for raw body parsing and signature verification.
router.post('/webhook', paymentController.handlePaymentWebhook);

module.exports = router;
