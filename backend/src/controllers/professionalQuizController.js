import mongoose from 'mongoose';
import ProfessionalQuiz from '../models/ProfessionalQuiz.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import TokenTransaction from '../models/TokenTransaction.js';
import { checkAndAwardAchievements } from '../utils/achievementChecker.js';
import fetch from 'node-fetch';

// @desc    Get all professional quizzes
// @route   GET /api/professional-quizzes
// @access  Public
export const getProfessionalQuizzes = async (req, res) => {
  try {
    const { subject, difficulty, type, page = 1, limit = 6 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    let filter = { isActive: true, isAIGenerated: { $ne: true } };

    const userInfo = req.headers['x-user-info'];
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user.role === 'student' && user.grade) {
          filter.grade = user.grade;
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;
    if (type === 'ai') filter.isAIGenerated = true;
    if (type === 'admin') filter.isAIGenerated = false;

    const quizzes = await ProfessionalQuiz.find(filter)
      .select('-questions') // Don't send full questions in list
      .populate('createdBy', 'name email')
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      .sort({ createdAt: -1 });

    const total = await ProfessionalQuiz.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: quizzes.length,
      total,
      data: quizzes
    });
  } catch (error) {
    console.error('Get professional quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching professional quizzes'
    });
  }
};

// @desc    Get single professional quiz
// @route   GET /api/professional-quizzes/:id
// @access  Public
export const getProfessionalQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz ID format'
      });
    }

    const quiz = await ProfessionalQuiz.findById(id)
      .populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Professional quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Get professional quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching professional quiz'
    });
  }
};

// @desc    Create professional quiz (admin only)
// @route   POST /api/professional-quizzes
// @access  Private (Admin)
export const createProfessionalQuiz = async (req, res) => {
  try {
    const { title, description, subject, grade, difficulty, timeLimit, passingScore, questions, certificateTemplate } = req.body;

    // Verify admin status
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create professional quizzes'
      });
    }

    const quiz = new ProfessionalQuiz({
      title,
      description,
      subject,
      grade,
      difficulty,
      timeLimit,
      passingScore,
      totalQuestions: questions?.length || 0,
      questions,
      certificateTemplate,
      createdBy: req.user.id
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Professional quiz created successfully',
      data: quiz
    });
  } catch (error) {
    console.error('Create professional quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating professional quiz'
    });
  }
};

// Helper function to call OpenRouter AI API for generating quiz questions
const MODELS_TO_TRY = [
  'openrouter/free',
  'meta-llama/llama-3.1-8b-instruct',
  'microsoft/phi-3-mini-128k-instruct',
];

const parseJSONFromResponse = (content) => {
  let cleaned = content;
  // Strip markdown code fences (with optional json tag)
  cleaned = cleaned.replace(/```(?:json)?\s*\n?/gi, '');
  cleaned = cleaned.replace(/\n?```\s*$/g, '').trim();

  // Find first [ and last ]
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    cleaned = cleaned.slice(firstBracket, lastBracket + 1);
  }

  // Attempt raw parse
  try { return JSON.parse(cleaned); } catch {}

  // Fix trailing commas
  cleaned = cleaned.replace(/,(\s*[\]}])/g, '$1');
  try { return JSON.parse(cleaned); } catch {}

  // Remove comments (// and /* */ style)
  cleaned = cleaned.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  try { return JSON.parse(cleaned); } catch {}

  // Unescape improperly escaped quotes inside string values
  const noBackslashQuotes = cleaned.replace(/\\(?=")/g, '');
  try { return JSON.parse(noBackslashQuotes); } catch {}

  // Fallback: extract individual objects via regex
  const objRegex = /\{[^{}]*"question"\s*:\s*"[^"\\]*(?:\\.[^"\\]*)*"[^{}]*\}/g;
  const matches = content.match(objRegex);
  if (matches && matches.length > 0) {
    const parsed = matches.map(q => { try { return JSON.parse(q); } catch { return null; } }).filter(Boolean);
    if (parsed.length > 0) return parsed;
  }

  return null;
};

const callModel = async (model, body) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${body.apiKey}`,
      'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
      'X-Title': 'Learnkins',
    },
    body: JSON.stringify({
      model,
      messages: body.messages,
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter ${model} error: ${response.status} — ${errorBody}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
};

const generateQuestionsWithOpenAI = async (difficulty, subject, totalQuestions, topic, grade = '', questionType = 'mixed') => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured in environment');
  }

  const topicClause = topic && topic.trim() ? ` on "${topic.trim()}"` : '';
  const gradeClause = grade && grade !== 'all' ? ` for grade ${grade}` : '';

  let typeInstruction = '';
  if (questionType === 'mixed') {
    typeInstruction = 'Mix of multiple-choice, true-false, and short-answer questions.';
  } else if (questionType === 'multiple-choice') {
    typeInstruction = 'All questions must be multiple-choice with 4 options each.';
  } else if (questionType === 'true-false') {
    typeInstruction = 'All questions must be true-false with options ["True","False"].';
  } else if (questionType === 'short-answer') {
    typeInstruction = 'All questions must be short-answer (single word or number only).';
  }

  const prompt = `Generate ${totalQuestions} quiz questions for ${subject}${topicClause}${gradeClause}, ${difficulty} difficulty.
${typeInstruction}

Format: JSON array. Each object:
- multiple-choice: {"type":"multiple-choice","question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}
- true-false: {"type":"true-false","question":"...","options":["True","False"],"correctAnswer":0,"explanation":"..."}
- short-answer: {"type":"short-answer","question":"...","options":[],"correctAnswer":"word or number","explanation":"..."}

Rules:
- correctAnswer is index 0-3 for multiple-choice/true-false, text for short-answer.
- No trailing commas. No comments. Escape quotes inside strings with \\".
- Return ONLY the JSON array — no markdown, no backticks, no explanation.`;

  const body = { apiKey, messages: [{ role: 'user', content: prompt }] };

  for (const model of MODELS_TO_TRY) {
    try {
      const content = await callModel(model, body);
      if (!content) continue;
      const questions = parseJSONFromResponse(content);
      if (questions && Array.isArray(questions) && questions.length > 0) {
        if (model !== MODELS_TO_TRY[0]) {
          console.log(`AI quiz: ${model} succeeded (fallback from ${MODELS_TO_TRY[0]})`);
        }
        return questions.slice(0, totalQuestions);
      }
    } catch (err) {
      console.warn(`${model} failed: ${err.message}`);
    }
  }

  throw new Error('All models failed to generate valid questions');
};

// @desc    Create AI-generated professional quiz (any authenticated user)
// @route   POST /api/professional-quizzes/ai-generate
// @access  Private
export const createAIQuiz = async (req, res) => {
  try {
    const { difficulty = 'Easy', subject = 'science', grade = 'all', title, totalQuestions = 10, questionType = 'mixed' } = req.body;
    const MIN_QUESTIONS = 3;
    const MAX_QUESTIONS = 50;

    if (totalQuestions < MIN_QUESTIONS || totalQuestions > MAX_QUESTIONS) {
      return res.status(400).json({
        message: `Number of questions must be between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}`
      });
    }

    const userId = req.user?.id;

    const allowedSubjects = ['science', 'mathematics', 'social-science', 'english'];
    const finalSubject = allowedSubjects.includes(subject) ? subject : 'science';
    const pointsPerQuestion = difficulty === 'Hard' ? 3 : difficulty === 'Medium' ? 2 : 1;

    // Generate questions using OpenAI
    let aiQuestions = [];
    try {
      const topic = req.body.topic || '';
      aiQuestions = await generateQuestionsWithOpenAI(difficulty, finalSubject, totalQuestions, topic, grade, questionType);
    } catch (aiError) {
      console.warn('OpenAI generation failed, falling back to placeholder questions:', aiError.message);
      // Fallback to placeholder questions if OpenAI fails
      const fallbackTopic = req.body.topic ? `: ${req.body.topic}` : '';
      for (let i = 0; i < totalQuestions; i++) {
        aiQuestions.push({
          question: `${difficulty} question ${i + 1} on ${finalSubject}${fallbackTopic}`,
          type: 'multiple-choice',
          options: [
            `Option A for question ${i + 1}`,
            `Option B for question ${i + 1}`,
            `Option C for question ${i + 1}`,
            `Option D for question ${i + 1}`,
          ],
          correctAnswer: 0,
          explanation: 'Explanation not available',
        });
      }
    }

    // Format questions for storage
    const questions = aiQuestions.map((q, i) => ({
      id: `${Date.now()}-${i}`,
      question: q.question,
      type: q.type || 'multiple-choice',
      options: q.options || (q.type === 'true-false' ? ['True', 'False'] : ['A', 'B', 'C', 'D']),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      points: pointsPerQuestion,
    }));

    const topicLabel = req.body.topic && req.body.topic.trim() ? ` - ${req.body.topic.trim()}` : '';

    const quiz = new ProfessionalQuiz({
      title: title || `AI ${difficulty} Quiz - ${finalSubject}${topicLabel}`,
      description: `AI generated ${difficulty} quiz for ${finalSubject}${topicLabel} with ${questions.length} questions`,
      subject: finalSubject,
      grade,
      difficulty,
      timeLimit: Math.max(10, Math.floor(questions.length * 1.5)),
      passingScore: 50,
      totalQuestions: questions.length,
      questions,
      isAIGenerated: true,
      createdBy: userId,
      statistics: {
        totalAttempts: 0,
        totalPassed: 0,
        averageScore: 0,
        passRate: 0,
        averageTime: 0,
      },
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'AI quiz generated successfully',
      data: quiz,
    });
  } catch (error) {
    console.error('Create AI quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating AI quiz',
    });
  }
};

// @desc    Update professional quiz (admin only)
// @route   PUT /api/professional-quizzes/:id
// @access  Private (Admin)
export const updateProfessionalQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty, timeLimit, passingScore, questions, isActive, certificateTemplate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz ID format'
      });
    }

    // Verify admin status
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update professional quizzes'
      });
    }

    const quiz = await ProfessionalQuiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Professional quiz not found'
      });
    }

    // Update fields
    if (title) quiz.title = title;
    if (description) quiz.description = description;
    if (difficulty) quiz.difficulty = difficulty;
    if (timeLimit) quiz.timeLimit = timeLimit;
    if (passingScore) quiz.passingScore = passingScore;
    if (questions) {
      quiz.questions = questions;
      quiz.totalQuestions = questions.length;
    }
    if (certificateTemplate) quiz.certificateTemplate = certificateTemplate;
    if (isActive !== undefined) quiz.isActive = isActive;

    await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Professional quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    console.error('Update professional quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating professional quiz'
    });
  }
};

// @desc    Delete professional quiz (admin only)
// @route   DELETE /api/professional-quizzes/:id
// @access  Private (Admin)
export const deleteProfessionalQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz ID format'
      });
    }

    // Verify admin status
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete professional quizzes'
      });
    }

    const quiz = await ProfessionalQuiz.findByIdAndDelete(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Professional quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Professional quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete professional quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting professional quiz'
    });
  }
};

// @desc    Submit professional quiz attempt
// @route   POST /api/professional-quizzes/:id/submit
// @access  Private
export const submitProfessionalQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });
    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz ID format'
      });
    }

    const quiz = await ProfessionalQuiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Professional quiz not found'
      });
    }

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    const processedAnswers = [];

    quiz.questions.forEach((question, index) => {
      const selectedAnswer = answers[index];
      let isCorrect = false;

      if (selectedAnswer != null) {
        if (question.type === 'short-answer') {
          isCorrect = String(selectedAnswer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
        } else {
          const correctOption = Array.isArray(question.options) ? question.options[question.correctAnswer] : undefined;
          isCorrect = correctOption !== undefined && String(selectedAnswer).trim().toLowerCase() === String(correctOption).trim().toLowerCase();
        }
      }

      const pointsEarned = isCorrect ? (question.points || 1) : 0;

      totalPoints += (question.points || 1);
      earnedPoints += pointsEarned;

      processedAnswers.push({
        questionId: question.id,
        selectedAnswer,
        isCorrect,
        pointsEarned
      });
    });

    const percentage = (earnedPoints / totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;

    // Create attempt record
    const attempt = {
      userId,
      attemptDate: new Date(),
      score: earnedPoints,
      percentage: Math.round(percentage),
      passed,
      timeTaken,
      answers: processedAnswers,
      certificateIssued: false
    };

    quiz.attempts.push(attempt);

    // Recalculate statistics
    const stats = quiz.getStatistics();
    quiz.statistics = stats;

    await quiz.save();

    // Award XP + tokens for professional quiz
    const user = await User.findById(userId);
    let levelUpData = null;
    if (user) {
      const passBonus = passed ? 50 : 0;
      const correctBonus = processedAnswers.filter(a => a.isCorrect).length * 5;
      const totalXP = passBonus + correctBonus;

      // Token reward (same scale as regular quizzes)
      const pct = Math.round(percentage);
      const tokensEarned = pct >= 100 ? 25 : pct >= 80 ? 15 : pct >= 60 ? 10 : 5;

      user.tokens = (user.tokens || 0) + tokensEarned;
      user.totalQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;
      if (passed && pct === 100) {
        user.perfectScores = (user.perfectScores || 0) + 1;
      }

      levelUpData = user.addExperience(totalXP);
      await user.save();

      // TokenTransaction audit trail
      try {
        await TokenTransaction.create({
          userId,
          type: 'award',
          amount: tokensEarned,
          reason: `Professional quiz completed (${pct}%)`,
          meta: { quizId: id, percentage: pct, passed },
        });
      } catch (txErr) {
        console.warn('Failed to create TokenTransaction:', txErr.message);
      }
    }

    // Update user progress
    try {
      let progress = await Progress.findOne({
        userId,
        subject: quiz.subject,
        chapter: 'professional-quizzes'
      });

      if (!progress) {
        progress = new Progress({
          userId,
          subject: quiz.subject,
          chapter: 'professional-quizzes'
        });
      }

      progress.timeSpent += Math.round(timeTaken / 60);
      progress.addActivity('quiz', id, Math.round(percentage));
      await progress.save();
    } catch (progressErr) {
      console.warn('Could not update progress:', progressErr.message);
    }

    // Check and award achievements
    let newAchievements = [];
    if (user) {
      newAchievements = await checkAndAwardAchievements(userId);
    }

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score: earnedPoints,
        totalScore: totalPoints,
        percentage: Math.round(percentage),
        passed,
        timeTaken,
        attemptNumber: quiz.attempts.length,
        levelUp: levelUpData,
        tokensEarned: user ? Math.min(25, 5 + Math.floor((earnedPoints / totalPoints) * 100)) : 0,
      },
      newAchievements
    });
  } catch (error) {
    console.error('Submit professional quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting professional quiz'
    });
  }
};

// @desc    Get all attempts across all quizzes for the logged-in user
// @route   GET /api/professional-quizzes/my-attempts
// @access  Private
export const getAllUserAttempts = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const quizzes = await ProfessionalQuiz.find(
      { 'attempts.userId': userId },
      { title: 1, subject: 1, difficulty: 1, totalQuestions: 1, questions: 1, attempts: 1 }
    );

    const allAttempts = quizzes.flatMap(quiz => {
      const userAttempts = quiz.attempts.filter(
        a => a.userId.toString() === userId
      );
      return userAttempts.map(attempt => ({
        _id: attempt._id,
        quizId: quiz._id,
        quizTitle: quiz.title,
        subject: quiz.subject,
        difficulty: quiz.difficulty,
        totalQuestions: quiz.totalQuestions,
        score: attempt.score,
        percentage: attempt.percentage,
        passed: attempt.passed,
        timeTaken: attempt.timeTaken,
        attemptDate: attempt.attemptDate,
        answers: attempt.answers,
        questions: quiz.questions,
      }));
    });

    allAttempts.sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));

    res.status(200).json({
      success: true,
      count: allAttempts.length,
      data: allAttempts
    });
  } catch (error) {
    console.error('Get all user attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attempts'
    });
  }
};

// @desc    Get user attempts for a professional quiz
// @route   GET /api/professional-quizzes/:id/attempts
// @access  Private
export const getUserAttempts = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz ID format'
      });
    }

    const quiz = await ProfessionalQuiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Professional quiz not found'
      });
    }

    const userAttempts = quiz.attempts.filter(
      attempt => attempt.userId.toString() === userId
    );

    res.status(200).json({
      success: true,
      data: userAttempts
    });
  } catch (error) {
    console.error('Get user attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user attempts'
    });
  }
};

// @desc    Get current user's AI-generated quizzes
// @route   GET /api/professional-quizzes/my-ai
// @access  Private
export const getMyAIQuizzes = async (req, res) => {
  try {
    const userId = req.user.id;

    const quizzes = await ProfessionalQuiz.find({
      isAIGenerated: true,
      createdBy: userId,
      isActive: true,
    })
      .select('-questions')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    console.error('Get my AI quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your AI quizzes',
    });
  }
};

// @desc    Delete user's own AI-generated quiz (soft delete)
// @route   DELETE /api/professional-quizzes/my-ai/:id
// @access  Private
export const deleteMyAIQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz ID format',
      });
    }

    const quiz = await ProfessionalQuiz.findOne({
      _id: id,
      isAIGenerated: true,
      createdBy: userId,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'AI quiz not found or not authorized',
      });
    }

    // Soft delete — keeps attempts & stats intact for history
    quiz.isActive = false;
    await quiz.save();

    res.status(200).json({
      success: true,
      message: 'AI quiz deleted successfully',
    });
  } catch (error) {
    console.error('Delete AI quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting AI quiz',
    });
  }
};
