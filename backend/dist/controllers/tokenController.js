import TokenAccount from '../models/TokenAccount.js';
import TokenLedgerEntry from '../models/TokenLedgerEntry.js';
import User from '../models/User.js';
import { getBalance as getBalanceHelper, getDailyStatus, getTransactions as getTransactionsHelper, spendTokens, earnTokens, claimDailyReward as claimDailyHelper, getAdminTokenStats } from '../utils/tokenHelpers.js';
export const getBalance = async (req, res) => {
  try {
    const balance = await getBalanceHelper(req.user._id);
    return res.status(200).json({
      success: true,
      balance
    });
  } catch (error) {
    console.error('Error getting balance', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const getTransactions = async (req, res) => {
  try {
    const txs = await getTransactionsHelper(req.user._id);
    return res.status(200).json({
      success: true,
      transactions: txs
    });
  } catch (error) {
    console.error('Error getting transactions', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const awardTokens = async (req, res) => {
  try {
    const {
      amount,
      reason,
      meta
    } = req.body;
    const n = Number(amount) || 0;
    if (n <= 0) return res.status(400).json({
      success: false,
      message: 'Invalid amount'
    });
    const result = await earnTokens(req.user._id, n, {
      referenceType: 'admin',
      referenceId: req.user._id,
      reason: reason || 'Admin award',
      meta: meta || null
    });
    return res.status(201).json({
      success: true,
      balance: result.balance,
      transaction: result.transaction
    });
  } catch (error) {
    if (error.message === 'Daily earn cap reached') {
      return res.status(400).json({
        success: false,
        message: 'Daily earn cap reached'
      });
    }
    console.error('Error awarding tokens', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const redeemTokens = async (req, res) => {
  try {
    const {
      amount,
      reason,
      meta
    } = req.body;
    const n = Number(amount) || 0;
    if (n <= 0) return res.status(400).json({
      success: false,
      message: 'Invalid amount'
    });
    const result = await spendTokens(req.user._id, n, {
      referenceType: 'spend',
      reason: reason || 'Token redeem',
      meta: meta || null
    });
    return res.status(201).json({
      success: true,
      balance: result.balance,
      transaction: result.transaction
    });
  } catch (error) {
    if (error.message === 'Insufficient tokens') {
      return res.status(400).json({
        success: false,
        message: 'Insufficient tokens'
      });
    }
    console.error('Error redeeming tokens', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const awardUserTokens = async (req, res) => {
  try {
    const {
      amount,
      reason,
      meta
    } = req.body;
    const {
      id
    } = req.params;
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const n = Number(amount) || 0;
    if (n <= 0) return res.status(400).json({
      success: false,
      message: 'Invalid amount'
    });
    const result = await earnTokens(targetUser._id, n, {
      referenceType: 'admin',
      referenceId: `${req.user._id}-${Date.now()}`,
      reason: reason || 'Admin award',
      meta: {
        awardedBy: req.user._id,
        ...(meta || {})
      },
      skipDailyCap: true
    });
    return res.status(200).json({
      success: true,
      balance: result.balance,
      transaction: result.transaction
    });
  } catch (error) {
    if (error.message === 'Daily earn cap reached') {
      return res.status(400).json({
        success: false,
        message: 'Daily earn cap reached for target user'
      });
    }
    console.error('Error in awardUserTokens', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const claimDailyReward = async (req, res) => {
  try {
    const result = await claimDailyHelper(req.user._id);
    return res.status(200).json({
      success: true,
      balance: result.balance,
      tokensEarned: result.tokensEarned,
      streak: result.streak,
      longestStreak: result.longestStreak,
      newAchievements: result.newAchievements || []
    });
  } catch (error) {
    if (error.message === 'Daily reward already claimed today') {
      return res.status(400).json({
        success: false,
        message: 'Daily reward already claimed today'
      });
    }
    console.error('Daily reward error', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const getDailyStatusEndpoint = async (req, res) => {
  try {
    const status = await getDailyStatus(req.user._id);
    return res.status(200).json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error getting daily status', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const getUserTransactions = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const txs = await getTransactionsHelper(id, 100);
    return res.status(200).json({
      success: true,
      transactions: txs
    });
  } catch (error) {
    console.error('Error in getUserTransactions', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const getAdminTokenStatsEndpoint = async (req, res) => {
  try {
    const data = await getAdminTokenStats();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Admin token stats error', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const getEconomyConfig = async (req, res) => {
  try {
    const {
      getEconomyConfig: getConfig
    } = await import('../models/EconomyConfig.js');
    const config = await getConfig();
    return res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error getting economy config', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const updateEconomyConfig = async (req, res) => {
  try {
    const EconomyConfig = (await import('../models/EconomyConfig.js')).default;
    const {
      getEconomyConfig: getConfig
    } = await import('../models/EconomyConfig.js');
    const config = await getConfig();
    const allowedFields = ['dailyEarnCap', 'dailyRewardAmount', 'quizMaxTokens', 'quizDailyCount', 'gameMaxTokens', 'gameDailyCount', 'streakBonusEnabled', 'streakMultiplier'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        config[field] = req.body[field];
      }
    }
    config.updatedBy = req.user._id;
    await config.save();
    return res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error updating economy config', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};