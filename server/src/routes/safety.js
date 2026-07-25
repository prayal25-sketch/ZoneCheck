const express = require('express');
const router = express.Router();
const safetyController = require('../controllers/safetyController');
const auth = require('../middleware/auth'); // optional auth if we allow anonymous

// We can make auth optional or required depending on the use case
router.post('/report', safetyController.submitReport);
router.get('/reports', safetyController.getReports);
router.get('/zones', safetyController.getSafetyZones);

module.exports = router;
