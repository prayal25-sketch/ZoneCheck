const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

router.get('/contacts/:country', emergencyController.getContactsByCountry);
router.get('/nearby', emergencyController.getNearbyServices);
router.get('/offline-pack', emergencyController.getOfflinePack);

module.exports = router;
