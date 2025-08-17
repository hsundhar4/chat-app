const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  room:      { type: String, required: true },
  user:      { type: String, required: true },
  text:      { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = {
  Message: mongoose.model('Message', messageSchema)
};

const authMiddleware = require('../middleware/authMiddleware');
router.post('/', authMiddleware, async (req, res) => {
  // Only authenticated users can post messages
});
