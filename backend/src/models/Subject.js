import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  topics: [{
    type: String,
    required: true
  }],
  videoUrl: String,
  materials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  }],
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  order: {
    type: Number,
    required: true
  }
});

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    enum: ['6th', '7th', '8th'],
    required: true
  },
  chapters: [chapterSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update total students count
subjectSchema.methods.updateStudentCount = async function() {
  const Progress = mongoose.model('Progress');
  const count = await Progress.countDocuments({ 
    subject: this.slug,
    progress: { $gt: 0 }
  });
  this.totalStudents = count;
  await this.save();
};

export default mongoose.model('Subject', subjectSchema);