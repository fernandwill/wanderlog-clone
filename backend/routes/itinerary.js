const express = require('express');
const router = express.Router();
const { 
  addToItinerary, 
  updateItinerary, 
  removeFromItinerary, 
  reorderItinerary 
} = require('../controllers/itineraryController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', addToItinerary);
router.put('/:id', updateItinerary);
router.delete('/:id', removeFromItinerary);
router.put('/trips/:tripId/reorder', reorderItinerary);

module.exports = router;