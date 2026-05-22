import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import TokenTransaction from '../models/TokenTransaction.js';
import { checkAndAwardAchievements } from '../utils/achievementChecker.js';

// Helper: award tokens + XP after a quiz; silent – never throws
async function awardQuizTokens(userId, percentage) {
  try {
    if (!userId) return 0;
    // Token scale: 25 for perfect, 15 for ≥80%, 10 for ≥60%, 5 otherwise
    const tokens = percentage >= 100 ? 25 : percentage >= 80 ? 15 : percentage >= 60 ? 10 : 5;
    const xp = Math.round(percentage * 0.5); // up to 50 XP
    const user = await User.findById(userId);
    if (!user) return 0;
    user.tokens = (user.tokens || 0) + tokens;
    user.experience = (user.experience || 0) + xp;
    user.totalQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;
    const newLevel = Math.floor(user.experience / 100) + 1;
    if (newLevel > (user.level || 1)) user.level = newLevel;
    await user.save();
    await TokenTransaction.create({
      userId,
      type: 'award',
      amount: tokens,
      reason: `Quiz completed (${Math.round(percentage)}%)`,
      meta: {
        percentage
      }
    });
    return tokens;
  } catch (e) {
    console.warn('awardQuizTokens silent error', e.message);
    return 0;
  }
}

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
export const getQuizzes = async (req, res) => {
  try {
    const {
      subject,
      grade,
      difficulty,
      page = 1,
      limit = 10
    } = req.query;
    let filter = {
      isActive: true
    };
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (difficulty) filter.difficulty = difficulty;
    const quizzes = await Quiz.find(filter).select('-questions.correctAnswer -questions.explanation').populate('createdBy', 'name').limit(limit * 1).skip((page - 1) * limit).sort({
      createdAt: -1
    });
    const total = await Quiz.countDocuments(filter);
    res.status(200).json({
      success: true,
      count: quizzes.length,
      total,
      data: quizzes
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
export const getQuiz = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    // Check if it's a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      const quiz = await Quiz.findById(id).select('-questions.correctAnswer -questions.explanation').populate('createdBy', 'name');
      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: quiz
      });
    } else {
      // For non-ObjectId (like demo quizzes), return 404
      // The frontend has fallback logic for demo quizzes
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private (Admin/Teacher)
export const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Admin/Teacher)
export const updateQuiz = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz id'
      });
    }
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Admin/Teacher)
export const deleteQuiz = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz id'
      });
    }
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    quiz.isActive = false;
    await quiz.save();
    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Submit quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      answers,
      timeTaken,
      localResult
    } = req.body;
    const userId = req.user?.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz ID'
      });
    }
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let correctCount = 0;
    const processedAnswers = [];
    if (Array.isArray(answers)) {
      answers.forEach((answer, index) => {
        const question = quiz.questions[index];
        if (!question) return;
        const isCorrect = answer === question.correctAnswer;
        if (isCorrect) correctCount++;
        processedAnswers.push({
          questionId: question.id,
          selectedAnswer: answer,
          isCorrect,
          pointsEarned: isCorrect ? question.points : 0
        });
      });
    }
    const percentage = Math.round(correctCount / quiz.questions.length * 100);
    const passed = percentage >= quiz.passingScore;
    const tokensEarned = await awardQuizTokens(userId, percentage);

    // Record attempt
    const attempt = {
      userId,
      attemptDate: new Date(),
      score: correctCount,
      percentage,
      passed,
      timeTaken: timeTaken || 0,
      answers: processedAnswers,
      certificateIssued: false
    };
    quiz.attempts.push(attempt);
    quiz.statistics.totalAttempts = (quiz.statistics.totalAttempts || 0) + 1;
    if (passed) {
      quiz.statistics.totalPassed = (quiz.statistics.totalPassed || 0) + 1;
    }
    quiz.statistics.averageScore = Math.round(((quiz.statistics.averageScore || 0) * (quiz.statistics.totalAttempts - 1) + percentage) / quiz.statistics.totalAttempts);
    await quiz.save();

    // Update user stats
    let newAchievements = [];
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.totalQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;
        if (passed && percentage === 100) {
          user.perfectScores = (user.perfectScores || 0) + 1;
        }
        await user.save();

        // Check and award achievements
        newAchievements = await checkAndAwardAchievements(userId);
      }
    }
    res.status(200).json({
      success: true,
      message: passed ? 'Quiz passed!' : 'Quiz failed. Try again!',
      result: {
        score: correctCount,
        total: quiz.questions.length,
        percentage,
        passed,
        tokensEarned,
        certificateEligible: passed
      },
      newAchievements: newAchievements
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during quiz submission'
    });
  }
};
export const getQuizResults = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz id'
      });
    }
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    const userAttempts = quiz.attempts.filter(attempt => attempt.userId.toString() === req.user.id);
    res.status(200).json({
      success: true,
      data: userAttempts
    });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get quiz statistics
// @route   GET /api/quizzes/:id/statistics
// @access  Private (Admin/Teacher)
export const getQuizStatistics = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz id'
      });
    }
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    const statistics = quiz.getStatistics();
    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Get quiz statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};