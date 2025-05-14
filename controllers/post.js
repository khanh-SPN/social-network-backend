const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const User = require('../models/User');

const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      userId: req.user.id,
      content: req.body.content,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      posts: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.userId !== req.user.id) return res.status(403).json({ msg: 'Unauthorized' });

    await post.destroy();
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Bài viết không tồn tại' });

    const existingLike = await Like.findOne({
      where: { postId: req.params.id, userId: req.user.id },
    });

    if (existingLike) {
      // Unlike: Xóa like
      await existingLike.destroy();
      post.like = (post.like || 0) - 1;
      await post.save();
      return res.json({ like: post.like, liked: false });
    }

    // Like: Tạo like
    await Like.create({
      userId: req.user.id,
      postId: req.params.id,
    });
    post.like = (post.like || 0) + 1;
    await post.save();

    await Notification.create({
      userId: post.userId,
      type: 'like',
      relatedUserId: req.user.id,
      relatedPostId: req.params.id,
    });

    res.json({ like: post.like, liked: true });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

const commentPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Bài viết không tồn tại' });

    const comment = await Comment.create({
      userId: req.user.id,
      postId: req.params.id,
      content: req.body.content,
    });

    await Notification.create({
      userId: post.userId,
      type: 'comment',
      relatedUserId: req.user.id,
      relatedPostId: req.params.id,
    });

    // Lấy thông tin người dùng để trả về
    const user = await User.findByPk(req.user.id, {
      attributes: ['username', 'profilePicture'],
    });

    res.json({
      id: comment.id,
      userId: comment.userId,
      postId: comment.postId,
      content: comment.content,
      createdAt: comment.createdAt,
      likes: comment.likes || 0,
      username: user.username,
      userProfilePicture: user.profilePicture,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

const recommendPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    await Notification.create({
      userId: post.userId,
      type: 'recommend',
      relatedUserId: req.user.id,
      relatedPostId: req.params.id,
    });

    res.json({ msg: 'Post recommended' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { createPost, getPosts, deletePost, likePost, commentPost, recommendPost };