const express = require('express');
const router = express.Router();
const { 
  searchPlaces, 
  createPlace, 
  getPlaceById, 
  updatePlace, 
  getNearbyPlaces 
} = require('../controllers/placeController');
const { authenticateToken } = require('../middleware/auth');
const { validatePlace } = require('../middleware/validation');

router.get('/search', searchPlaces);
router.get('/nearby', getNearbyPlaces);
router.get('/:id', getPlaceById);

router.use(authenticateToken);
router.post('/', validatePlace, createPlace);
router.put('/:id', updatePlace);

module.exports = router;