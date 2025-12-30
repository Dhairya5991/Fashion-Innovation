const { CartItem, Product } = require('../models');

/**
 * Retrieves the user's shopping cart.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const getCart = async (req, res, next) => {
  const userId = req.user.id; // User ID from authenticated token

  try {
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'image_urls', 'stock', '3d_model_url'],
        },
      ],
    });

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.Product.price * item.quantity), 0);

    res.status(200).json({
      cartItems,
      totalAmount: parseFloat(totalAmount).toFixed(2),
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    next(error);
  }
};

/**
 * Adds an item to the user's cart or updates its quantity if already exists.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const addItemToCart = async (req, res, next) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Product ID and a positive quantity are required.' });
  }

  try {
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Not enough stock for ${product.name}. Available: ${product.stock}` });
    }

    let cartItem = await CartItem.findOne({
      where: { user_id: userId, product_id },
    });

    if (cartItem) {
      // If item exists, update quantity
      const newQuantity = cartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: `Adding ${quantity} would exceed stock for ${product.name}. Max allowed: ${product.stock - cartItem.quantity}` });
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      // If item does not exist, create new cart item
      cartItem = await CartItem.create({
        user_id: userId,
        product_id,
        quantity,
      });
    }

    res.status(200).json({ message: 'Item added/updated in cart successfully.', cartItem });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    next(error);
  }
};

/**
 * Updates the quantity of a specific cart item.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const updateCartItem = async (req, res, next) => {
  const userId = req.user.id;
  const { id: cartItemId } = req.params; // Cart item ID
  const { quantity } = req.body;

  if (quantity === undefined || quantity < 0) {
    return res.status(400).json({ message: 'Quantity must be a non-negative number.' });
  }

  try {
    let cartItem = await CartItem.findOne({
      where: { id: cartItemId, user_id: userId },
      include: [{ model: Product, attributes: ['stock'] }],
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await cartItem.destroy();
      return res.status(200).json({ message: 'Item removed from cart successfully.' });
    }

    if (cartItem.Product.stock < quantity) {
      return res.status(400).json({ message: `Not enough stock for product. Available: ${cartItem.Product.stock}` });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Cart item quantity updated successfully.', cartItem });
  } catch (error) {
    console.error('Error updating cart item:', error);
    next(error);
  }
};

/**
 * Removes an item from the user's cart.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const removeCartItem = async (req, res, next) => {
  const userId = req.user.id;
  const { id: cartItemId } = req.params; // Cart item ID

  try {
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, user_id: userId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    await cartItem.destroy();
    res.status(200).json({ message: 'Item removed from cart successfully.' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    next(error);
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
};
