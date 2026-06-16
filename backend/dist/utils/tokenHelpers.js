import TokenAccount from '../models/TokenAccount.js';
import TokenLedgerEntry from '../models/TokenLedgerEntry.js';
const DAILY_EARN_CAP = 1000;
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
async function ensureAccount(userId) {
  let account = await TokenAccount.findOne({
    userId
  });
  if (!account) {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);
    account = await TokenAccount.create({
      userId,
      balance: user?.tokens || 0,
      lifetimeEarned: 0,
      lifetimeSpent: 0
    });
  }
  return account;
}
export async function getBalance(userId) {
  const account = await ensureAccount(userId);
  return account.balance;
}
export async function getDailyStatus(userId) {
  const account = await ensureAccount(userId);
  const today = todayStr();
  const lastClaim = account.lastDailyClaim ? new Date(account.lastDailyClaim).toISOString().slice(0, 10) : null;
  return {
    canClaim: lastClaim !== today,
    streak: account.currentStreak,
    longestStreak: account.longestStreak
  };
}
export async function getTransactions(userId, limit = 200) {
  return TokenLedgerEntry.find({
    userId
  }).sort({
    createdAt: -1
  }).limit(limit);
}
export async function spendTokens(userId, amount, {
  referenceType,
  referenceId,
  reason,
  description,
  meta
} = {}) {
  if (!userId || amount <= 0) {
    throw new Error('Invalid parameters');
  }
  const idempotencyKey = `${referenceType || 'spend'}:${userId}:${referenceId || Date.now()}`;
  const existing = await TokenLedgerEntry.findOne({
    idempotencyKey
  });
  if (existing) {
    const account = await ensureAccount(userId);
    return {
      idempotent: true,
      balance: account.balance,
      transaction: existing
    };
  }
  const result = await TokenAccount.findOneAndUpdate({
    userId,
    balance: {
      $gte: amount
    },
    isFrozen: {
      $ne: true
    }
  }, {
    $inc: {
      balance: -amount,
      lifetimeSpent: amount
    }
  }, {
    new: true
  });
  if (!result) {
    const account = await ensureAccount(userId);
    if (account.isFrozen) throw new Error('Account frozen');
    throw new Error('Insufficient tokens');
  }
  const ledgerEntry = await TokenLedgerEntry.create({
    userId,
    type: 'spend',
    amount,
    balanceBefore: result.balance + amount,
    balanceAfter: result.balance,
    referenceType: referenceType || null,
    referenceId: referenceId || null,
    idempotencyKey,
    reason: reason || 'Token spend',
    description: description || null,
    meta: meta || null
  });
  return {
    balance: result.balance,
    transaction: ledgerEntry
  };
}
export async function earnTokens(userId, amount, {
  referenceType,
  referenceId,
  reason,
  description,
  meta,
  skipDailyCap
} = {}) {
  if (!userId || amount <= 0) {
    throw new Error('Invalid parameters');
  }
  const idempotencyKey = `${referenceType || 'earn'}:${userId}:${referenceId || Date.now()}`;
  const existing = await TokenLedgerEntry.findOne({
    idempotencyKey
  });
  if (existing) {
    const account = await ensureAccount(userId);
    return {
      idempotent: true,
      balance: account.balance,
      transaction: existing
    };
  }
  const today = todayStr();
  let result;
  if (skipDailyCap) {
    await ensureAccount(userId);
    result = await TokenAccount.findOneAndUpdate({
      userId,
      isFrozen: {
        $ne: true
      }
    }, {
      $inc: {
        balance: amount,
        lifetimeEarned: amount
      }
    }, {
      new: true
    });
  } else {
    result = await TokenAccount.findOneAndUpdate({
      userId,
      isFrozen: {
        $ne: true
      },
      $expr: {
        $lt: [{
          $cond: [{
            $eq: ['$dailyEarnedDate', today]
          }, '$dailyEarnedToday', 0]
        }, DAILY_EARN_CAP - amount + 1]
      }
    }, [{
      $set: {
        balance: {
          $add: ['$balance', amount]
        },
        lifetimeEarned: {
          $add: ['$lifetimeEarned', amount]
        },
        dailyEarnedDate: today,
        dailyEarnedToday: {
          $cond: [{
            $eq: ['$dailyEarnedDate', today]
          }, {
            $add: ['$dailyEarnedToday', amount]
          }, amount]
        }
      }
    }], {
      new: true
    });
  }
  if (!result) {
    const account = await ensureAccount(userId);
    if (account.isFrozen) throw new Error('Account frozen');
    if (skipDailyCap) throw new Error('Account not found');
    throw new Error('Daily earn cap reached');
  }
  const ledgerEntry = await TokenLedgerEntry.create({
    userId,
    type: 'earn',
    amount,
    balanceBefore: result.balance - amount,
    balanceAfter: result.balance,
    referenceType: referenceType || null,
    referenceId: referenceId || null,
    idempotencyKey,
    reason: reason || 'Token earned',
    description: description || null,
    meta: meta || null
  });
  return {
    balance: result.balance,
    transaction: ledgerEntry
  };
}
export async function claimDailyReward(userId) {
  if (!userId) throw new Error('Invalid user');
  const idempotencyKey = `daily:${userId}:${todayStr()}`;
  const existing = await TokenLedgerEntry.findOne({
    idempotencyKey
  });
  if (existing) {
    const account = await ensureAccount(userId);
    return {
      idempotent: true,
      balance: account.balance,
      streak: account.currentStreak,
      tokensEarned: 0
    };
  }
  const DAILY_AMOUNT = 5;
  const today = todayStr();
  const result = await TokenAccount.findOneAndUpdate({
    userId,
    isFrozen: {
      $ne: true
    },
    $expr: {
      $ne: [{
        $ifNull: [{
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$lastDailyClaim'
          }
        }, '']
      }, today]
    }
  }, {
    $inc: {
      balance: DAILY_AMOUNT,
      lifetimeEarned: DAILY_AMOUNT
    },
    $set: {
      lastDailyClaim: new Date()
    }
  }, {
    new: true
  });
  if (!result) {
    throw new Error('Daily reward already claimed today');
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  const prevClaim = result.lastDailyClaim ? new Date(result.lastDailyClaim).toISOString().slice(0, 10) : null;
  if (prevClaim === yesterdayStr) {
    result.currentStreak = (result.currentStreak || 0) + 1;
  } else {
    result.currentStreak = 1;
  }
  if ((result.currentStreak || 0) > (result.longestStreak || 0)) {
    result.longestStreak = result.currentStreak;
  }
  let totalEarned = DAILY_AMOUNT;
  let bonusTokens = 0;
  if (result.currentStreak >= 7) {
    const config = await (await import('../models/EconomyConfig.js')).getEconomyConfig();
    if (config.streakBonusEnabled) {
      bonusTokens = Math.floor(DAILY_AMOUNT * config.streakMultiplier);
      if (bonusTokens > 0) {
        result.balance += bonusTokens;
        result.lifetimeEarned += bonusTokens;
        totalEarned += bonusTokens;
        await TokenLedgerEntry.create({
          userId,
          type: 'earn',
          amount: bonusTokens,
          balanceBefore: result.balance - bonusTokens,
          balanceAfter: result.balance,
          referenceType: 'daily',
          idempotencyKey: `daily:bonus:${userId}:${todayStr()}`,
          reason: `Streak bonus (${result.currentStreak} day streak)`
        });
      }
    }
  }
  await result.save();
  const ledgerEntry = await TokenLedgerEntry.create({
    userId,
    type: 'earn',
    amount: DAILY_AMOUNT,
    balanceBefore: result.balance - totalEarned,
    balanceAfter: result.balance,
    referenceType: 'daily',
    idempotencyKey,
    reason: `Daily login reward (streak: ${result.currentStreak})`,
    meta: {
      streak: result.currentStreak,
      bonus: bonusTokens
    }
  });
  const newAchievements = [];
  try {
    const {
      checkAndAwardAchievements
    } = await import('../utils/achievementChecker.js');
    const achievements = await checkAndAwardAchievements(userId);
    if (achievements && achievements.length > 0) {
      newAchievements.push(...achievements);
    }
  } catch (e) {
    console.warn('Achievement check failed:', e.message);
  }
  return {
    balance: result.balance,
    tokensEarned: totalEarned,
    streak: result.currentStreak,
    longestStreak: result.longestStreak,
    transaction: ledgerEntry,
    newAchievements
  };
}
export async function refundTokens(userId, amount, originalReferenceType, originalReferenceId, reason) {
  if (!userId || amount <= 0) throw new Error('Invalid parameters');
  const idempotencyKey = `refund:${originalReferenceType}:${originalReferenceId}`;
  const existing = await TokenLedgerEntry.findOne({
    idempotencyKey
  });
  if (existing) {
    const account = await ensureAccount(userId);
    return {
      idempotent: true,
      balance: account.balance
    };
  }
  const result = await TokenAccount.findOneAndUpdate({
    userId,
    isFrozen: {
      $ne: true
    }
  }, {
    $inc: {
      balance: amount,
      lifetimeEarned: amount
    }
  }, {
    new: true
  });
  if (!result) throw new Error('Account not found');
  const ledgerEntry = await TokenLedgerEntry.create({
    userId,
    type: 'refund',
    amount,
    balanceBefore: result.balance - amount,
    balanceAfter: result.balance,
    referenceType: originalReferenceType || null,
    referenceId: originalReferenceId || null,
    idempotencyKey,
    reason: reason || 'Token refund'
  });
  return {
    balance: result.balance,
    transaction: ledgerEntry
  };
}
export async function getAdminTokenStats() {
  const totalTokensResult = await TokenAccount.aggregate([{
    $group: {
      _id: null,
      total: {
        $sum: '$balance'
      }
    }
  }]);
  const totalTokens = totalTokensResult[0]?.total || 0;
  const earnedResult = await TokenLedgerEntry.aggregate([{
    $match: {
      type: 'earn'
    }
  }, {
    $group: {
      _id: null,
      total: {
        $sum: '$amount'
      }
    }
  }]);
  const spentResult = await TokenLedgerEntry.aggregate([{
    $match: {
      type: 'spend'
    }
  }, {
    $group: {
      _id: null,
      total: {
        $sum: '$amount'
      }
    }
  }]);
  const User = (await import('../models/User.js')).default;
  const topEarners = await TokenAccount.find().sort({
    lifetimeEarned: -1
  }).limit(10).populate('userId', 'name email');
  const topBalances = await TokenAccount.find().sort({
    balance: -1
  }).limit(10).populate('userId', 'name email');
  const recentTx = await TokenLedgerEntry.find().sort({
    createdAt: -1
  }).limit(20).populate('userId', 'name email');
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dailyActivity = await TokenLedgerEntry.aggregate([{
    $match: {
      createdAt: {
        $gte: sevenDaysAgo
      }
    }
  }, {
    $group: {
      _id: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$createdAt'
        }
      },
      count: {
        $sum: 1
      },
      tokens: {
        $sum: {
          $cond: [{
            $eq: ['$type', 'spend']
          }, {
            $multiply: ['$amount', -1]
          }, '$amount']
        }
      }
    }
  }, {
    $sort: {
      _id: 1
    }
  }]);
  const totalAccounts = await TokenAccount.countDocuments();
  return {
    totalTokensInCirculation: totalTokens,
    totalEarnedAllTime: earnedResult[0]?.total || 0,
    totalEarned: earnedResult[0]?.total || 0,
    totalSpentAllTime: spentResult[0]?.total || 0,
    totalSpent: spentResult[0]?.total || 0,
    totalAccounts,
    topEarners: topEarners.map(a => ({
      _id: a.userId?._id || a.userId,
      name: a.userId?.name || 'Unknown',
      email: a.userId?.email || '',
      lifetimeEarned: a.lifetimeEarned,
      balance: a.balance
    })),
    topBalances: topBalances.map(a => ({
      _id: a.userId?._id || a.userId,
      name: a.userId?.name || 'Unknown',
      email: a.userId?.email || '',
      balance: a.balance
    })),
    recentTransactions: recentTx,
    dailyActivity: dailyActivity.map(d => ({
      ...d,
      amount: d.tokens
    }))
  };
}