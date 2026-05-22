import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import TokenTransaction from '../models/TokenTransaction.js';

let _razorpay = null;
function getRazorpay() {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
}

// Token packs: [planKey, { label, priceINR, tokens }]
const TOKEN_PLANS = [
  { key: 'starter',  label: 'Starter Pack',  priceINR: 49,  tokens: 500 },
  { key: 'popular',  label: 'Popular Pack',  priceINR: 99,  tokens: 1200 },
  { key: 'pro',      label: 'Pro Pack',      priceINR: 199, tokens: 3000 },
  { key: 'elite',    label: 'Elite Pack',    priceINR: 499, tokens: 8000 },
  { key: 'ultimate', label: 'Ultimate Pack', priceINR: 999, tokens: 20000 },
];

// @desc    Get available token plans
// @route   GET /api/payments/plans
// @access  Public
export const getPlans = (req, res) => {
  res.status(200).json({ success: true, data: TOKEN_PLANS });
};

// @desc    Create a Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const selected = TOKEN_PLANS.find(p => p.key === plan);
    if (!selected) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const amountInPaise = selected.priceINR * 100; // Razorpay uses paise

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await getRazorpay().orders.create(options);

    // Save to DB
    await Payment.create({
      userId: req.user.id,
      razorpayOrderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      tokenAmount: selected.tokens,
      plan: selected.key,
      status: 'created',
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: amountInPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,
        plan: selected,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// @desc    Verify Razorpay payment & award tokens
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Find the payment record
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Update payment record
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = 'paid';
    await payment.save();

    // Award tokens to user
    const user = await User.findById(payment.userId);
    if (user) {
      user.tokens = (user.tokens || 0) + payment.tokenAmount;
      await user.save();

      // Record token transaction
      await TokenTransaction.create({
        userId: user._id,
        type: 'award',
        amount: payment.tokenAmount,
        reason: `Purchased ${payment.plan} pack (₹${(payment.amount / 100).toFixed(0)})`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified! Tokens added to your wallet.',
      data: {
        tokensAwarded: payment.tokenAmount,
        newBalance: user?.tokens || 0,
        payment: {
          id: payment._id,
          plan: payment.plan,
          amount: payment.amount,
          razorpayPaymentId: razorpay_payment_id,
        },
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

// @desc    Get user payment history
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment history' });
  }
};


