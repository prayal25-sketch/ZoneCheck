const mongoose = require('mongoose');

const touristAlertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['flood', 'riot', 'storm', 'protest', 'outbreak', 'scam-surge'],
    required: true
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    radius: { type: Number, default: 5000 } // in meters
  },
  title: { type: String, required: true },
  description: { type: String },
  severity: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    required: true
  },
  source: {
    type: String,
    enum: ['government', 'community', 'ai-predicted'],
    required: true
  },
  issuedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

module.exports = mongoose.model('TouristAlert', touristAlertSchema);
