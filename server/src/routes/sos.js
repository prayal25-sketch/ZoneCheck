const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');
const auth = require('../middleware/auth');

router.post('/trigger', auth, sosController.triggerSOS);
router.put('/:id/resolve', auth, sosController.resolveSOS);
router.get('/active', auth, sosController.getActiveSOS); // For trusted contacts/responders

module.exports = router;
