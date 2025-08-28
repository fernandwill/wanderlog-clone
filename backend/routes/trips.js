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
const { validateTrip } = require('../middleware/validation');

router.use(authenticateToken);

router.post('/', validateTrip, createTrip);
router.get('/', getUserTrips);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

module.exports = router;