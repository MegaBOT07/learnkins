import mongoose from 'mongoose';

const parentalControlSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timeControls: {
    dailyLimit: {
      type: Number, // in minutes
      default: 180 // 3 hours
    },
    breakReminder: {
      type: Number, // in minutes
      default: 30
    },
    bedtimeRestriction: {
      type: String,
      default: '21:00'
    },
    weekendBonus: {
      type: Number, // additional minutes
      default: 60
    },
    allowedDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  contentFilters: {
    allowedSubjects: [{
      type: String,
      enum: ['science', 'mathematics', 'social-science', 'english']
    }],
    communityAccess: {
      type: Boolean,
      default: true
    },
    gamingTimeLimit: {
      type: Number, // in minutes
      default: 60
    },
    blockedContent: [String]
  },
  notifications: {
    dailyReports: {
      type: Boolean,
      default: true
    },
    achievementAlerts: {
      type: Boolean,
      default: true
    },
    timeWarnings: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  },
  sessionLogs: [{
    date: {
      type: Date,
      default: Date.now
    },
    duration: Number, // in minutes
    activities: [{
      type: String,
      subject: String,
      timeSpent: Number
    }],
    screenTimeUsed: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Check if child can access content
parentalControlSchema.methods.canAccess = function(subject, currentTime) {
  // Check subject access
  if (!this.contentFilters.allowedSubjects.includes(subject)) {
    return { allowed: false, reason: 'Subject not allowed' };
  }

  // Check time restrictions
  const now = new Date();
  const bedtime = this.timeControls.bedtimeRestriction;
  const [bedHour, bedMinute] = bedtime.split(':').map(Number);
  const bedtimeDate = new Date(now);
  bedtimeDate.setHours(bedHour, bedMinute, 0, 0);

  if (now > bedtimeDate) {
    return { allowed: false, reason: 'Past bedtime' };
  }

  // Check daily limit
  const today = new Date().toDateString();
  const todayLog = this.sessionLogs.find(log => 
    log.date.toDateString() === today
  );

  if (todayLog && todayLog.screenTimeUsed >= this.timeControls.dailyLimit) {
    return { allowed: false, reason: 'Daily limit reached' };
  }

  return { allowed: true };
};

// Log session activity
parentalControlSchema.methods.logActivity = function(duration, activities) {
  const today = new Date().toDateString();
  let todayLog = this.sessionLogs.find(log => 
    log.date.toDateString() === today
  );

  if (!todayLog) {
    todayLog = {
      date: new Date(),
      duration: 0,
      activities: [],
      screenTimeUsed: 0
    };
    this.sessionLogs.push(todayLog);
  }

  todayLog.duration += duration;
  todayLog.screenTimeUsed += duration;
  todayLog.activities.push(...activities);
};

export default mongoose.model('ParentalControl', parentalControlSchema);