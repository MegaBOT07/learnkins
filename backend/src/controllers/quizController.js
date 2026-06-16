import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { earnTokens } from '../utils/tokenHelpers.js';
import { checkAndAwardAchievements } from '../utils/achievementChecker.js';

async function awardQuizTokens(userId, quizId, percentage) {
  try {
    if (!userId) return 0;
    const tokens = percentage >= 100 ? 25 : percentage >= 80 ? 15 : percentage >= 60 ? 10 : 5;
    const xp     = Math.round(percentage * 0.5);
    const user   = await User.findById(userId);
    if (!user) return 0;
    user.experience         = (user.experience || 0) + xp;
    user.totalQuizzesTaken  = (user.totalQuizzesTaken || 0) + 1;
    const newLevel = Math.floor(user.experience / 100) + 1;
    if (newLevel > (user.level || 1)) user.level = newLevel;
    await user.save();

    await earnTokens(userId, tokens, {
      referenceType: 'quiz',
      referenceId: quizId,
      reason: `Quiz completed (${Math.round(percentage)}%)`,
      meta: { percentage, xpEarned: xp },
    });

    return tokens;
  } catch (e) {
    console.warn('awardQuizTokens silent error', e.message);
    return 0;
  }
}

export const getQuizzes = async (req, res) => {
  try {
    const { subject, grade, difficulty, page = 1, limit = 10 } = req.query;

    let filter = { isActive: true };
    if (subject && subject !== 'all') filter.subject = subject;
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

export const getQuiz = async (req, res) => {
  try {
    const { id } = req.params;

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

export const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeTaken, localResult } = req.body;
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

    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = percentage >= quiz.passingScore;
    const tokensEarned = await awardQuizTokens(userId, quiz._id, percentage);

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
    quiz.statistics.averageScore = Math.round(
      ((quiz.statistics.averageScore || 0) * (quiz.statistics.totalAttempts - 1) + percentage) / quiz.statistics.totalAttempts
    );
    await quiz.save();

    let newAchievements = [];
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.totalQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;
        if (passed && percentage === 100) {
          user.perfectScores = (user.perfectScores || 0) + 1;
        }
        await user.save();

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
