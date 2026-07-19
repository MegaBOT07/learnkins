import mongoose from 'mongoose';
const professionalQuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    enum: ['science', 'mathematics', 'social-science', 'english'],
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  timeLimit: {
    type: Number,
    // in minutes
    default: 30
  },
  passingScore: {
    type: Number,
    default: 60,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  questions: [{
    id: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer'],
      default: 'multiple-choice'
    },
    options: [{
      type: String
    }],
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    explanation: String,
    points: {
      type: Number,
      default: 1
    }
  }],
  certificateTemplate: {
    title: String,
    description: String,
    issuer: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attempts: [{
    userId: mongoose.Schema.Types.ObjectId,
    attemptDate: {
      type: Date,
      default: Date.now
    },
    score: Number,
    percentage: Number,
    passed: Boolean,
    timeTaken: Number,
    answers: [{
      questionId: String,
      selectedAnswer: mongoose.Schema.Types.Mixed,
      isCorrect: Boolean,
      pointsEarned: Number
    }],
    certificateIssued: Boolean,
    certificateId: mongoose.Schema.Types.ObjectId
  }],
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    totalPassed: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    passRate: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Get quiz statistics
professionalQuizSchema.methods.getStatistics = function () {
  const attempts = this.attempts;
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      totalPassed: 0,
      passRate: 0,
      averageTime: 0
    };
  }
  const totalAttempts = attempts.length;
  const totalPassed = attempts.filter(a => a.passed).length;
  const averageScore = Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts);
  const passRate = Math.round(totalPassed / totalAttempts * 100);
  const averageTime = Math.round(attempts.reduce((sum, a) => sum + (a.timeTaken || 0), 0) / totalAttempts);
  return {
    totalAttempts,
    averageScore,
    totalPassed,
    passRate,
    averageTime
  };
};

// Index for queries
professionalQuizSchema.index({
  subject: 1,
  grade: 1
});
professionalQuizSchema.index({
  isActive: 1,
  createdBy: 1
});
export default mongoose.model('ProfessionalQuiz', professionalQuizSchema);