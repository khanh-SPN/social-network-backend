const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');
const Like = require('./Like');
const Comment = require('./Comment');
const Follow = require('./Follow');
const Notification = require('./Notification');

const db = {
  User,
  Post,
  Like,
  Comment,
  Follow,
  Notification,
  sequelize,
  Sequelize,
};

// Thiết lập quan hệ
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Like, { foreignKey: 'postId' });
Like.belongsTo(Post, { foreignKey: 'postId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

User.belongsToMany(User, { as: 'follower', through: Follow, foreignKey: 'followingId' });
User.belongsToMany(User, { as: 'following', through: Follow, foreignKey: 'followerId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Notification, { as: 'relatedUser', foreignKey: 'relatedUserId' });
Notification.belongsTo(User, { as: 'relatedUser', foreignKey: 'relatedUserId' });
Post.hasMany(Notification, { foreignKey: 'relatedPostId' });
Notification.belongsTo(Post, { foreignKey: 'relatedPostId' });

module.exports = db;