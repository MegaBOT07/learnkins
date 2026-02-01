import TokenTransaction from '../models/TokenTransaction.js';
import User from '../models/User.js';

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
