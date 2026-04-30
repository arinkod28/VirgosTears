const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST /api/chat — send a message to the AI compliance bot
router.post('/', chatController.sendMessage);

// GET /api/chat/history/:sessionId — get chat history for a session
router.get('/history/:sessionId', chatController.getHistory);

module.exports = router;
