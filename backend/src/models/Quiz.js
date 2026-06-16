import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: String,
  explanation: String,
  points: {
    type: Number,
    default: 1
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  chapter: String,
  grade: {
    type: String,
    enum: ['6th', '7th', '8th'],
    required: true
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number, // in minutes
    default: 30
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  attempts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    totalQuestions: Number,
    timeTaken: Number,
    answers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      answer: String,
      isCorrect: Boolean
    }],
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate total points
quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  next();
});

// Get quiz statistics
quizSchema.methods.getStatistics = function() {
  const attempts = this.attempts;
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      averageTime: 0
    };
  }

  const totalAttempts = attempts.length;
  const averageScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts;
  const highestScore = Math.max(...attempts.map(attempt => attempt.score));
  const averageTime = attempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0) / totalAttempts;

  return {
    totalAttempts,
    averageScore: Math.round(averageScore * 100) / 100,
    highestScore,
    averageTime: Math.round(averageTime * 100) / 100
  };
};

export default mongoose.model('Quiz', quizSchema);