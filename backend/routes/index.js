const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const tripRoutes = require('./trips');
const placeRoutes = require('./places');
const itineraryRoutes = require('./itinerary');
const photoRoutes = require('./photos');

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Wanderlog Clone API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            trips: '/api/trips',
            places: '/api/places',
            itinerary: '/api/itinerary',
            photos: '/api/photos'
        }
    });
});

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/places', placeRoutes);
router.use('/itinerary', itineraryRoutes);
router.use('/photos', photoRoutes);

module.exports = router;

