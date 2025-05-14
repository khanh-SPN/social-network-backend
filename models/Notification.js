const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('like', 'comment', 'recommend'),
    allowNull: false,
  },
  relatedUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  relatedPostId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Posts',
      key: 'id',
    },
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = Notification;