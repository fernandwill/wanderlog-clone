const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('Auth header:', authHeader);
    console.log('Extracted token:', token ? 'Present' : 'Missing');

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    console.log('Decoded token:', decoded);
    
    // Verify user still exists
    const user = await User.findByPk(decoded.userId);
    console.log('User found:', !!user, user ? user.id : 'none');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token', details: error.message });
  }
};

module.exports = {
  authenticateToken
};