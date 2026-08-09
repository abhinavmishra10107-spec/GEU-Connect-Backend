const ChatMessage = require("../models/ChatMessage");

/** Fetch recent history for a room; live messages arrive over Socket.IO. */
async function history(req, res) {
  const { room } = req.params;
  const messages = await ChatMessage.find({ room }).sort({ createdAt: 1 }).limit(200);
  res.json(messages);
}

module.exports = { history };
