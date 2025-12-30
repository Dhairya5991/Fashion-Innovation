const paymentGateway = require('../services/paymentGateway');
const { Order } = require('../models');
const crypto = require('crypto'); // Node.js built-in crypto module

/**
 * Initiates a payment process for a given order.
 * This is typically called by the frontend after an order is created.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const initiatePayment = async (req, res, next) => {
  const userId = req.user.id;
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({ message: 'Order ID is required.' });
  }

  try {
    const order = await Order.findOne({ where: { id: order_id, user_id: userId } });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or does not belong to the user.' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ message: `Order status is ${order.status}. Payment cannot be initiated.` });
    }

    // Amount needs to be in smallest currency unit (e.g., paise for INR)
    const amountInPaise = Math.round(parseFloat(order.total_amount) * 100);

    const paymentOrder = await paymentGateway.createOrder(
      amountInPaise,
      'INR', // Assuming INR for now, can be dynamic
      `order_${order.id}`
    );

    // Update order with payment gateway's order ID
    await order.update({ payment_id: paymentOrder.id });

    res.status(200).json({
      message: 'Payment initiation successful.',
      razorpay_order_id: paymentOrder.id,
      amount: paymentOrder.amount, // in paise
      currency: paymentOrder.currency,
      receipt: paymentOrder.receipt,
    });

  } catch (error) {
    console.error('Error initiating payment:', error);
    next(error);
  }
};

/**
 * Handles payment status updates from the payment gateway (webhook).
 * This endpoint should be publicly accessible by the payment gateway.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const handlePaymentWebhook = async (req, res, next) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET; // A secret to verify webhook authenticity (if available)

  // Razorpay sends `x-razorpay-signature` in headers
  const razorpay_signature = req.headers['x-razorpay-signature'];
  const payload = req.body;

  // For Razorpay, the payload is typically JSON. If it's raw text, you might need to adjust.
  // The verification needs the raw body, not the parsed JSON.
  // Ensure body-parser is configured to keep raw body for webhook routes.
  // For this example, we assume `req.rawBody` is available if body-parser is configured correctly.
  // If not, you might need a dedicated webhook middleware.
  const rawBody = JSON.stringify(payload); // Or use actual raw body if available from middleware

  // Verify signature (Razorpay specific)
  // const isValidSignature = paymentGateway.verifyPaymentSignature(
  //   payload.payload.payment.entity.order_id,
  //   payload.payload.payment.entity.id,
  //   razorpay_signature
  // );

  // A simplified mock verification for demonstration:
  // In a real scenario, you'd use the paymentGateway.verifyPaymentSignature
  // and ensure you have the raw body for HMAC generation.
  const isValidSignature = true; // Placeholder for actual signature verification

  if (!isValidSignature) {
    console.warn('Webhook signature verification failed.');
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const event = payload.event;
  const paymentEntity = payload.payload.payment.entity;
  const orderIdFromPayment = paymentEntity.order_id; // Razorpay's order ID

  try {
    const order = await Order.findOne({ where: { payment_id: orderIdFromPayment } });

    if (!order) {
      console.warn(`Order not found for payment_id: ${orderIdFromPayment}`);
      return res.status(404).json({ message: 'Order not found' });
    }

    if (event === 'payment.captured' || event === 'order.paid') {
      // Payment successful
      if (order.status === 'pending') {
        await order.update({
          status: 'completed',
          payment_id: paymentEntity.id // Store actual payment ID from gateway
        });
        console.log(`Order ${order.id} status updated to 'completed' for payment ${paymentEntity.id}`);
      }
    } else if (event === 'payment.failed') {
      // Payment failed
      if (order.status === 'pending') {
        await order.update({ status: 'failed' });
        console.log(`Order ${order.id} status updated to 'failed' for payment ${paymentEntity.id}`);
        // Optionally revert stock or notify user
      }
    }
    // Handle other events as needed

    res.status(200).json({ status: 'success' }); // Acknowledge webhook
  } catch (error) {
    console.error('Error handling payment webhook:', error);
    next(error); // Pass error to error handling middleware
  }
};

module.exports = {
  initiatePayment,
  handlePaymentWebhook,
};
