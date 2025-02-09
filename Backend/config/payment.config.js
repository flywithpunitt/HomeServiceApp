// config/payment.config.js
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (amount) => {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      payment_capture: 1
    });
    return order;
  } catch (error) {
    console.error('Payment order creation failed:', error);
    throw error;
  }
};

module.exports = { createOrder };