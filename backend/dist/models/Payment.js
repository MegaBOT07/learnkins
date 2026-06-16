import mongoose from 'mongoose';
const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  razorpayOrderId: {
    type: String,
    unique: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  // amount in paise (₹1 = 100 paise)
  currency: {
    type: String,
    default: 'INR'
  },
  tokenAmount: {
    type: Number,
    required: true
  },
  // number of tokens awarded
  plan: {
    type: String,
    required: true
  },
  // e.g. 'starter', 'popular', 'pro'
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'refunded'],
    default: 'created'
  }
}, {
  timestamps: true
});
export default mongoose.model('Payment', paymentSchema);