const { Notification, User, Post } = require('../models');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ msg: 'Không có quyền truy cập' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (page < 1 || limit < 1) {
      return res.status(400).json({ msg: 'Trang và giới hạn phải lớn hơn 0' });
    }
    const offset = (page - 1) * limit;

    const { count, rows } = await Notification.findAndCountAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'RelatedUser',
          attributes: ['id', 'username', 'profilePicture'],
          required: false,
        },
        {
          model: Post,
          as: 'relatedPost',
          attributes: ['id', 'content'],
          required: false,
        },
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
    console.error('Lỗi trong getNotifications:', err.message, err.stack);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    if (isNaN(notificationId)) {
      return res.status(400).json({ msg: 'ID thông báo không hợp lệ' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ msg: 'Không có quyền truy cập' });
    }

    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ msg: 'Thông báo không tồn tại' });
    }
    if (notification.userId !== userId) {
      return res.status(403).json({ msg: 'Không có quyền truy cập thông báo này' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ msg: 'Thông báo đã được đánh dấu là đã đọc' });
  } catch (err) {
    console.error('Lỗi trong markAsRead:', err.message, err.stack);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

module.exports = { getNotifications, markAsRead };