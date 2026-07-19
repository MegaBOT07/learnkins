import mongoose from "mongoose";
const verificationLogSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    ref: 'Certificate'
  },
  ipAddress: {
    type: String
  },
  browser: {
    type: String
  },
  device: {
    type: String
  },
  country: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
const VerificationLog = mongoose.model('VerificationLog', verificationLogSchema);
export default VerificationLog;