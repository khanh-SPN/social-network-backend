const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const User = require('../models/User');

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ msg: 'Nội dung bài viết là bắt buộc' });

    const post = await Post.create({
      userId: req.user.id,
      content,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Lỗi trong createPost:', err.message, err.stack);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (page < 1 || limit < 1) {
      return res.status(400).json({ msg: 'Trang và giới hạn phải lớn hơn 0' });
    }
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profilePicture', 'profileTag'],
          required: false, // LEFT JOIN để tránh lỗi nếu User không tồn tại
        },
      ],
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
    console.error('Lỗi trong getPosts:', err.message, err.stack);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ msg: 'ID bài viết không hợp lệ' });

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ msg: 'Bài viết không tồn tại' });
    if (post.userId !== req.user.id) return res.status(403).json({ msg: 'Không có quyền xóa' });

    await post.destroy();
    res.json({ msg: 'Bài viết đã được xóa' });
  } catch (err) {
    console.error('Lỗi trong deletePost:', err.message, err.stack);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ msg: 'ID bài viết không hợp lệ' });

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ msg: 'Bài viết không tồn tại' });

    const existingLike = await Like.findOne({
      where: { postId, userId: req.user.id },
    });

    if (existingLike) {
      await existingLike.destroy();
      post.likes -= 1;
      await post.save();
      return res.json({ likes: post.likes, liked: false });
    }

    await Like.create({
      userId: req.user.id,
      postId,
    });
    post.likes += 1;
    await post.save();

    if (post.userId !== req.user.id) {
      await Notification.create({
        userId: post.userId,
        type: 'like',
        relatedUserId: req.user.id,
        relatedPostId: postId,
      });
    }

    res.json({ likes: post.likes, liked: true });
  } catch (err) {
    console.error('Lỗi trong likePost:', err.message, err.stack);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = parseInt(req.params.id);
    if (!content) return res.status(400).json({ msg: 'Nội dung bình luận là bắt buộc' });
    if (isNaN(postId)) return res.status(400).json({ msg: 'ID bài viết không hợp lệ' });

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ msg: 'Bài viết không tồn tại' });

    const comment = await Comment.create({
      userId: req.user.id,
      postId,
      content,
    });

    if (post.userId !== req.user.id) {
      await Notification.create({
        userId: post.userId,
        type: 'comment',
        relatedUserId: req.user.id,
        relatedPostId: postId,
      });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'profilePicture', 'profileTag'],
    });

    res.status(201).json({
      id: comment.id,
      userId: comment.userId,
      postId: comment.postId,
      content: comment.content,
      createdAt: comment.createdAt,
      likes: comment.likes,
      username: user.username,
      profilePicture: user.profilePicture,
      profileTag: user.profileTag,
    });
  } catch (err) {
    console.error('Lỗi trong commentPost:', err.message, err.stack);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

const recommendPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ msg: 'ID bài viết không hợp lệ' });

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ msg: 'Bài viết không tồn tại' });

    if (post.userId !== req.user.id) {
      await Notification.create({
        userId: post.userId,
        type: 'recommend',
        relatedUserId: req.user.id,
        relatedPostId: postId,
      });
    }

    res.json({ msg: 'Bài viết đã được đề xuất' });
  } catch (err) {
    console.error('Lỗi trong recommendPost:', err.message, err.stack);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

const getLikes = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ msg: 'ID bài viết không hợp lệ' });

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ msg: 'Bài viết không tồn tại' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (page < 1 || limit < 1) {
      return res.status(400).json({ msg: 'Trang và giới hạn phải lớn hơn 0' });
    }
    const offset = (page - 1) * limit;

    const { count, rows } = await Like.findAndCountAll({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profilePicture', 'profileTag'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      likes: rows.map(like => ({
        id: like.id,
        userId: like.userId,
        postId: like.postId,
        createdAt: like.createdAt,
        username: like.User.username,
        profilePicture: like.User.profilePicture,
        profileTag: like.User.profileTag,
      })),
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Lỗi trong getLikes:', err.message, err.stack);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ msg: 'ID bài viết không hợp lệ' });

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ msg: 'Bài viết không tồn tại' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (page < 1 || limit < 1) {
      return res.status(400).json({ msg: 'Trang và giới hạn phải lớn hơn 0' });
    }
    const offset = (page - 1) * limit;

    const { count, rows } = await Comment.findAndCountAll({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profilePicture', 'profileTag'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      comments: rows.map(comment => ({
        id: comment.id,
        userId: comment.userId,
        postId: comment.postId,
        content: comment.content,
        createdAt: comment.createdAt,
        likes: comment.likes,
        username: comment.User.username,
        profilePicture: comment.User.profilePicture,
        profileTag: comment.User.profileTag,
      })),
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Lỗi trong getComments:', err.message, err.stack);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  likePost,
  commentPost,
  recommendPost,
  getLikes,
  getComments,
};