import mongoose from 'mongoose';

const tokenLedgerEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['earn', 'spend', 'refund', 'expire', 'admin_adjust'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balanceBefore: {
    type: Number,
    required: true,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  referenceType: {
    type: String,
    enum: ['quiz', 'game', 'daily', 'payment', 'shop', 'admin', 'refund', 'achievement'],
    default: null,
  },
  referenceId: {
    type: String,
    default: null,
  },
  idempotencyKey: {
    type: String,
    unique: true,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
}, { timestamps: true });

tokenLedgerEntrySchema.index({ userId: 1, createdAt: -1 });
tokenLedgerEntrySchema.index({ idempotencyKey: 1 }, { unique: true });

export default mongoose.model('TokenLedgerEntry', tokenLedgerEntrySchema);
