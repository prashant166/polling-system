const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Poll = require('./poll');

const PollOption = sequelize.define('PollOption', {
  poll_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Poll,
      key: 'id',
    },
  },
  option_text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  votes_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'PollOptions',  
  timestamps: true,  
});

// Associations
Poll.hasMany(PollOption, { foreignKey: 'poll_id', as: 'PollOptions' });
PollOption.belongsTo(Poll, { foreignKey: 'poll_id' });

module.exports = PollOption;
