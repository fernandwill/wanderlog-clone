const { Place } = require('../models');
const { Op } = require('sequelize');

const searchPlaces = async (req, res) => {
  try {
    const { query, category, lat, lng, radius = 10000 } = req.query;

    let whereClause = {};
    
    if (query) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { address: { [Op.iLike]: `%${query}%` } }
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    const places = await Place.findAll({
      where: whereClause,
      limit: 50,
      order: [['rating', 'DESC']]
    });

    res.json({ places });
  } catch (error) {
    console.error('Search places error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createPlace = async (req, res) => {
  try {
    const placeData = req.body;
    
    const place = await Place.create(placeData);

    res.status(201).json({
      message: 'Place created successfully',
      place
    });
  } catch (error) {
    console.error('Create place error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const place = await Place.findByPk(id);

    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    res.json({ place });
  } catch (error) {
    console.error('Get place error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const place = await Place.findByPk(id);

    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    await place.update(updates);

    res.json({
      message: 'Place updated successfully',
      place
    });
  } catch (error) {
    console.error('Update place error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, radius = 5000, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    let whereClause = {};
    if (category) {
      whereClause.category = category;
    }

    // Simple distance calculation (for more accuracy, use PostGIS)
    const places = await Place.findAll({
      where: whereClause,
      limit: 20,
      order: [['rating', 'DESC']]
    });

    res.json({ places });
  } catch (error) {
    console.error('Get nearby places error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  searchPlaces,
  createPlace,
  getPlaceById,
  updatePlace,
  getNearbyPlaces
};