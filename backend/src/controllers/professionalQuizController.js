import mongoose from 'mongoose';
import ProfessionalQuiz from '../models/ProfessionalQuiz.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import fetch from 'node-fetch';

// @desc    Get all professional quizzes
// @route   GET /api/professional-quizzes
// @access  Public
export const getProfessionalQuizzes = async (req, res) => {
  try {
    const { subject, grade, difficulty } = req.query;

    let filter = { isActive: true };
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await ProfessionalQuiz.find(filter)
      .select('-questions') // Don't send full questions in list
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
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

// Helper function to call OpenAI API for generating quiz questions
const generateQuestionsWithOpenAI = async (difficulty, subject, totalQuestions, topic) => {
  const apiKey = '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';

  const topicClause = topic && topic.trim() ? ` focusing specifically on the topic: "${topic.trim()}"` : '';

  const prompt = `Generate ${totalQuestions} multiple-choice quiz questions on ${subject}${topicClause} at ${difficulty} difficulty level.
Return a JSON array with objects containing:
{
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0 (index of correct option, 0-3),
  "explanation": "Brief explanation"
}

Make the questions realistic, varied, and appropriate for ${difficulty} difficulty.
Return ONLY the JSON array, no other text.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';

    // Parse the response and sanitize
    let questions = [];
    try {
      questions = JSON.parse(content);
    } catch (e) {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      }
    }

    return questions.slice(0, totalQuestions);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

// @desc    Create AI-generated professional quiz (any authenticated user)
// @route   POST /api/professional-quizzes/ai-generate
// @access  Private
export const createAIQuiz = async (req, res) => {
  try {
    const { difficulty = 'Easy', subject = 'science', grade = 'all', title, totalQuestions = 10 } = req.body;
    const userId = req.user?.id;

    const allowedSubjects = ['science', 'mathematics', 'social-science', 'english'];
    const finalSubject = allowedSubjects.includes(subject) ? subject : 'science';
    const pointsPerQuestion = difficulty === 'Hard' ? 3 : difficulty === 'Medium' ? 2 : 1;

    // Generate questions using OpenAI
    let aiQuestions = [];
    try {
      const topic = req.body.topic || '';
      aiQuestions = await generateQuestionsWithOpenAI(difficulty, finalSubject, totalQuestions, topic);
    } catch (aiError) {
      console.warn('OpenAI generation failed, falling back to placeholder questions:', aiError.message);
      // Fallback to placeholder questions if OpenAI fails
      const fallbackTopic = req.body.topic ? `: ${req.body.topic}` : '';
      for (let i = 0; i < totalQuestions; i++) {
        aiQuestions.push({
          question: `${difficulty} question ${i + 1} on ${finalSubject}${fallbackTopic}`,
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
      options: q.options || ['A', 'B', 'C', 'D'],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
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
    const userId = req.user.id;

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
      const isCorrect = selectedAnswer === question.correctAnswer;
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

    // Update statistics
    quiz.statistics.totalAttempts += 1;
    if (passed) {
      quiz.statistics.totalPassed += 1;
    }

    // Recalculate average score
    const allScores = quiz.attempts.map(a => a.percentage);
    quiz.statistics.averageScore = Math.round(
      allScores.reduce((sum, score) => sum + score, 0) / allScores.length
    );
    quiz.statistics.passRate = Math.round(
      (quiz.statistics.totalPassed / quiz.statistics.totalAttempts) * 100
    );

    // Recalculate average time
    const allTimes = quiz.attempts.map(a => a.timeTaken || 0).filter(t => t > 0);
    if (allTimes.length > 0) {
      quiz.statistics.averageTime = Math.round(
        allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length
      );
    }

    await quiz.save();

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

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score: earnedPoints,
        totalScore: totalPoints,
        percentage: Math.round(percentage),
        passed,
        timeTaken,
        attemptNumber: quiz.attempts.length
      }
    });
  } catch (error) {
    console.error('Submit professional quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting professional quiz'
    });
  }
};

// @desc    Get user attempts for a professional quiz
// @route   GET /api/professional-quizzes/:id/attempts
// @access  Private
export const getUserAttempts = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

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
