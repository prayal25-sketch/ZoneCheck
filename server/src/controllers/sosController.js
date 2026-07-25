const SOSAlert = require('../models/SOSAlert');

exports.triggerSOS = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    // In real app, we might also generate a live tracking URL using a unique short id
    const newAlert = new SOSAlert({
      userId: req.user.userId,
      location: { lat, lng },
      status: 'active',
      liveTrackUrl: `https://zonecheck.app/track/${req.user.userId}`
    });

    await newAlert.save();

    // Triggering WebSocket event will be handled by the client directly or here via a service

    res.status(201).json({ message: 'SOS Triggered Successfully', alert: newAlert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error triggering SOS' });
  }
};

exports.resolveSOS = async (req, res) => {
  try {
    const alert = await SOSAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    
    if (alert.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to resolve this alert' });
    }

    alert.status = 'resolved';
    alert.resolvedAt = Date.now();
    await alert.save();

    res.json({ message: 'SOS Resolved', alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActiveSOS = async (req, res) => {
  try {
    const alerts = await SOSAlert.find({ status: 'active' }).populate('userId', 'name phone');
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
