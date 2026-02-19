import mongoose from 'mongoose';

const userPurchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem', required: true },
  tokensSpent: { type: Number, required: true },
  used: { type: Boolean, default: false },
  usedAt: { type: Date },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

userPurchaseSchema.index({ userId: 1, itemId: 1 });

export default mongoose.model('UserPurchase', userPurchaseSchema);
