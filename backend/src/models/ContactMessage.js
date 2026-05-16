import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  category: {
    type: String,
    enum: ['general', 'technical', 'parental', 'billing', 'feedback'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  }
}, { timestamps: true });

export default mongoose.model('ContactMessage', contactMessageSchema);
