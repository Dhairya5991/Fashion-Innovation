const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// All order routes require JWT authentication
router.use(authenticateJWT);

// GET /api/orders - Lists user's orders
router.get('/', orderController.getUserOrders);

// GET /api/orders/:id - Retrieves specific order details
router.get('/:id', orderController.getOrderDetails);

// POST /api/orders - Creates a new order from cart, initiates payment
router.post('/', orderController.createOrder);

module.exports = router;
