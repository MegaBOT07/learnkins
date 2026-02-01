import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    maxlength: [1000, 'Answer cannot exceed 1000 characters']
  },
  subject: {
    type: String,
    required: true,
    enum: ['science', 'mathematics', 'social-science', 'english']
  },
  chapter: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  studyCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    ratings: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  studySessions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    studiedAt: {
      type: Date,
      default: Date.now
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
flashcardSchema.index({ 
  question: 'text', 
  answer: 'text', 
  tags: 'text' 
});

// Index for filtering
flashcardSchema.index({ subject: 1, difficulty: 1, isPublic: 1, isActive: 1 });

// Increment study count
flashcardSchema.methods.incrementStudyCount = async function(userId) {
  this.studyCount += 1;
  this.studySessions.push({ user: userId });
  await this.save();
};

// Add rating
flashcardSchema.methods.addRating = async function(userId, rating) {
  // Check if user already rated
  const existingRating = this.rating.ratings.find(
    r => r.user.toString() === userId.toString()
  );

  if (existingRating) {
    existingRating.rating = rating;
  } else {
    this.rating.ratings.push({ user: userId, rating });
    this.rating.count += 1;
  }

  // Recalculate average
  const totalRating = this.rating.ratings.reduce((sum, r) => sum + r.rating, 0);
  this.rating.average = totalRating / this.rating.ratings.length;

  await this.save();
};

// Get popular flashcards
flashcardSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isPublic: true, isActive: true })
    .sort({ studyCount: -1, 'rating.average': -1 })
    .limit(limit)
    .populate('createdBy', 'name');
};

// Get recent flashcards
flashcardSchema.statics.getRecent = function(limit = 10) {
  return this.find({ isPublic: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('createdBy', 'name');
};

export default mongoose.model('Flashcard', flashcardSchema);