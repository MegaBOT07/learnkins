import mongoose from 'mongoose';

const shopItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['flashcard_pack', 'quiz_unlock', 'power_up', 'boost', 'cosmetic'],
    required: true,
  },
  price: { type: Number, required: true, min: 1 },
  icon: { type: String, default: '🎁' },
  subject: { type: String, enum: ['science', 'mathematics', 'social-science', 'english', 'all'], default: 'all' },
  grade: { type: String, enum: ['6th', '7th', '8th', 'all'], default: 'all' },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  stock: { type: Number, default: -1 }, // -1 = unlimited
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('ShopItem', shopItemSchema);
