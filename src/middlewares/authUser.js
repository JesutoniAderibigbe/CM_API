const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const JWT_SECRET = 'facebook';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(403).json({ message: 'Invalid authentication credentials' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authentication credentials' });
  }
};

const generateAuthToken = (userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  return token;
};

module.exports = {authMiddleware, generateAuthToken};
