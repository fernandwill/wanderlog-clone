const express = require('express');
const router = express.Router();
const { 
  generateTripSuggestions, 
  optimizeRoute, 
  acceptSuggestion, 
  rejectSuggestion 
} = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/trips/:tripId/suggestions', generateTripSuggestions);
router.post('/trips/:tripId/optimize', optimizeRoute);
router.put('/suggestions/:id/accept', acceptSuggestion);
router.put('/suggestions/:id/reject', rejectSuggestion);

module.exports = router;