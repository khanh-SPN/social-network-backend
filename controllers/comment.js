const { Comment, Like, Notification } = require('../models');

const likeComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    if (isNaN(commentId)) {
      return res.status(400).json({ msg: 'ID bình luận không hợp lệ' });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ msg: 'Bình luận không tồn tại' });
    }

    const existingLike = await Like.findOne({
      where: { commentId, userId: req.user.id },
    });

    if (existingLike) {
      await existingLike.destroy();
      await comment.decrement('likes', { by: 1 });
      return res.json({ likes: comment.likes - 1, liked: false });
    }

    await Like.create({
      userId: req.user.id,
      commentId,
    });
    await comment.increment('likes', { by: 1 });

    if (comment.userId !== req.user.id) {
      await Notification.create({
        userId: comment.userId,
        type: 'like_comment',
        relatedUserId: req.user.id,
        relatedCommentId: commentId,
      });
    }

    res.status(201).json({ likes: comment.likes + 1, liked: true });
  } catch (err) {
    console.error('Lỗi trong likeComment:', err.message, err.stack);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

module.exports = { likeComment };