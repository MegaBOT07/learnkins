import mongoose from 'mongoose';

const economyConfigSchema = new mongoose.Schema({
  dailyEarnCap: {
    type: Number,
    default: 100,
  },
  dailyRewardAmount: {
    type: Number,
    default: 5,
  },
  quizMaxTokens: {
    type: Number,
    default: 25,
  },
  quizDailyCount: {
    type: Number,
    default: 3,
  },
  gameMaxTokens: {
    type: Number,
    default: 25,
  },
  gameDailyCount: {
    type: Number,
    default: 5,
  },
  streakBonusEnabled: {
    type: Boolean,
    default: true,
  },
  streakMultiplier: {
    type: Number,
    default: 0.4,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

export async function getEconomyConfig() {
  const config = await mongoose.model('EconomyConfig').findOne();
  if (!config) {
    return await mongoose.model('EconomyConfig').create({});
  }
  return config;
}

export default mongoose.model('EconomyConfig', economyConfigSchema);
