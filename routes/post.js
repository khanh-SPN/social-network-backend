const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createPost, getPosts, deletePost, likePost, commentPost, recommendPost } = require('../controllers/post');
const { body, validationResult } = require('express-validator');

router.post('/', auth, upload.single('image'), [
  body('content').notEmpty().withMessage('Content is required'),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, createPost);

router.get('/', getPosts);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/comment', auth, [
  body('content').notEmpty().withMessage('Comment content is required'),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, commentPost);
router.post('/:id/recommend', auth, recommendPost);

module.exports = router;