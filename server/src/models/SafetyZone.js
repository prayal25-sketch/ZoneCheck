const mongoose = require('mongoose');

const safetyZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  polygon: [{
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }],
  safetyScore: { type: Number, default: 100 },
  riskLevel: {
    type: String,
    enum: ['safe', 'moderate', 'high', 'critical'],
    default: 'safe'
  },
  timeRisk: {
    day: { type: String, enum: ['low', 'moderate', 'high', 'critical'], default: 'low' },
    night: { type: String, enum: ['low', 'moderate', 'high', 'critical'], default: 'moderate' }
  },
  crimeRate: { type: Number, default: 0.0 },
  lastUpdated: { type: Date, default: Date.now },
  tags: [{ type: String }]
});

module.exports = mongoose.model('SafetyZone', safetyZoneSchema);
