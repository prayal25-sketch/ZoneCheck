const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String },
  city: { type: String },
  category: {
    type: String,
    enum: ['police', 'ambulance', 'fire', 'women', 'tourist', 'cyber', 'disaster'],
    required: true
  },
  name: { type: String, required: true },
  number: { type: String, required: true },
  isOfflineAvailable: { type: Boolean, default: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  }
});

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
