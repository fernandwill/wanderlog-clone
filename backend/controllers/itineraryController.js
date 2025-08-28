const { Itinerary, Place, Trip } = require('../models');

const addToItinerary = async (req, res) => {
  try {
    const { tripId, placeId, day, date, startTime, endTime, notes, estimatedCost, transportMode, order } = req.body;

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId: req.userId }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const itinerary = await Itinerary.create({
      tripId,
      placeId,
      day,
      date,
      startTime,
      endTime,
      notes,
      estimatedCost,
      transportMode,
      order: order || 0
    });

    const itineraryWithPlace = await Itinerary.findByPk(itinerary.id, {
      include: [
        {
          model: Place,
          as: 'place'
        }
      ]
    });

    res.status(201).json({
      message: 'Added to itinerary successfully',
      itinerary: itineraryWithPlace
    });
  } catch (error) {
    console.error('Add to itinerary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const itinerary = await Itinerary.findByPk(id, {
      include: [
        {
          model: Trip,
          as: 'trip',
          where: { userId: req.userId }
        }
      ]
    });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary item not found' });
    }

    await itinerary.update(updates);

    const updatedItinerary = await Itinerary.findByPk(id, {
      include: [
        {
          model: Place,
          as: 'place'
        }
      ]
    });

    res.json({
      message: 'Itinerary updated successfully',
      itinerary: updatedItinerary
    });
  } catch (error) {
    console.error('Update itinerary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeFromItinerary = async (req, res) => {
  try {
    const { id } = req.params;

    const itinerary = await Itinerary.findByPk(id, {
      include: [
        {
          model: Trip,
          as: 'trip',
          where: { userId: req.userId }
        }
      ]
    });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary item not found' });
    }

    await itinerary.destroy();

    res.json({ message: 'Removed from itinerary successfully' });
  } catch (error) {
    console.error('Remove from itinerary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const reorderItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { items } = req.body; // Array of { id, order, day }

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId: req.userId }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Update order for each item
    const updatePromises = items.map(item => 
      Itinerary.update(
        { order: item.order, day: item.day },
        { where: { id: item.id, tripId } }
      )
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Itinerary reordered successfully' });
  } catch (error) {
    console.error('Reorder itinerary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addToItinerary,
  updateItinerary,
  removeFromItinerary,
  reorderItinerary
};