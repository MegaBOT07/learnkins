import TokenTransaction from '../models/TokenTransaction.js';
import User from '../models/User.js';

// Helpers
const todayStr = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// GET /api/tokens/balance
export const getBalance = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ success: true, balance: user.tokens || 0 });
  } catch (error) {
    console.error('Error getting balance', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/tokens/transactions
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const txs = await TokenTransaction.find({ userId }).sort({ createdAt: -1 }).limit(200);
    return res.status(200).json({ success: true, transactions: txs });
  } catch (error) {
    console.error('Error getting transactions', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/tokens/award
export const awardTokens = async (req, res) => {
  try {
    const { amount, reason, meta } = req.body;
    const user = req.user;
    const n = Number(amount) || 0;
    if (n <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    // create transaction
    const tx = await TokenTransaction.create({ userId: user._id, type: 'award', amount: n, reason: reason || 'award', meta: meta || null });

    // update user tokens
    user.tokens = (user.tokens || 0) + n;
    await user.save();

    return res.status(201).json({ success: true, balance: user.tokens, transaction: tx });
  } catch (error) {
    console.error('Error awarding tokens', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/tokens/redeem
export const redeemTokens = async (req, res) => {
  try {
    const { amount, reason, meta } = req.body;
    const user = req.user;
    const n = Number(amount) || 0;
    if (n <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    if ((user.tokens || 0) < n) {
      return res.status(400).json({ success: false, message: 'Insufficient tokens' });
    }

    const tx = await TokenTransaction.create({ userId: user._id, type: 'redeem', amount: -n, reason: reason || 'redeem', meta: meta || null });

    user.tokens = (user.tokens || 0) - n;
    await user.save();

    return res.status(201).json({ success: true, balance: user.tokens, transaction: tx });
  } catch (error) {
    console.error('Error redeeming tokens', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
// POST /api/tokens/award-user/:id (Admin only)
export const awardUserTokens = async (req, res) => {
  try {
    const { amount, reason, meta } = req.body;
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const n = Number(amount) || 0;
    if (n <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    const tx = await TokenTransaction.create({ userId: targetUser._id, type: 'award', amount: n, reason: reason || 'admin_award', meta: meta || null });

    targetUser.tokens = (targetUser.tokens || 0) + n;
    await targetUser.save();

    return res.status(200).json({ success: true, balance: targetUser.tokens, transaction: tx });
  } catch (error) {
    console.error('Error in awardUserTokens', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/tokens/daily
export const claimDailyReward = async (req, res) => {
  try {
    const user = req.user;
    const today = todayStr();
    const lastClaim = user.lastDailyClaim ? new Date(user.lastDailyClaim).toISOString().slice(0, 10) : null;

    if (lastClaim === today) {
      return res.status(400).json({ success: false, message: 'Daily reward already claimed today' });
    }

    const DAILY_AMOUNT = 5;
    user.tokens = (user.tokens || 0) + DAILY_AMOUNT;
    user.lastDailyClaim = new Date();

    // Streak logic
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    if (lastClaim === yesterdayStr) {
      user.currentStreak = (user.currentStreak || 0) + 1;
    } else if (lastClaim !== today) {
      user.currentStreak = 1;
    }
    if ((user.currentStreak || 0) > (user.longestStreak || 0)) {
      user.longestStreak = user.currentStreak;
    }

    await user.save();

    await TokenTransaction.create({
      userId: user._id,
      type: 'award',
      amount: DAILY_AMOUNT,
      reason: `Daily login reward (streak: ${user.currentStreak})`,
      meta: { streak: user.currentStreak },
    });

    return res.status(200).json({
      success: true,
      balance: user.tokens,
      tokensEarned: DAILY_AMOUNT,
      streak: user.currentStreak,
    });
  } catch (error) {
    console.error('Daily reward error', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/tokens/user/:id (Admin only)
export const getUserTransactions = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const txs = await TokenTransaction.find({ userId: id }).sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ success: true, transactions: txs });
  } catch (error) {
    console.error('Error in getUserTransactions', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/tokens/admin/stats
export const getAdminTokenStats = async (req, res) => {
  try {
    // Total tokens in circulation
    const totalTokensResult = await User.aggregate([{ $group: { _id: null, total: { $sum: '$tokens' } } }]);
    const totalTokens = totalTokensResult[0]?.total || 0;

    // Total earned / total spent
    const earnedResult = await TokenTransaction.aggregate([
      { $match: { type: 'award' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const spentResult = await TokenTransaction.aggregate([
      { $match: { type: 'redeem' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Top earners
    const topEarners = await User.find().select('name email tokens level role').sort({ tokens: -1 }).limit(10);

    // Recent transactions
    const recentTx = await TokenTransaction.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'name email');

    // Per-day activity (last 7 days)
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyActivity = await TokenTransaction.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, tokens: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalTokensInCirculation: totalTokens,
        totalEarned: earnedResult[0]?.total || 0,
        totalSpent: Math.abs(spentResult[0]?.total || 0),
        topEarners,
        recentTransactions: recentTx,
        dailyActivity,
      },
    });
  } catch (error) {
    console.error('Admin token stats error', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
