import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import TokenTransaction from '../models/TokenTransaction.js';
import jwt from 'jsonwebtoken';
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

// @desc    Homepage quizzes
// @route   GET /api/quizzes/homepageQuizCards
// @access  Public
export const getHomepageQuizCards = async (req, res) => {
  try {
    const userInfo = req.headers["x-user-info"];
    let grade = null;
    let userId = null;
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      grade = parsedUser.grade;
      userId = parsedUser._id;
    }
    const baseFilter = {
      isActive: true,
      ...(grade && {
        grade
      })
    };
    const subjectFilter = {
      isActive: true,
      ...(grade && {
        grade
      })
    };
    const formatQuizCard = quiz => {
      const userAttempt = userId && quiz.attempts?.length ? quiz.attempts.find(a => a.userId?.toString() === userId.toString()) || null : null;
      return {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        chapter: quiz.chapter,
        grade: quiz.grade,
        timeLimit: quiz.timeLimit,
        difficulty: quiz.difficulty,
        questionCount: quiz.questions?.length || 0,
        participants: quiz.participants,
        userAttempt: !!userAttempt
      };
    };

    // Latest 4 quizzes for "All"
    const allPromise = Quiz.find(baseFilter).select("title description subject chapter grade timeLimit participants difficulty questions attempts.userId").sort({
      createdAt: -1
    }).limit(4);
    let subjects = [];
    if (grade) {
      subjects = await Subject.find(subjectFilter).select("slug");
    } else {
      subjects = [{
        slug: "mathematics"
      }, {
        slug: "science"
      }, {
        slug: "social-science"
      }, {
        slug: "english"
      }];
    }
    const subjectPromises = subjects.map(async subject => {
      const quizzes = await Quiz.find({
        ...baseFilter,
        subject: subject.slug
      }).select("title description subject chapter grade timeLimit participants difficulty questions attempts.userId").sort({
        createdAt: -1
      }).limit(4);
      return {
        subject: subject.slug,
        quizzes: quizzes.map(formatQuizCard)
      };
    });
    const [allQuizzes, ...categories] = await Promise.all([allPromise, ...subjectPromises]);
    const filteredCategories = categories.filter(category => category.quizzes.length > 0);
    res.status(200).json({
      success: true,
      data: {
        all: allQuizzes.map(formatQuizCard),
        filteredCategories
      }
    });
  } catch (error) {
    console.error("Homepage quizzes error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// @desc    Get all Subjects
// @route   GET /api/subjects
// @access  Public
export const getSubjects = async (req, res) => {
  try {
    const {
      grade,
      slug,
      isActive
    } = req.query;
    let filter = {};
    if (grade) filter.grade = grade;
    if (slug) filter.slug = slug;
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }
    const subjects = await Subject.find(filter).sort({
      createdAt: -1
    });
    res.status(200).json({
      success: true,
      data: subjects
    });
  } catch (error) {
    console.error("Get subjects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Get all quizzes 
// @route   GET /api/quizzes
// @access  Public
export const getQuizzes = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const {
      subject,
      grade,
      difficulty,
      page = 1,
      limit = 10
    } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    let filter = {
      isActive: true
    };
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (difficulty) filter.difficulty = difficulty;
    const quizzes = await Quiz.find(filter).select('-questions.correctAnswer -questions.explanation').populate('createdBy', 'name').limit(limitNumber).skip((pageNumber - 1) * limitNumber).sort({
      createdAt: -1
    });
    const quizzesWithAttempt = quizzes.map(quiz => {
      const userAttempt = quiz.attempts?.find(attempt => attempt.userId?.toString() === user_id?.toString()) || null;
      return {
        ...quiz.toObject(),
        userAttempt
      };
    });
    const total = await Quiz.countDocuments(filter);
    res.status(200).json({
      success: true,
      count: quizzesWithAttempt.length,
      total,
      data: quizzesWithAttempt
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
      const quiz = await Quiz.findById(id).select('-questions.correctAnswer -questions.explanation -questions.options.isCorrect').populate('createdBy', 'name');
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
    const allowedFields = ['title', 'description', 'subject', 'chapter', 'grade', 'timeLimit', 'difficulty', 'isActive'];
    if (req.body.questions) {
      return res.status(400).json({
        success: false,
        message: 'Questions cannot be updated through this endpoint. Use the quiz creation flow instead.'
      });
    }
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, updates, {
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
      timeTaken
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
    const existingAttempt = quiz.attempts.find(attempt => attempt.userId?.toString() === userId?.toString());
    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: "You have already attempted this quiz"
      });
    }
    // Calculate score
    let correctCount = 0;
    const processedAnswers = [];
    if (Array.isArray(answers)) {
      answers.forEach((item, index) => {
        const question = quiz.questions.find(q => q._id && q._id.toString() === item.questionId) || quiz.questions[index];
        if (!question) return;
        let isCorrect = false;

        // Multiple Choice & True/False
        if (question.type === "multiple-choice" || question.type === "true-false") {
          const correctOption = question.options.find(option => option.isCorrect);
          isCorrect = correctOption?.text?.trim().toLowerCase() === item.answer?.trim().toLowerCase();
        }

        // Short Answer
        else if (question.type === "short-answer") {
          isCorrect = question.correctAnswer?.trim().toLowerCase() === item.answer?.trim().toLowerCase();
        }
        if (isCorrect) {
          correctCount++;
        }
        processedAnswers.push({
          questionId: question._id || `q${index}`,
          answer: item.answer,
          isCorrect
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
    if (!quiz.statistics) quiz.statistics = {
      totalAttempts: 0,
      totalPassed: 0,
      averageScore: 0
    };
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
        if (passed && percentage === 100) {
          user.perfectScores = (user.perfectScores || 0) + 1;
        }
        // Award points: 10 per correct answer + 20 bonus for pass + 50 bonus for perfect
        const quizPoints = correctCount * 10 + (passed ? 20 : 0) + (percentage === 100 ? 50 : 0);
        user.points = (user.points || 0) + quizPoints;
        await user.save();

        // Check and award achievements
        newAchievements = await checkAndAwardAchievements(userId);
      }
    }
    res.status(200).json({
      success: true,
      message: passed ? 'Quiz passed!' : 'Quiz failed. Try again!',
      data: {
        correctCount,
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

// @desc    Get quiz leaderboard (top 100 + user rank)
// @route   GET /api/quizzes/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
  try {
    const {
      subject
    } = req.query;
    const userId = req.user?._id;
    const matchStage = {
      'attempts.0': {
        $exists: true
      }
    };
    if (subject && subject !== 'all') {
      matchStage.subject = subject;
    }
    const calcPoints = {
      $round: [{
        $multiply: [{
          $divide: [{
            $ifNull: ['$totalPoints', 0]
          }, 100]
        }, '$attempts.percentage']
      }, 0]
    };
    const results = await Quiz.aggregate([{
      $match: matchStage
    }, {
      $unwind: '$attempts'
    }, {
      $addFields: {
        pointsEarned: calcPoints
      }
    }, {
      $group: {
        _id: '$attempts.userId',
        totalPoints: {
          $sum: '$pointsEarned'
        },
        totalAttempts: {
          $sum: 1
        },
        lastAttempt: {
          $max: '$attempts.attemptDate'
        }
      }
    }, {
      $sort: {
        totalPoints: -1
      }
    }, {
      $limit: 100
    }, {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    }, {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true
      }
    }, {
      $project: {
        _id: 0,
        userId: '$_id',
        name: {
          $ifNull: ['$user.name', 'Unknown']
        },
        totalPoints: 1,
        totalAttempts: 1,
        lastAttempt: 1
      }
    }]);
    const entries = results.map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));
    let userRank = null;
    if (userId) {
      const userInTop = entries.find(e => e.userId?.toString() === userId.toString());
      if (userInTop) {
        userRank = {
          rank: userInTop.rank,
          totalPoints: userInTop.totalPoints,
          totalAttempts: userInTop.totalAttempts
        };
      } else {
        const [userData] = await Quiz.aggregate([{
          $match: matchStage
        }, {
          $unwind: '$attempts'
        }, {
          $match: {
            'attempts.userId': userId
          }
        }, {
          $addFields: {
            pointsEarned: calcPoints
          }
        }, {
          $group: {
            _id: '$attempts.userId',
            totalPoints: {
              $sum: '$pointsEarned'
            },
            totalAttempts: {
              $sum: 1
            }
          }
        }]);
        if (userData) {
          const [{
            count
          }] = await Quiz.aggregate([{
            $match: matchStage
          }, {
            $unwind: '$attempts'
          }, {
            $addFields: {
              pointsEarned: calcPoints
            }
          }, {
            $group: {
              _id: '$attempts.userId',
              totalPoints: {
                $sum: '$pointsEarned'
              }
            }
          }, {
            $match: {
              totalPoints: {
                $gt: userData.totalPoints
              }
            }
          }, {
            $count: 'count'
          }]);
          userRank = {
            rank: (count || 0) + 1,
            totalPoints: userData.totalPoints,
            totalAttempts: userData.totalAttempts
          };
        }
      }
    }
    res.status(200).json({
      success: true,
      data: {
        leaderboard: entries,
        userRank
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};