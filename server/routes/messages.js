const express = require('express');
const router = express.Router();
const { Message } = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Get messages by room (protected)
router.get('/:room', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Error fetching messages');
  }
});

// ✅ Post a new message (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { room, user, text } = req.body;
    const message = new Message({ room, user, text });
    const saved = await message.save();
    res.json(saved);
  } catch (err) {
    res.status(500).send('Error saving message');
  }
});

module.exports = router;
