const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');

const Notification = sequelize.define('Notification', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Notification.belongsTo(User, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'relatedUserId' });
Notification.belongsTo(Post, { foreignKey: 'relatedPostId' });

module.exports = Notification;