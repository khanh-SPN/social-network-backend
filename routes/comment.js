const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { likeComment } = require('../controllers/comment');

router.post('/:id/like', auth, likeComment);

module.exports = router;