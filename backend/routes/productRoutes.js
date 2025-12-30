const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateJWT, authorizeAdmin } = require('../middleware/authMiddleware');

// GET /api/products - Lists all products, with optional filters
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Retrieves single product details
router.get('/:id', productController.getProductById);

// Admin routes (require authentication and admin authorization)
// For simplicity, we'll use authenticateJWT and a placeholder authorizeAdmin.
// In a real app, authorizeAdmin would check for actual admin roles.

// POST /api/products - Create a new product
router.post('/', authenticateJWT, authorizeAdmin, productController.createProduct);

// PUT /api/products/:id - Update an existing product
router.put('/:id', authenticateJWT, authorizeAdmin, productController.updateProduct);

// DELETE /api/products/:id - Delete a product
router.delete('/:id', authenticateJWT, authorizeAdmin, productController.deleteProduct);

module.exports = router;
