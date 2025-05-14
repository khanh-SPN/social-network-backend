const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Follow = sequelize.define('Follow', {
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

User.belongsToMany(User, { as: 'follower', through: Follow, foreignKey: 'followingId' });
User.belongsToMany(User, { as: 'following', through: Follow, foreignKey: 'followerId' });

module.exports = Follow;