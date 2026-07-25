const EmergencyContact = require('../models/EmergencyContact');

exports.getContactsByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const contacts = await EmergencyContact.find({ country: { $regex: new RegExp(country, 'i') } });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNearbyServices = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    // In a real app with geospatial indexes (2dsphere), we'd use $near operator
    // For this boilerplate, we'll just return some mock data or fetch all 
    
    // Example MongoDB geospatial query:
    // const services = await EmergencyContact.find({
    //   location: {
    //     $near: {
    //       $geometry: { type: "Point", coordinates: [lng, lat] },
    //       $maxDistance: 10000 // 10km
    //     }
    //   }
    // });
    
    // Return all contacts as fallback for now
    const services = await EmergencyContact.find();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOfflinePack = async (req, res) => {
  try {
    const { country } = req.query;
    const contacts = await EmergencyContact.find({ country: { $regex: new RegExp(country, 'i') }, isOfflineAvailable: true });
    // In a real scenario, this might download a bundled JSON/SQLite file
    res.json({ country, version: "1.0", data: contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
