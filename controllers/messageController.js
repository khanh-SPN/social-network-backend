const { Op } = require('sequelize');
const { Conversation, Message, User } = require('../models');

// Hàm chung để tìm hoặc tạo cuộc trò chuyện
const findOrCreateConversation = async (userId, recipientId) => {
  console.log(`findOrCreateConversation: userId=${userId}, recipientId=${recipientId}`);
  
  if (userId === parseInt(recipientId)) {
    console.log('Error: Cannot create conversation with self');
    throw new Error('Không thể tạo cuộc trò chuyện với chính mình');
  }

  console.log('Querying conversations table...');
  // Tìm cuộc trò chuyện trong bảng conversations
  const conversation = await Conversation.findOne({
    where: {
      [Op.or]: [
        { user1_id: userId, user2_id: recipientId },
        { user1_id: recipientId, user2_id: userId },
      ],
    },
  });

  if (conversation) {
    console.log(`Conversation found: id=${conversation.id}`);
    return conversation;
  }

  console.log('No conversation found, creating new one...');
  // Tạo cuộc trò chuyện mới nếu chưa tồn tại
  const newConversation = await Conversation.create({
    user1_id: Math.min(userId, parseInt(recipientId)),
    user2_id: Math.max(userId, parseInt(recipientId)),
  });
  console.log(`New conversation created: id=${newConversation.id}`);
  
  return newConversation;
};

exports.getMessages = async (req, res) => {
  const { recipientId, page = 1, limit = 20 } = req.query;
  const userId = req.user.id;
  console.log(`getMessages: userId=${userId}, recipientId=${recipientId}, page=${page}, limit=${limit}`);

  try {
    if (!recipientId) {
      console.log('Error: recipientId is required');
      return res.status(400).json({ msg: 'recipientId là bắt buộc' });
    }

    if (userId === parseInt(recipientId)) {
      console.log('Error: Cannot get messages with self');
      return res.status(400).json({ msg: 'Không thể lấy tin nhắn với chính mình' });
    }

    // Tìm hoặc tạo cuộc trò chuyện
    console.log('Calling findOrCreateConversation...');
    const conversation = await findOrCreateConversation(userId, recipientId);

    // Lấy tin nhắn
    console.log(`Fetching messages for conversation_id=${conversation.id}`);
    const offset = (page - 1) * limit;
    const { count, rows } = await Message.findAndCountAll({
      where: { conversation_id: conversation.id },
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'username', 'profilePicture'] },
        { model: User, as: 'Recipient', attributes: ['id', 'username', 'profilePicture'] },
      ],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset,
    });
    console.log(`Found ${count} messages, returning ${rows.length} messages for page ${page}`);

    res.json({
      messages: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(`getMessages error: ${error.message}`, error);
    res.status(500).json({ msg: error.message || 'Lỗi server' });
  }
};

exports.sendMessage = async (req, res) => {
  const { recipientId, content } = req.body;
  const userId = req.user.id;
  console.log(`sendMessage: userId=${userId}, recipientId=${recipientId}, content=${content}`);

  try {
    if (!recipientId || !content) {
      console.log('Error: recipientId and content are required');
      return res.status(400).json({ msg: 'recipientId và content là bắt buộc' });
    }

    if (userId === parseInt(recipientId)) {
      console.log('Error: Cannot send message to self');
      return res.status(400).json({ msg: 'Không thể gửi tin nhắn cho chính mình' });
    }

    // Kiểm tra người nhận tồn tại
    console.log(`Checking if recipientId=${recipientId} exists...`);
    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
      console.log('Error: Recipient not found');
      return res.status(404).json({ msg: 'Người nhận không tồn tại' });
    }

    // Tìm hoặc tạo cuộc trò chuyện
    console.log('Calling findOrCreateConversation...');
    const conversation = await findOrCreateConversation(userId, recipientId);

    // Tạo tin nhắn
    console.log(`Creating message for conversation_id=${conversation.id}`);
    const message = await Message.create({
      conversation_id: conversation.id,
      sender_id: userId,
      recipient_id: parseInt(recipientId),
      content,
    });
    console.log(`Message created: id=${message.id}`);

    res.status(201).json(message);
  } catch (error) {
    console.error(`sendMessage error: ${error.message}`, error);
    res.status(500).json({ msg: error.message || 'Lỗi server' });
  }
};

exports.getConversations = async (req, res) => {
  const userId = req.user.id;
  console.log(`getConversations: userId=${userId}`);

  try {
    console.log('Fetching all conversations for user...');
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ user1_id: userId }, { user2_id: userId }],
      },
      include: [
        { model: User, as: 'User1', attributes: ['id', 'username', 'profilePicture'] },
        { model: User, as: 'User2', attributes: ['id', 'username', 'profilePicture'] },
      ],
      order: [['updatedAt', 'DESC']],
    });
    console.log(`Found ${conversations.length} conversations`);

    console.log('Fetching last message for each conversation...');
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({
          where: { conversation_id: conv.id },
          order: [['createdAt', 'DESC']],
        });
        console.log(`Conversation id=${conv.id}, lastMessage=${lastMessage ? lastMessage.content : 'none'}`);
        return {
          id: conv.id,
          user: conv.user1_id === userId ? conv.User2 : conv.User1,
          lastMessage: lastMessage ? lastMessage.content : null,
          lastMessageTime: lastMessage ? lastMessage.createdAt : conv.updatedAt,
        };
      })
    );

    res.json(conversationsWithLastMessage);
  } catch (error) {
    console.error(`getConversations error: ${error.message}`, error);
    res.status(500).json({ msg: error.message || 'Lỗi server' });
  }
};