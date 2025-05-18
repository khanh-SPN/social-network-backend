const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, messageController.getMessages);
router.post('/', authMiddleware, messageController.sendMessage);
router.get('/conversations', authMiddleware, messageController.getConversations);

module.exports = router;