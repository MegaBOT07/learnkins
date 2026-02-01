import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "parent", "teacher", "admin"],
      default: "student",
    },
    grade: {
      type: String,
      enum: ["6th", "7th", "8th", null],
      required: function () {
        return this.role === "student";
      },
      default: null,
    },
    avatar: {
      type: String,
      default: "",
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.role === "student";
      },
      default: null,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subjects: [
      {
        type: String,
        enum: ["science", "mathematics", "social-science", "english"],
      },
    ],
    // Achievement and points system
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },
    ],
    points: {
      type: Number,
      default: 0,
    },
    // On-app currency (tokens) used by the Vault system
    tokens: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    experience: {
      type: Number,
      default: 0,
    },
    // Study statistics
    totalStudyHours: {
      type: Number,
      default: 0,
    },
    totalQuizzesTaken: {
      type: Number,
      default: 0,
    },
    totalGamesPlayed: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    // Community participation
    communityPosts: {
      type: Number,
      default: 0,
    },
    communityLikes: {
      type: Number,
      default: 0,
    },
    // Parental control settings (for parents)
    parentalControls: {
      timeLimits: {
        dailyLimit: { type: Number, default: 3 },
        breakReminder: { type: Number, default: 30 },
        bedtimeRestriction: { type: String, default: "21:00" },
        weekendBonus: { type: Number, default: 1 },
      },
      contentFilters: {
        allowedSubjects: {
          type: [String],
          default: ["science", "mathematics", "social-science", "english"],
        },
        communityAccess: { type: Boolean, default: true },
        gamingTime: { type: Number, default: 1 },
      },
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        achievements: { type: Boolean, default: true },
        progress: { type: Boolean, default: true },
        community: { type: Boolean, default: true },
      },
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ["public", "friends", "private"],
          default: "public",
        },
        showProgress: { type: Boolean, default: true },
        showAchievements: { type: Boolean, default: true },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // OTP for password reset
    resetOTP: String,
    resetOTPExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get user's full progress
userSchema.methods.getProgress = function () {
  return mongoose.model("Progress").find({ userId: this._id });
};

// Calculate level based on experience
userSchema.methods.calculateLevel = function () {
  const experience = this.experience || 0;
  return Math.floor(experience / 100) + 1;
};

// Add experience and check for level up
userSchema.methods.addExperience = function (amount) {
  this.experience += amount;
  const newLevel = this.calculateLevel();

  if (newLevel > this.level) {
    this.level = newLevel;
    return { leveledUp: true, newLevel };
  }

  return { leveledUp: false };
};

// Add achievement
userSchema.methods.addAchievement = function (achievementId) {
  if (!this.achievements.includes(achievementId)) {
    this.achievements.push(achievementId);
    return true;
  }
  return false;
};

// Get user statistics
userSchema.methods.getStats = function () {
  return {
    level: this.level,
    experience: this.experience,
    points: this.points,
    totalStudyHours: this.totalStudyHours,
    totalQuizzesTaken: this.totalQuizzesTaken,
    totalGamesPlayed: this.totalGamesPlayed,
    currentStreak: this.currentStreak,
    longestStreak: this.longestStreak,
    communityPosts: this.communityPosts,
    communityLikes: this.communityLikes,
  };
};

export default mongoose.model("User", userSchema);
