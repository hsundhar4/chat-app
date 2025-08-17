const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const SECRET = 'your_jwt_secret';

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(500).send('Registration failed');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).send('Login failed');
  }
});

module.exports = router;
