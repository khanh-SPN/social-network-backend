const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');
const Like = require('./Like');
const Comment = require('./Comment');
const Follow = require('./Follow');
const Notification = require('./Notification');
const Conversation = require('./Conversation');
const Message = require('./Message');

const db = {
  User,
  Post,
  Like,
  Comment,
  Follow,
  Notification,
  Conversation,
  Message,
  sequelize,
  Sequelize,
};

// Thiết lập quan hệ
// User - Post
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

// User - Like
User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

// Post - Like
Post.hasMany(Like, { foreignKey: 'postId' });
Like.belongsTo(Post, { foreignKey: 'postId' });

// User - Comment
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// Post - Comment
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

// Comment - Like
Comment.hasMany(Like, { foreignKey: 'commentId' });
Like.belongsTo(Comment, { foreignKey: 'commentId' });

// User - Follow
User.belongsToMany(User, { as: 'Following', through: Follow, foreignKey: 'followerId', otherKey: 'followingId' });
User.belongsToMany(User, { as: 'Followers', through: Follow, foreignKey: 'followingId', otherKey: 'followerId' });
Follow.belongsTo(User, { as: 'Follower', foreignKey: 'followerId' });
Follow.belongsTo(User, { as: 'Following', foreignKey: 'followingId' });

// User - Notification
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Notification, { as: 'RelatedUser', foreignKey: 'relatedUserId' });
Notification.belongsTo(User, { as: 'RelatedUser', foreignKey: 'relatedUserId' });

// Post - Notification
Post.hasMany(Notification, { foreignKey: 'relatedPostId', as: 'Notifications' });
Notification.belongsTo(Post, { foreignKey: 'relatedPostId', as: 'relatedPost' });

// User - Conversation
User.hasMany(Conversation, { as: 'User1Conversations', foreignKey: 'user1_id' });
User.hasMany(Conversation, { as: 'User2Conversations', foreignKey: 'user2_id' });
Conversation.belongsTo(User, { as: 'User1', foreignKey: 'user1_id' });
Conversation.belongsTo(User, { as: 'User2', foreignKey: 'user2_id' });

// Conversation - Message
Conversation.hasMany(Message, { foreignKey: 'conversation_id' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });

// User - Message
User.hasMany(Message, { as: 'SentMessages', foreignKey: 'sender_id' });
User.hasMany(Message, { as: 'ReceivedMessages', foreignKey: 'recipient_id' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });
Message.belongsTo(User, { as: 'Recipient', foreignKey: 'recipient_id' });

module.exports = db;