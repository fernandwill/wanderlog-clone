const User = require('./user');
const Trip = require('./trip');
const Place = require('./place');
const Itinerary = require('./itinerary');

// Define associations
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Trip.hasMany(Itinerary, { foreignKey: 'tripId', as: 'itineraries' });
Itinerary.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

Place.hasMany(Itinerary, { foreignKey: 'placeId', as: 'itineraries' });
Itinerary.belongsTo(Place, { foreignKey: 'placeId', as: 'place' });

module.exports = {
    User,
    Trip,
    Place,
    Itinerary
};

