import mongoose from 'mongoose';
const tokenAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  lifetimeEarned: {
    type: Number,
    default: 0
  },
  lifetimeSpent: {
    type: Number,
    default: 0
  },
  dailyEarnedDate: {
    type: String,
    default: null
  },
  dailyEarnedToday: {
    type: Number,
    default: 0
  },
  lastDailyClaim: {
    type: Date,
    default: null
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  version: {
    type: Number,
    default: 0
  },
  isFrozen: {
    type: Boolean,
    default: false
  },
  freezeReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});
tokenAccountSchema.index({
  userId: 1
}, {
  unique: true
});
export default mongoose.model('TokenAccount', tokenAccountSchema);