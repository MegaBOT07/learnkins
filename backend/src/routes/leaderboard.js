import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get unified leaderboard (top 100 + user rank)
// @route   GET /api/leaderboard
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { filter = 'all', subject, game } = req.query;

    // Build match stage — only students with points
    const matchStage = { role: 'student', points: { $gt: 0 } };

    // Get top 100 users by points
    let topUsers = await User.find(matchStage)
      .select('name avatar points experience level totalQuizzesTaken totalGamesPlayed perfectScores currentStreak')
      .sort({ points: -1 })
      .limit(100)
      .lean();

    // Assign ranks
    const leaderboard = topUsers.map((u, i) => ({
      rank: i + 1,
      userId: u._id,
      name: u.name,
      avatar: u.avatar || '',
      points: u.points || 0,
      experience: u.experience || 0,
      level: u.level || 1,
      totalQuizzesTaken: u.totalQuizzesTaken || 0,
      totalGamesPlayed: u.totalGamesPlayed || 0,
      perfectScores: u.perfectScores || 0,
      currentStreak: u.currentStreak || 0,
      isCurrentUser: u._id.toString() === userId,
    }));

    // Check if current user is in top 100
    const userInTop100 = leaderboard.find(e => e.isCurrentUser);

    let userRank = null;
    if (!userInTop100 && userId) {
      const currentUser = await User.findById(userId)
        .select('name avatar points experience level totalQuizzesTaken totalGamesPlayed perfectScores currentStreak')
        .lean();

      if (currentUser) {
        // Count users with more points
        const rank = await User.countDocuments({
          role: 'student',
          points: { $gt: currentUser.points || 0 },
        });

        userRank = {
          rank: rank + 1,
          userId: currentUser._id,
          name: currentUser.name,
          avatar: currentUser.avatar || '',
          points: currentUser.points || 0,
          experience: currentUser.experience || 0,
          level: currentUser.level || 1,
          totalQuizzesTaken: currentUser.totalQuizzesTaken || 0,
          totalGamesPlayed: currentUser.totalGamesPlayed || 0,
          perfectScores: currentUser.perfectScores || 0,
          currentStreak: currentUser.currentStreak || 0,
          isCurrentUser: true,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        userRank,
      },
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard',
    });
  }
});

export default router;
