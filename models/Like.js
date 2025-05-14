const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

const Like = sequelize.define('Like', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Post,
      key: 'id',
    },
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: Comment, key: 'id' },
  },
}, {
  timestamps: true,
});

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Post, { foreignKey: 'postId' });
Like.belongsTo(Comment, { foreignKey: 'commentId' });

module.exports = Like;