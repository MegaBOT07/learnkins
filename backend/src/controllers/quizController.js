import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import TokenTransaction from '../models/TokenTransaction.js';

// Helper: award tokens + XP after a quiz; silent – never throws
async function awardQuizTokens(userId, percentage) {
  try {
    if (!userId) return 0;
    // Token scale: 25 for perfect, 15 for ≥80%, 10 for ≥60%, 5 otherwise
    const tokens = percentage >= 100 ? 25 : percentage >= 80 ? 15 : percentage >= 60 ? 10 : 5;
    const xp     = Math.round(percentage * 0.5); // up to 50 XP
    const user   = await User.findById(userId);
    if (!user) return 0;
    user.tokens             = (user.tokens || 0) + tokens;
    user.experience         = (user.experience || 0) + xp;
    user.totalQuizzesTaken  = (user.totalQuizzesTaken || 0) + 1;
    const newLevel = Math.floor(user.experience / 100) + 1;
    if (newLevel > (user.level || 1)) user.level = newLevel;
    await user.save();
    await TokenTransaction.create({
      userId,
      type:   'award',
      amount: tokens,
      reason: `Quiz completed (${Math.round(percentage)}%)`,
      meta:   { percentage },
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
    const { subject, grade, difficulty, page = 1, limit = 10 } = req.query;

    let filter = { isActive: true };
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter)
      .select('-questions.correctAnswer -questions.explanation')
      .populate('createdBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

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
    const { id } = req.params;

    // Check if it's a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      const quiz = await Quiz.findById(id)
        .select('-questions.correctAnswer -questions.explanation')
        .populate('createdBy', 'name');

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
      return res.status(400).json({ success: false, message: 'Invalid quiz id' });
    }

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

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
      return res.status(400).json({ success: false, message: 'Invalid quiz id' });
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
    const { answers, timeTaken, quizData } = req.body;
    const { id } = req.params;

    // Check if it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // For demo quizzes, calculate score from provided quiz data
      if (quizData && quizData.questions) {
        let score = 0;
        let correctCount = 0;
        const results = [];

        quizData.questions.forEach((question, index) => {
          const userAnswer = answers[index];
          const isCorrect = userAnswer === question.correctAnswer;

          if (isCorrect) {
            score += 10; // Default points per question
            correctCount++;
          }

          results.push({
            questionId: question.id,
            answer: userAnswer,
            isCorrect
          });
        });

        const percentage = (correctCount / quizData.questions.length) * 100;

        // Try to save to Progress if user is authenticated
        try {
          if (req.user && req.user.id) {
            const progressData = {
              userId: req.user.id,
              subject: quizData.subject || 'general',
              chapter: quizData.id,
              score: percentage,
              timeSpent: timeTaken || 0,
              completedActivities: [{
                type: 'quiz',
                activityId: id,
                score: percentage
              }]
            };

            // Find or create progress record
            await Progress.findOneAndUpdate(
              { userId: req.user.id, subject: quizData.subject || 'general' },
              {
                $push: {
                  completedActivities: {
                    type: 'quiz',
                    activityId: id,
                    score: percentage,
                    timestamp: new Date()
                  }
                },
                $inc: { timeSpent: timeTaken || 0 },
                lastAccessed: new Date()
              },
              { upsert: true, new: true }
            );
          }
        } catch (progressErr) {
          console.warn('Failed to save demo quiz to progress:', progressErr);
          // Continue even if progress save fails
        }

        const tokensEarned = await awardQuizTokens(req.user?.id, percentage);
        return res.status(200).json({
          success: true,
          message: 'Demo quiz submitted successfully',
          data: {
            score: percentage,
            correctCount,
            totalQuestions: quizData.questions.length,
            percentage,
            results,
            demoQuiz: true,
            tokensEarned,
          }
        });
      }

      // If quizData not provided, but frontend sent precalculated local result, use it
      const { localResult } = req.body || {};
      if (localResult && typeof localResult.percentage === 'number') {
        const percentage = localResult.percentage;
        const correctCount = localResult.correctCount || 0;
        // Save to Progress if possible
        try {
          if (req.user && req.user.id) {
            await Progress.findOneAndUpdate(
              { userId: req.user.id, subject: req.body.subject || 'general' },
              {
                $push: {
                  completedActivities: {
                    type: 'quiz',
                    activityId: id,
                    score: percentage,
                    timestamp: new Date()
                  }
                },
                $inc: { timeSpent: timeTaken || 0 },
                lastAccessed: new Date()
              },
              { upsert: true, new: true }
            );
          }
        } catch (err) {
          console.warn('Failed to save local result to progress:', err);
        }

        const tokensEarned = await awardQuizTokens(req.user?.id, percentage);
        return res.status(200).json({
          success: true,
          message: 'Demo quiz submitted (local result)',
          data: {
            percentage,
            correctCount,
            totalQuestions: req.body.totalQuestions || null,
            demoQuiz: true,
            tokensEarned,
          }
        });
      }

      // If no quiz data provided, return error
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz submission'
      });
    }

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    let score = 0;
    const results = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = question.type === 'multiple-choice'
        ? question.options.find(opt => opt.isCorrect)?.text === userAnswer
        : question.correctAnswer === userAnswer;

      if (isCorrect) {
        score += question.points;
      }

      results.push({
        questionId: question._id,
        answer: userAnswer,
        isCorrect,
        explanation: question.explanation
      });
    });

    // Save attempt
    quiz.attempts.push({
      userId: req.user.id,
      score,
      totalQuestions: quiz.questions.length,
      timeTaken,
      answers: results
    });

    await quiz.save();

    // Update progress
    await Progress.findOneAndUpdate(
      { userId: req.user.id, subject: quiz.subject, chapter: quiz.chapter },
      {
        $push: {
          completedActivities: {
            type: 'quiz',
            activityId: quiz._id,
            score: (score / quiz.totalPoints) * 100
          }
        },
        lastAccessed: new Date()
      },
      { upsert: true }
    );

    // Award XP for regular quiz
    const user = await User.findById(req.user.id);
    let levelUpData = null;
    if (user) {
      const xpToAward = results.filter(r => r.isCorrect).length * 10;
      levelUpData = user.addExperience(xpToAward);
      await user.save();
    }

    const pct = Math.round((score / quiz.totalPoints) * 100);
    const tokensEarned = await awardQuizTokens(req.user?.id, pct);

    res.status(200).json({
      success: true,
      data: {
        score,
        totalPoints: quiz.totalPoints,
        percentage: pct,
        results,
        levelUp: levelUpData,
        tokensEarned,
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get quiz results
// @route   GET /api/quizzes/:id/results
// @access  Private
export const getQuizResults = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid quiz id' });
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const userAttempts = quiz.attempts.filter(
      attempt => attempt.userId.toString() === req.user.id
    );

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
      return res.status(400).json({ success: false, message: 'Invalid quiz id' });
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