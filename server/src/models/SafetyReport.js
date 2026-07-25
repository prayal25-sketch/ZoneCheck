const mongoose = require('mongoose');

const safetyReportSchema = new mongoose.Schema({
  userId: { type: String, default: 'anonymous' }, // String to support anonymous, or ObjectId if linked
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  incidentType: {
    type: String,
    enum: ['theft', 'harassment', 'scam', 'assault', 'accident', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  description: { type: String },
  media: [{ type: String }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  upvotes: { type: Number, default: 0 },
  tags: [{ type: String }]
}, { timestamps: { createdAt: 'timestamp', updatedAt: false } });

module.exports = mongoose.model('SafetyReport', safetyReportSchema);
