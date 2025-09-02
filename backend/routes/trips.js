const express = require('express');
const router = express.Router();
const { 
  createTrip, 
  getUserTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip 
} = require('../controllers/tripController');
const { authenticateToken } = require('../middleware/auth');

// Optional authentication middleware - sets req.userId if token is valid, but doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const jwt = require('jsonwebtoken');
      const { User } = require('../models');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findByPk(decoded.userId);
      
      if (user) {
        req.userId = decoded.userId;
      }
    }
    
    next();
  } catch (error) {
    // If token is invalid, just continue without setting userId
    next();
  }
};
const { validateTrip } = require('../middleware/validation');

// Apply auth to all routes except public trip viewing
router.post('/', authenticateToken, validateTrip, createTrip);
router.get('/', optionalAuth, getUserTrips); // Allow public access to get public trips
router.get('/:id', optionalAuth, getTripById); // Allow public access to individual trips
router.put('/:id', authenticateToken, updateTrip);
router.delete('/:id', authenticateToken, deleteTrip);

module.exports = router;