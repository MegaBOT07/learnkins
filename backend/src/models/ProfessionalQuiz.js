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
    type: Number, // in minutes
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
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
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
      selectedAnswer: Number,
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

// Index for queries
professionalQuizSchema.index({ subject: 1, grade: 1 });
professionalQuizSchema.index({ isActive: 1, createdBy: 1 });

export default mongoose.model('ProfessionalQuiz', professionalQuizSchema);
