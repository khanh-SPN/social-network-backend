const { Notification, User, Post } = require('../models');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Notification.findAndCountAll({
      where: { userId },
      include: [
        { model: User, as: 'RelatedUser', attributes: ['id', 'username', 'profilePicture'] },
        { model: Post, as: 'relatedPost', attributes: ['id', 'content'] },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      notifications: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Thông báo không tồn tại' });
    if (notification.userId !== req.user.id) return res.status(403).json({ msg: 'Không có quyền' });

    notification.isRead = true;
    await notification.save();
    res.json({ msg: 'Đã đánh dấu là đã đọc' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

module.exports = { getNotifications, markAsRead };