const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Itinerary = sequelize.define("Itinerary", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  day: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tripId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Trips',
      key: 'id'
    }
  },
  placeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Places',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'Itineraries' // Explicitly specify table name
});

module.exports = Itinerary;