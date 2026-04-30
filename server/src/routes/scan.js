const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

// POST /api/scan/run — trigger a full scan of all 6 controls
router.post('/run', scanController.runScan);

// GET /api/scan/latest — get latest snapshot for each control
router.get('/latest', scanController.getLatest);

// GET /api/scan/stats — get dashboard summary stats
router.get('/stats', scanController.getStats);

// GET /api/scan/history/:controlId — get scan history for a specific control
router.get('/history/:controlId', scanController.getHistory);

module.exports = router;
