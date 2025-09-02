const User = require('./user');
const Trip = require('./trip');
const Place = require('./place');
const Itinerary = require('./itinerary');
const Photo = require('./photo');

// Define associations
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Trip.hasMany(Itinerary, { foreignKey: 'tripId', as: 'itineraries' });
Itinerary.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

Place.hasMany(Itinerary, { foreignKey: 'placeId', as: 'itineraries' });
Itinerary.belongsTo(Place, { foreignKey: 'placeId', as: 'place' });

// Photo associations
Trip.hasMany(Photo, { foreignKey: 'tripId', as: 'photos' });
Photo.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

User.hasMany(Photo, { foreignKey: 'uploadedBy', as: 'photos' });
Photo.belongsTo(User, { foreignKey: 'uploadedBy', as: 'user' });

module.exports = {
    User,
    Trip,
    Place,
    Itinerary,
    Photo
};

