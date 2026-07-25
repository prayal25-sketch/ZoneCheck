const SafetyReport = require('../models/SafetyReport');
const SafetyZone = require('../models/SafetyZone');

exports.submitReport = async (req, res) => {
  try {
    const { lat, lng, address, incidentType, severity, description } = req.body;
    const userId = req.user ? req.user.userId : 'anonymous';

    const newReport = new SafetyReport({
      userId,
      location: { lat, lng, address },
      incidentType,
      severity,
      description
    });

    await newReport.save();
    res.status(201).json({ message: 'Safety report submitted', report: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    // In a real app we would use geospatial queries to get nearby reports
    const reports = await SafetyReport.find().sort({ timestamp: -1 }).limit(50);
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSafetyZones = async (req, res) => {
  try {
    const zones = await SafetyZone.find();
    res.json(zones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
