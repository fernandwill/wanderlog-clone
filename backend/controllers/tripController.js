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
    const trips = await Trip.findAll({
      where: { userId: req.userId },
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
          limit: 1, // Only get one photo for preview
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ trips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const trip = await Trip.findOne({
      where: { 
        id,
        [Op.or]: [
          { userId: req.userId },
          { isPublic: true }
        ]
      },
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

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ trip });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
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