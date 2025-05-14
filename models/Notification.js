const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');

const Notification = sequelize.define('Notification', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  type: {
    type: DataTypes.ENUM('like', 'comment', 'recommend'),
    allowNull: false,
  },
  relatedUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  relatedPostId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: Post, key: 'id' },
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, { timestamps: true });

Notification.belongsTo(User, { as: 'RelatedUser', foreignKey: 'relatedUserId' });
Notification.belongsTo(Post, { as: 'relatedPost', foreignKey: 'relatedPostId' });
Notification.belongsTo(User, { foreignKey: 'userId' });


module.exports = Notification;