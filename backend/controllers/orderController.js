const { sequelize, CartItem, Order, OrderItem, Product } = require('../models');
const paymentGateway = require('../services/paymentGateway');

/**
 * Creates a new order from the user's cart and initiates payment.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const createOrder = async (req, res, next) => {
  const userId = req.user.id;
  const { shipping_address } = req.body;

  if (!shipping_address || typeof shipping_address !== 'object' || Object.keys(shipping_address).length === 0) {
    return res.status(400).json({ message: 'Shipping address is required.' });
  }

  let transaction;
  try {
    transaction = await sequelize.transaction();

    // 1. Fetch cart items
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'stock'] }],
      transaction,
    });

    if (cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    let totalAmount = 0;
    const orderItemsData = [];

    // 2. Validate stock and prepare order items
    for (const item of cartItems) {
      const product = item.Product;
      if (!product || product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ message: `Not enough stock for ${product ? product.name : 'unknown product'}. Available: ${product ? product.stock : 0}` });
      }

      totalAmount += parseFloat(product.price) * item.quantity;
      orderItemsData.push({
        product_id: product.id,
        quantity: item.quantity,
        price_at_purchase: product.price,
      });

      // 3. Decrease product stock (optimistic update, payment webhook will finalize)
      await product.update({ stock: product.stock - item.quantity }, { transaction });
    }

    // 4. Create the order
    const order = await Order.create({
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending', // Initial status is pending payment
      shipping_address: shipping_address,
    }, { transaction });

    // 5. Link order items to the order
    for (const itemData of orderItemsData) {
      await OrderItem.create({
        order_id: order.id,
        ...itemData,
      }, { transaction });
    }

    // 6. Clear the user's cart
    await CartItem.destroy({ where: { user_id: userId }, transaction });

    // 7. Initiate payment with Razorpay
    const paymentOrder = await paymentGateway.createOrder(
      Math.round(totalAmount * 100), // Razorpay expects amount in paise
      'INR', // Currency code
      `order_${order.id}` // Unique receipt ID
    );

    await order.update({ payment_id: paymentOrder.id }, { transaction }); // Store Razorpay order ID

    await transaction.commit();

    res.status(201).json({
      message: 'Order created successfully. Proceed to payment.',
      order_id: order.id,
      total_amount: order.total_amount,
      payment_details: {
        order_id: paymentOrder.id,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        receipt: paymentOrder.receipt,
      },
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error creating order:', error);
    next(error);
  }
};

/**
 * Retrieves all orders for the authenticated user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const getUserOrders = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'image_urls'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    next(error);
  }
};

/**
 * Retrieves details for a specific order.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const getOrderDetails = async (req, res, next) => {
  const userId = req.user.id;
  const { id: orderId } = req.params;

  try {
    const order = await Order.findOne({
      where: { id: orderId, user_id: userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'description', 'image_urls', '3d_model_url'] }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to view it.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderDetails,
};
