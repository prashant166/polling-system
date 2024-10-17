const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Poll = sequelize.define('Poll', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
}, {
  tableName: 'Polls',
  timestamps: true,  // Adds createdAt and updatedAt fields automatically
});

module.exports = Poll;
