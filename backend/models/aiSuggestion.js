const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AISuggestion = sequelize.define("AISuggestion", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('place', 'route', 'activity', 'restaurant', 'optimization'),
    allowNull: false,
  },
  suggestion: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  reasoning: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  confidence: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 1
    }
  },
  isAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: null,
  },
  tripId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Trips',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = AISuggestion;