import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import { earnTokens, getBalance } from '../utils/tokenHelpers.js';
let _razorpay = null;
function getRazorpay() {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return _razorpay;
}
const TOKEN_PLANS = [{
  key: 'starter',
  label: 'Starter Pack',
  priceINR: 49,
  tokens: 500
}, {
  key: 'popular',
  label: 'Popular Pack',
  priceINR: 99,
  tokens: 1200
}, {
  key: 'pro',
  label: 'Pro Pack',
  priceINR: 199,
  tokens: 3000
}, {
  key: 'elite',
  label: 'Elite Pack',
  priceINR: 499,
  tokens: 8000
}, {
  key: 'ultimate',
  label: 'Ultimate Pack',
  priceINR: 999,
  tokens: 20000
}];
export const getPlans = (req, res) => {
  res.status(200).json({
    success: true,
    data: TOKEN_PLANS
  });
};
export const createOrder = async (req, res) => {
  try {
    const {
      plan
    } = req.body;
    const selected = TOKEN_PLANS.find(p => p.key === plan);
    if (!selected) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan'
      });
    }
    const amountInPaise = selected.priceINR * 100;
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    const order = await getRazorpay().orders.create(options);
    await Payment.create({
      userId: req.user.id,
      razorpayOrderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      tokenAmount: selected.tokens,
      plan: selected.key,
      status: 'created'
    });
    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: amountInPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,
        plan: selected
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
};
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
    const payment = await Payment.findOneAndUpdate({
      razorpayOrderId: razorpay_order_id,
      status: 'created'
    }, {
      $set: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid'
      }
    }, {
      new: true
    });
    if (!payment) {
      const existing = await Payment.findOne({
        razorpayOrderId: razorpay_order_id
      });
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Payment record not found'
        });
      }
      const balance = await getBalance(existing.userId);
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        data: {
          tokensAwarded: existing.tokenAmount,
          newBalance: balance
        }
      });
    }
    const result = await earnTokens(payment.userId, payment.tokenAmount, {
      referenceType: 'payment',
      referenceId: payment._id,
      reason: `Purchased ${payment.plan} pack (₹${(payment.amount / 100).toFixed(0)})`,
      meta: {
        razorpayPaymentId: razorpay_payment_id,
        plan: payment.plan
      }
    });
    res.status(200).json({
      success: true,
      message: 'Payment verified! Tokens added to your wallet.',
      data: {
        tokensAwarded: payment.tokenAmount,
        newBalance: result.balance,
        payment: {
          id: payment._id,
          plan: payment.plan,
          amount: payment.amount,
          razorpayPaymentId: razorpay_payment_id
        }
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
};
export const paymentWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing signature'
      });
    }
    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');
    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }
    const event = req.body;
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const existing = await Payment.findOneAndUpdate({
        razorpayOrderId: orderId,
        status: 'created'
      }, {
        $set: {
          razorpayPaymentId: paymentId,
          status: 'paid'
        }
      }, {
        new: true
      });
      if (existing) {
        await earnTokens(existing.userId, existing.tokenAmount, {
          referenceType: 'payment',
          referenceId: existing._id,
          reason: `Purchased ${existing.plan} pack (via webhook)`,
          meta: {
            razorpayPaymentId: paymentId,
            source: 'webhook'
          }
        });
      }
    }
    res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(200).json({
      success: true
    });
  }
};
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.user.id
    }).sort({
      createdAt: -1
    }).limit(20);
    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
};