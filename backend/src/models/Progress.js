import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  chapter: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  completedActivities: [{
    type: {
      type: String,
      enum: ['video', 'quiz', 'material', 'game']
    },
    activityId: mongoose.Schema.Types.ObjectId,
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: Number
  }],
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastStudyDate: Date
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ userId: 1, subject: 1, chapter: 1 }, { unique: true });

// Update streak
progressSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastStudy = this.streak.lastStudyDate;
  
  if (!lastStudy) {
    this.streak.current = 1;
    this.streak.lastStudyDate = today;
  } else {
    const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      this.streak.current += 1;
      if (this.streak.current > this.streak.longest) {
        this.streak.longest = this.streak.current;
      }
    } else if (daysDiff > 1) {
      this.streak.current = 1;
    }
    
    this.streak.lastStudyDate = today;
  }
};

// Add completed activity
progressSchema.methods.addActivity = function(type, activityId, score = null) {
  this.completedActivities.push({
    type,
    activityId,
    score
  });
  
  // Update progress based on activity completion
  const totalActivities = this.completedActivities.length;
  this.progress = Math.min(100, totalActivities * 10); // Simple calculation
  
  this.updateStreak();
  this.lastAccessed = new Date();
};

export default mongoose.model('Progress', progressSchema);