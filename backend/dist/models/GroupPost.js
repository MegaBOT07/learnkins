import mongoose from "mongoose";
const groupPostSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudyGroup",
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: [true, "Post title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  content: {
    type: String,
    required: [true, "Post content is required"],
    trim: true,
    maxlength: [5000, "Content cannot exceed 5000 characters"]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, "Tag cannot exceed 20 characters"]
  }],
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  replies: {
    type: Number,
    default: 0
  },
  replyItems: [{
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Reply cannot exceed 1000 characters"]
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
groupPostSchema.index({
  group: 1,
  createdAt: -1
});
groupPostSchema.index({
  group: 1,
  isPinned: -1,
  createdAt: -1
});
const GroupPost = mongoose.model("GroupPost", groupPostSchema);
export default GroupPost;