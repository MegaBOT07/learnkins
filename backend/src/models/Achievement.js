import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Achievement name is required"],
      trim: true,
      maxlength: [100, "Achievement name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    icon: {
      type: String,
      required: [true, "Icon is required"],
      trim: true,
    },
    rarity: {
      type: String,
      enum: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
      default: "Common",
    },
    points: {
      type: Number,
      required: [true, "Points are required"],
      min: [1, "Points must be at least 1"],
      max: [1000, "Points cannot exceed 1000"],
    },
    criteria: {
      type: String,
      required: [true, "Criteria is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["study", "quiz", "game", "community", "streak", "special"],
      default: "study",
    },
    requirements: {
      studyHours: {
        type: Number,
        default: 0,
      },
      quizzesTaken: {
        type: Number,
        default: 0,
      },
      gamesPlayed: {
        type: Number,
        default: 0,
      },
      streakDays: {
        type: Number,
        default: 0,
      },
      perfectScores: {
        type: Number,
        default: 0,
      },
      communityPosts: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSecret: {
      type: Boolean,
      default: false,
    },
    unlockDate: {
      type: Date,
    },
    expireDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
achievementSchema.index({ category: 1, rarity: 1 });
achievementSchema.index({ points: -1 });
achievementSchema.index({ isActive: 1 });

// Virtual for rarity color
achievementSchema.virtual("rarityColor").get(function () {
  const colors = {
    Common: "text-gray-500",
    Uncommon: "text-green-500",
    Rare: "text-blue-500",
    Epic: "text-purple-500",
    Legendary: "text-yellow-500",
  };
  return colors[this.rarity] || "text-gray-500";
});

// Virtual for formatted date
achievementSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Ensure virtual fields are serialized
achievementSchema.set("toJSON", { virtuals: true });
achievementSchema.set("toObject", { virtuals: true });

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
