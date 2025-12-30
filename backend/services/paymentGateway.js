const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Creates an order with the Razorpay payment gateway.
 * @param {number} amount - The total amount in smallest currency unit (e.g., paise for INR).
 * @param {string} currency - The currency code (e.g., 'INR').
 * @param {string} receipt - A unique receipt ID for the order.
 * @returns {Promise<object>} - The Razorpay order object.
 */
const createOrder = async (amount, currency, receipt) => {
  try {
    const options = {
      amount: amount, // amount in smallest currency unit
      currency: currency,
      receipt: receipt,
      payment_capture: 1, // 1 for auto capture, 0 for manual
    };
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order.');
  }
};

/**
 * Verifies the payment signature received from Razorpay webhook.
 * @param {string} razorpay_order_id - The order ID from Razorpay.
 * @param {string} razorpay_payment_id - The payment ID from Razorpay.
 * @param {string} razorpay_signature - The signature received from Razorpay.
 * @returns {boolean} - True if the signature is valid, false otherwise.
 */
const verifyPaymentSignature = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    console.error('RAZORPAY_KEY_SECRET is not set. Cannot verify signature.');
    return false;
  }
  
  const hmac = require('crypto').createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  const isValid = generated_signature === razorpay_signature;
  console.log('Payment signature verification:', isValid ? 'Successful' : 'Failed');
  return isValid;
};

module.exports = {
  createOrder,
  verifyPaymentSignature,
};
