import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'notes', 'worksheet', 'presentation'],
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
  grade: {
    type: String,
    enum: ['6th', '7th', '8th'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  fileSize: Number,
  duration: String, // for videos
  downloadCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
materialSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Increment download count
materialSchema.methods.incrementDownload = async function() {
  this.downloadCount += 1;
  await this.save();
};

export default mongoose.model('Material', materialSchema);