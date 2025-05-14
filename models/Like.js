const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Like = sequelize.define('Like', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Posts',
      key: 'id',
    },
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Comments',
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

module.exports = Like;