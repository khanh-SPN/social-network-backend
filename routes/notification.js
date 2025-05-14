const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNotifications, markAsRead } = require('../controllers/notification');

router.get('/', auth, getNotifications);
router.put('/:id/read', auth, markAsRead);

module.exports = router;