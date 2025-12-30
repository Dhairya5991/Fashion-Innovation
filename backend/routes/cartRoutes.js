const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// All cart routes require JWT authentication
router.use(authenticateJWT);

// GET /api/cart - Retrieves user's cart
router.get('/', cartController.getCart);

// POST /api/cart - Adds item to cart (or updates quantity if exists)
router.post('/', cartController.addItemToCart);

// PUT /api/cart/:id - Updates item quantity in cart (id is cart item ID)
router.put('/:id', cartController.updateCartItem);

// DELETE /api/cart/:id - Removes item from cart (id is cart item ID)
router.delete('/:id', cartController.removeCartItem);

module.exports = router;
