import mongoose from 'mongoose';
import ProfessionalQuiz from '../models/ProfessionalQuiz.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import fetch from 'node-fetch';
import { earnTokens } from '../utils/tokenHelpers.js';

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

// Fallback questions template for when AI generation fails
const fallbackQuestionsTemplate = {
  science: [
    {
      question: "What is the basic unit of life?",
      options: ["Cell", "Atom", "Molecule", "Tissue"],
      correctAnswer: 0,
      explanation: "The cell is the fundamental unit of all living organisms."
    },
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Earth", "Mercury", "Mars"],
      correctAnswer: 2,
      explanation: "Mercury is the closest planet to the Sun in our solar system."
    },
    {
      question: "What is the chemical formula for water?",
      options: ["H2O2", "H2O", "HO2", "OH"],
      correctAnswer: 1,
      explanation: "Water consists of two hydrogen atoms and one oxygen atom."
    },
    {
      question: "Which gas do plants absorb during photosynthesis?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correctAnswer: 2,
      explanation: "Plants use carbon dioxide (CO2) to produce oxygen and glucose."
    },
    {
      question: "What is the speed of light?",
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
      correctAnswer: 0,
      explanation: "Light travels at approximately 300,000 kilometers per second in a vacuum."
    }
  ],
  mathematics: [
    {
      question: "What is the square root of 144?",
      options: ["10", "12", "14", "16"],
      correctAnswer: 1,
      explanation: "12 × 12 = 144, so √144 = 12"
    },
    {
      question: "What is the area of a circle with radius 5?",
      options: ["25π", "10π", "50π", "5π"],
      correctAnswer: 0,
      explanation: "Area = πr² = π × 5² = 25π"
    },
    {
      question: "Solve: 2x + 5 = 13",
      options: ["x = 2", "x = 4", "x = 6", "x = 8"],
      correctAnswer: 1,
      explanation: "2x = 13 - 5 = 8, so x = 4"
    },
    {
      question: "What is 25% of 200?",
      options: ["25", "50", "75", "100"],
      correctAnswer: 1,
      explanation: "25% × 200 = 0.25 × 200 = 50"
    },
    {
      question: "What is the sum of angles in a triangle?",
      options: ["90°", "180°", "270°", "360°"],
      correctAnswer: 1,
      explanation: "The sum of interior angles in any triangle is always 180°."
    }
  ],
  english: [
    {
      question: "What is the past tense of 'go'?",
      options: ["goes", "gone", "went", "going"],
      correctAnswer: 2,
      explanation: "'Went' is the simple past tense of 'go'."
    },
    {
      question: "Which word is a noun?",
      options: ["quickly", "run", "happy", "blue"],
      correctAnswer: 1,
      explanation: "'Run' can be a noun (a running action) or a verb."
    },
    {
      question: "What does 'benevolent' mean?",
      options: ["mean", "helpful", "cold", "afraid"],
      correctAnswer: 1,
      explanation: "Benevolent means kind, generous, and showing goodwill."
    },
    {
      question: "Identify the correct sentence:",
      options: ["She go to school", "She goes to school", "She going to school", "She gone to school"],
      correctAnswer: 1,
      explanation: "The correct verb form with 'she' is 'goes'."
    },
    {
      question: "What is a metaphor?",
      options: ["A comparison using like or as", "A comparison without using like or as", "A repetition of words", "A question asked for effect"],
      correctAnswer: 1,
      explanation: "A metaphor is a direct comparison between two unlike things without using 'like' or 'as'."
    }
  ],
  "social-science": [
    {
      question: "What is the capital of France?",
      options: ["Lyon", "Paris", "Marseille", "Nice"],
      correctAnswer: 1,
      explanation: "Paris is the capital and largest city of France."
    },
    {
      question: "In which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: 2,
      explanation: "World War II ended on September 2, 1945."
    },
    {
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "Benjamin Franklin"],
      correctAnswer: 1,
      explanation: "George Washington served as the first President from 1789 to 1797."
    },
    {
      question: "What is the largest continent by area?",
      options: ["Africa", "Europe", "Asia", "North America"],
      correctAnswer: 2,
      explanation: "Asia is the largest continent, covering about 44.5 million square kilometers."
    },
    {
      question: "Which ocean is the largest?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: 3,
      explanation: "The Pacific Ocean is the largest ocean, covering about 165 million square kilometers."
    }
  ]
};

// Generate fallback questions when AI fails
const generateFallbackQuestions = (subject, difficulty, totalQuestions, topic) => {
  const subjectQuestions = fallbackQuestionsTemplate[subject] || fallbackQuestionsTemplate.science;
  const questions = [];
  
  // Cycle through template questions to fill the request
  for (let i = 0; i < totalQuestions; i++) {
    const templateQ = subjectQuestions[i % subjectQuestions.length];
    questions.push({
      ...templateQ,
      // Vary the question slightly based on difficulty
      explanation: `${templateQ.explanation} (${topic ? `Topic: ${topic}` : 'General knowledge'})`
    });
  }
  
  return questions;
};

// Helper function to call OpenRouter AI API for generating quiz questions
const generateQuestionsWithOpenAI = async (difficulty, subject, totalQuestions, topic) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured in environment');
  }

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
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'Learnkins',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} — ${errorBody}`);
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
    console.error('OpenRouter API error:', error);
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
    let usedFallback = false;
    try {
      const topic = req.body.topic || '';
      aiQuestions = await generateQuestionsWithOpenAI(difficulty, finalSubject, totalQuestions, topic);
    } catch (aiError) {
      usedFallback = true;
      console.warn('⚠️ OpenAI generation failed, using fallback questions:', aiError.message);
      const topic = req.body.topic || 'General';
      aiQuestions = generateFallbackQuestions(finalSubject, difficulty, totalQuestions, topic);
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
    const fallbackNote = usedFallback ? ' (Using template questions - check API key)' : ' (AI-generated)';

    const quiz = new ProfessionalQuiz({
      title: title || `${difficulty} Quiz - ${finalSubject}${topicLabel}`,
      description: `${difficulty} quiz for ${finalSubject}${topicLabel} with ${questions.length} questions${fallbackNote}`,
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

    // Award XP for professional quiz
    const user = await User.findById(userId);
    let levelUpData = null;
    if (user) {
      // Bonus XP for passing professional quiz
      const passBonus = passed ? 50 : 0;
      const correctBonus = processedAnswers.filter(a => a.isCorrect).length * 5;
      const totalXP = passBonus + correctBonus;

      levelUpData = user.addExperience(totalXP);
      user.totalQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;
      user.points = (user.points || 0) + Math.round(percentage * 0.5);
      await user.save();
    }

    // Award tokens based on performance
    try {
      const tokensEarned = percentage >= 100 ? 25 : percentage >= 80 ? 15 : percentage >= 60 ? 10 : 5;
      await earnTokens(userId, tokensEarned, {
        referenceType: 'quiz',
        referenceId: id,
        reason: `Professional quiz completed (${Math.round(percentage)}%)`,
        meta: { percentage: Math.round(percentage), passed },
      });
    } catch (e) {
      console.warn('Professional quiz token award failed:', e.message);
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
        levelUp: levelUpData
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
