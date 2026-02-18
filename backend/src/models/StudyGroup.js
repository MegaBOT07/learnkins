import mongoose from "mongoose";

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      maxlength: [100, "Group name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    subject: {
      type: String,
      enum: [
        "mathematics",
        "science",
        "english",
        "social-science",
        "computer-science",
        "art-craft",
      ],
      required: [true, "Subject is required"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    memberCount: {
      type: Number,
      default: 1,
    },
    maxMembers: {
      type: Number,
      default: 10,
      min: [2, "Minimum 2 members required"],
      max: [50, "Maximum 50 members allowed"],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    activityLevel: {
      type: String,
      enum: ["Low", "Moderate", "Active", "Very Active"],
      default: "Moderate",
    },
    rules: [
      {
        type: String,
        trim: true,
        maxlength: [200, "Rule cannot exceed 200 characters"],
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [20, "Tag cannot exceed 20 characters"],
      },
    ],
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
studyGroupSchema.index({ subject: 1, createdAt: -1 });
studyGroupSchema.index({ creator: 1, createdAt: -1 });
studyGroupSchema.index({ isActive: 1, memberCount: -1 });

// Virtual for member count
studyGroupSchema.virtual("availableSpots").get(function () {
  return this.maxMembers - this.memberCount;
});

// Virtual for formatted date
studyGroupSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Ensure virtual fields are serialized
studyGroupSchema.set("toJSON", { virtuals: true });
studyGroupSchema.set("toObject", { virtuals: true });

const StudyGroup = mongoose.model("StudyGroup", studyGroupSchema);

export default StudyGroup;
