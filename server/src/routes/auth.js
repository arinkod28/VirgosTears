const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/connect — test Azure connection with provided credentials
router.post('/connect', authController.testConnection);

// GET /api/auth/status — check if Azure is currently connected
router.get('/status', authController.getStatus);

module.exports = router;
