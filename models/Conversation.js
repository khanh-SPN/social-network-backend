const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  user2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'conversations',
  indexes: [
    {
      unique: true,
      fields: ['user1_id', 'user2_id'],
    },
  ],
});

// Đảm bảo user1_id < user2_id
Conversation.addHook('beforeValidate', (conversation) => {
  if (conversation.user1_id > conversation.user2_id) {
    [conversation.user1_id, conversation.user2_id] = [conversation.user2_id, conversation.user1_id];
  }
});

module.exports = Conversation;