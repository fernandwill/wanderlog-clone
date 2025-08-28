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
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  transportMode: {
    type: DataTypes.ENUM('walking', 'driving', 'transit', 'cycling'),
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
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
  timestamps: true
});

module.exports = Itinerary;