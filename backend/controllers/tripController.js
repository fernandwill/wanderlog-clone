const { Trip, Itinerary, Place, Photo } = require('../models');
const { Op } = require('sequelize');

const createTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate, destination, budget, isPublic } = req.body;
    
    const trip = await Trip.create({
      title,
      description,
      startDate,
      endDate,
      destination,
      budget,
      isPublic: isPublic || false,
      userId: req.userId
    });

    res.status(201).json({
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserTrips = async (req, res) => {
  try {
    console.log('Getting trips for user:', req.userId || 'unauthenticated');
    
    // Build where clause based on authentication status
    let whereClause;
    if (req.userId) {
      // User is authenticated - get their trips
      whereClause = { userId: req.userId };
    } else {
      // User is not authenticated - get only public trips
      whereClause = { isPublic: true };
    }
    
    const trips = await Trip.findAll({
      where: whereClause,
      include: [
        {
          model: Itinerary,
          as: 'itineraries',
          include: [
            {
              model: Place,
              as: 'place'
            }
          ]
        },
        {
          model: Photo,
          as: 'photos',
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`Found ${trips.length} trips for ${req.userId ? 'authenticated user' : 'public access'}`);

    // Limit photos to 1 for preview purposes
    const tripsWithLimitedPhotos = trips.map(trip => {
      const tripObj = trip.toJSON();
      if (tripObj.photos && tripObj.photos.length > 1) {
        tripObj.photos = [tripObj.photos[0]];
      }
      return tripObj;
    });

    res.json({ trips: tripsWithLimitedPhotos });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting trip by ID:', id);
    console.log('User ID from token:', req.userId || 'No auth token');
    
    // Build where clause based on authentication status
    let whereClause;
    if (req.userId) {
      // User is authenticated - can see their own trips or public trips
      whereClause = {
        id,
        [Op.or]: [
          { userId: req.userId },
          { isPublic: true }
        ]
      };
    } else {
      // User is not authenticated - can only see public trips
      whereClause = {
        id,
        isPublic: true
      };
    }
    
    const trip = await Trip.findOne({
      where: whereClause,
      include: [
        {
          model: Itinerary,
          as: 'itineraries',
          include: [
            {
              model: Place,
              as: 'place'
            }
          ],
          order: [['day', 'ASC'], ['order', 'ASC']]
        },
        {
          model: Photo,
          as: 'photos',
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    console.log('Trip found:', !!trip);
    if (trip) {
      console.log('Trip details:', {
        id: trip.id,
        title: trip.title,
        userId: trip.userId,
        isPublic: trip.isPublic,
        itinerariesCount: trip.itineraries?.length || 0
      });
    }

    if (!trip) {
      console.log('Trip not found for ID:', id, 'userId:', req.userId || 'unauthenticated');
      return res.status(404).json({ error: 'Trip not found or not accessible' });
    }

    res.json({ trip });
  } catch (error) {
    console.error('Get trip error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const trip = await Trip.findOne({
      where: { id, userId: req.userId }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    await trip.update(updates);

    res.json({
      message: 'Trip updated successfully',
      trip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findOne({
      where: { id, userId: req.userId }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    await trip.destroy();

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip
};