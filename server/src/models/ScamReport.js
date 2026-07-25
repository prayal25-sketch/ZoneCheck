const mongoose = require('mongoose');

const scamReportSchema = new mongoose.Schema({
  userId: { type: String, default: 'anonymous' },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  scamType: {
    type: String,
    enum: ['fake-taxi', 'overcharging', 'fake-guide', 'pickpocket', 'digital-fraud'],
    required: true
  },
  description: { type: String },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified'],
    default: 'pending'
  }
}, { timestamps: { createdAt: 'timestamp', updatedAt: false } });

module.exports = mongoose.model('ScamReport', scamReportSchema);
