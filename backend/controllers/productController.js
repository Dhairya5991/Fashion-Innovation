const { Product } = require('../models');
const { Op } = require('sequelize');

/**
 * Retrieves all products, with optional filtering.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const getAllProducts = async (req, res, next) => {
  const { category, search } = req.query;
  const where = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  try {
    const products = await Product.findAll({ where });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    next(error);
  }
};

/**
 * Retrieves a single product by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    next(error);
  }
};

/**
 * Creates a new product (Admin only).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const createProduct = async (req, res, next) => {
  const { name, description, price, stock, category, image_urls, sustainability_metrics, '3d_model_url': model3dUrl } = req.body;

  if (!name || !price || stock === undefined || price < 0 || stock < 0) {
    return res.status(400).json({ message: 'Name, price, and stock are required and must be valid.' });
  }

  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image_urls: image_urls || [],
      sustainability_metrics: sustainability_metrics || {},
      '3d_model_url': model3dUrl || null,
    });
    res.status(201).json({ message: 'Product created successfully.', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    next(error);
  }
};

/**
 * Updates an existing product by ID (Admin only).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, stock, category, image_urls, sustainability_metrics, '3d_model_url': model3dUrl } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price !== undefined ? price : product.price,
      stock: stock !== undefined ? stock : product.stock,
      category: category || product.category,
      image_urls: image_urls || product.image_urls,
      sustainability_metrics: sustainability_metrics || product.sustainability_metrics,
      '3d_model_url': model3dUrl !== undefined ? model3dUrl : product['3d_model_url'],
    });

    res.status(200).json({ message: 'Product updated successfully.', product });
  } catch (error) {
    console.error('Error updating product:', error);
    next(error);
  }
};

/**
 * Deletes a product by ID (Admin only).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    // Handle foreign key constraint error if product is part of existing carts/orders
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Cannot delete product. It is associated with existing cart items or orders.',
        details: error.message
      });
    }
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
