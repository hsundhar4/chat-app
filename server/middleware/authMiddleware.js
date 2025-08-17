const jwt = require('jsonwebtoken');
const SECRET = 'your_jwt_secret';

module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
