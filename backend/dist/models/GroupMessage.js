import mongoose from "mongoose";
const groupMessageSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudyGroup",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: [true, "Message content is required"],
    trim: true,
    maxlength: [2000, "Message cannot exceed 2000 characters"]
  },
  attachments: [{
    url: String,
    type: {
      type: String,
      enum: ["image", "file", "link"]
    },
    name: String
  }]
}, {
  timestamps: true
});
groupMessageSchema.index({
  group: 1,
  createdAt: -1
});
const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);
export default GroupMessage;