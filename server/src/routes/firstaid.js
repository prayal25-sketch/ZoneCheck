const express = require('express');
const router = express.Router();
const firstaidController = require('../controllers/firstaidController');

router.get('/guides', firstaidController.getAllGuides);
router.get('/guide/:type', firstaidController.getGuideByType);
router.get('/offline-pack', firstaidController.getOfflinePack);

module.exports = router;
