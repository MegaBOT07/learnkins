import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  college: { type: String },
  university: { type: String },
  
  internshipDomain: { type: String, required: true },
  internshipTitle: { type: String, required: true },
  duration: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  issueDate: { type: Date, required: true, default: Date.now },
  
  certificateNumber: { type: String },
  certificateId: { type: String, required: true, unique: true }, // e.g., LK-2026-INT-000001
  
  qrCodeUrl: { type: String },
  pdfUrl: { type: String },
  
  skillsLearned: { type: [String] },
  projectName: { type: String },
  mentorName: { type: String },
  grade: { type: String },
  remarks: { type: String },
  
  status: { 
    type: String, 
    enum: ['Valid', 'Revoked', 'Expired'], 
    default: 'Valid' 
  },
  verificationCount: { type: Number, default: 0 },
  lastVerifiedDate: { type: Date }
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
