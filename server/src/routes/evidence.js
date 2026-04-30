const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');

// GET /api/evidence/:controlId — fetch live evidence from Azure for a control
router.get('/:controlId', evidenceController.getEvidence);

// GET /api/evidence/:controlId/verify/:hash — verify a stored evidence hash
router.get('/:controlId/verify/:hash', evidenceController.verifyEvidence);

module.exports = router;
