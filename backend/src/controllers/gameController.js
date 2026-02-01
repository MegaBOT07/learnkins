import Game from '../models/Game.js';
import Progress from '../models/Progress.js';

// @desc    Get all games
// @route   GET /api/games
// @access  Public
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

// @desc    Get single game
// @route   GET /api/games/:id
// @access  Public
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

// @desc    Create game
// @route   POST /api/games
// @access  Private (Admin/Teacher)
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

// @desc    Update game
// @route   PUT /api/games/:id
// @access  Private (Admin/Teacher)
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

// @desc    Delete game
// @route   DELETE /api/games/:id
// @access  Private (Admin/Teacher)
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

// @desc    Play game
// @route   POST /api/games/:id/play
// @access  Private
export const playGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Increment play count
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

// @desc    Submit game score
// @route   POST /api/games/:id/score
// @access  Private
export const submitScore = async (req, res) => {
  try {
    const { score, timeTaken } = req.body;
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Add score to game
    await game.addScore(req.user.id, score, timeTaken);

    // Update progress
    await Progress.findOneAndUpdate(
      { userId: req.user.id, subject: game.category },
      {
        $push: {
          completedActivities: {
            type: 'game',
            activityId: game._id,
            score
          }
        },
        lastAccessed: new Date()
      },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Score submitted successfully',
      data: { score, timeTaken }
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get game leaderboard
// @route   GET /api/games/:id/leaderboard
// @access  Public
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