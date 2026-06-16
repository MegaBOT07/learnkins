import Game from '../models/Game.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { earnTokens } from '../utils/tokenHelpers.js';
import { checkAndAwardAchievements } from '../utils/achievementChecker.js';

export const getGames = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;

    let filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const games = await Game.find(filter)
      .populate('createdBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Game.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: games.length,
      total,
      data: games
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const createGame = async (req, res) => {
  try {
    const game = await Game.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: game
    });
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Game updated successfully',
      data: game
    });
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    game.isActive = false;
    await game.save();

    res.status(200).json({
      success: true,
      message: 'Game deleted successfully'
    });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const playGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    await game.incrementPlayCount();

    res.status(200).json({
      success: true,
      message: 'Game session started',
      data: {
        gameUrl: game.gameUrl,
        instructions: game.instructions,
        duration: game.duration
      }
    });
  } catch (error) {
    console.error('Play game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const submitScore = async (req, res) => {
  try {
    const { score, timeTaken } = req.body;
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    await game.addScore(req.user.id, score, timeTaken);

    const tokensEarned = Math.min(25, 5 + Math.floor((score || 0) / 10));
    const xpEarned     = Math.min(50, 10 + Math.floor((score || 0) / 5));

    const user = await User.findById(req.user.id);
    if (user) {
      user.experience       = (user.experience || 0) + xpEarned;
      user.points           = (user.points || 0) + Math.floor(score || 0);
      user.totalGamesPlayed = (user.totalGamesPlayed || 0) + 1;

      const newLevel = Math.floor(user.experience / 100) + 1;
      if (newLevel > (user.level || 1)) user.level = newLevel;

      await user.save();

      await earnTokens(user._id, tokensEarned, {
        referenceType: 'game',
        referenceId: game._id,
        reason: `Game score: ${game.title} (${score} pts)`,
        meta: { gameId: game._id, score, timeTaken, xpEarned },
      });
    }

    await Progress.findOneAndUpdate(
      { userId: req.user.id, subject: game.category, chapter: 'games' },
      {
        $push: {
          completedActivities: { type: 'game', activityId: game._id, score },
        },
        lastAccessed: new Date(),
      },
      { upsert: true }
    );

    let newAchievements = [];
    if (user) {
      newAchievements = await checkAndAwardAchievements(user._id);
    }

    return res.status(200).json({
      success: true,
      message: 'Score submitted successfully',
      tokensEarned: tokensEarned,
      xpEarned: xpEarned,
      newLevel: user?.level,
      newAchievements
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    const leaderboard = await game.getLeaderboard();

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
