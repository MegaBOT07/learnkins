import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['science', 'mathematics', 'social-science', 'english'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  gameType: {
    type: String,
    enum: ['puzzle', 'quiz', 'simulation', 'adventure'],
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  gameUrl: String,
  duration: {
    type: String,
    required: true
  },
  instructions: [String],
  learningObjectives: [String],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  playCount: {
    type: Number,
    default: 0
  },
  scores: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    timeTaken: Number,
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

// Increment play count
gameSchema.methods.incrementPlayCount = async function() {
  this.playCount += 1;
  await this.save();
};

// Add user score
gameSchema.methods.addScore = async function(userId, score, timeTaken) {
  this.scores.push({
    userId,
    score,
    timeTaken
  });
  await this.save();
};

// Get leaderboard
gameSchema.methods.getLeaderboard = function(limit = 10) {
  return this.scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .populate('userId', 'name avatar');
};

export default mongoose.model('Game', gameSchema);