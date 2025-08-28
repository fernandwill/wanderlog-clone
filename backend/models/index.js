const User = require('./user');
const Trip = require('./trip');
const Place = require('./place');
const Itinerary = require('./itinerary');
const AISuggestion = require('./aiSuggestion');

// Define associations
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Trip.hasMany(Itinerary, { foreignKey: 'tripId', as: 'itineraries' });
Itinerary.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

Place.hasMany(Itinerary, { foreignKey: 'placeId', as: 'itineraries' });
Itinerary.belongsTo(Place, { foreignKey: 'placeId', as: 'place' });

Trip.hasMany(AISuggestion, { foreignKey: 'tripId', as: 'aiSuggestions' });
AISuggestion.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

User.hasMany(AISuggestion, { foreignKey: 'userId', as: 'aiSuggestions' });
AISuggestion.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
    User,
    Trip,
    Place,
    Itinerary,
    AISuggestion
};

