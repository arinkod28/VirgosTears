const { processChat } = require('../services/aiChat');
const db = require('../config/database');

/**
 * Send a message to the AI compliance bot
 */
async function sendMessage(req, res, next) {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'message and sessionId are required' });
    }

    const reply = await processChat(sessionId, message);
    res.json({ reply, sessionId });
  } catch (error) {
    next(error);
  }
}

/**
 * Get chat history for a session
 */
function getHistory(req, res) {
  const { sessionId } = req.params;
  const messages = db
    .prepare('SELECT role, content, created_at FROM chat_history WHERE session_id = ? ORDER BY created_at ASC')
    .all(sessionId);

  res.json({ sessionId, messages });
}

module.exports = { sendMessage, getHistory };
