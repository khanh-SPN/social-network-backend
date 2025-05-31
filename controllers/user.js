const { User, Follow, Notification, sequelize } = require('../models');
const { Sequelize, Op } = require('sequelize');

const getUser = async (req, res) => {
  try {
    console.log('getUser:', { userId: req.params.id });
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      console.log('getUser failed: User not found', { userId: req.params.id });
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }
    res.json(user);
  } catch (error) {
    console.error('Lỗi trong getUser:', error.message);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log('updateUser:', { userId: req.user.id, body: req.body, files: req.files });
    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.log('updateUser failed: User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }

    const { bio } = req.body;
    const profilePicture = req.files?.profilePicture ? `/uploads/${req.files.profilePicture[0].filename}` : null;
    const coverPicture = req.files?.coverPicture ? `/uploads/${req.files.coverPicture[0].filename}` : null;

    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;
    if (coverPicture) user.coverPicture = coverPicture;

    await user.save();
    console.log('updateUser success:', { userId: user.id });
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profileTag: user.profileTag,
      bio: user.bio,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
    });
  } catch (error) {
    console.error('Lỗi trong updateUser:', error.message);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

const followUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    console.log('followUser:', { userId: req.user.id, followingId: req.params.id });

    // Kiểm tra followingId hợp lệ
    const followingId = parseInt(req.params.id);
    if (isNaN(followingId)) {
      console.log('followUser failed: Invalid followingId', { followingId: req.params.id });
      await transaction.rollback();
      return res.status(400).json({ msg: 'ID người dùng không hợp lệ' });
    }

    // Kiểm tra user tồn tại
    const userToFollow = await User.findByPk(followingId, { transaction });
    if (!userToFollow) {
      console.log('followUser failed: User not found', { followingId });
      await transaction.rollback();
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }

    // Kiểm tra tự follow
    if (req.user.id === followingId) {
      console.log('followUser failed: Cannot follow self', { userId: req.user.id });
      await transaction.rollback();
      return res.status(400).json({ msg: 'Không thể tự follow' });
    }

    // Kiểm tra đã follow
    const existingFollow = await Follow.findOne({
      where: { followerId: req.user.id, followingId },
      transaction,
    });
    if (existingFollow) {
      console.log('followUser failed: Already following', { followerId: req.user.id, followingId });
      await transaction.rollback();
      return res.status(400).json({ msg: 'Bạn đã follow người dùng này' });
    }

    // Thêm follow
    const follow = await Follow.create({
      followerId: req.user.id,
      followingId,
    }, { transaction });
    console.log('Follow created:', { followerId: req.user.id, followingId });

    // Tạo notification
    try {
      await Notification.create({
        userId: followingId,
        type: 'follow',
        relatedUserId: req.user.id,
      }, { transaction });
      console.log('Notification created for follow:', { userId: followingId, relatedUserId: req.user.id });
    } catch (notificationError) {
      console.error('Lỗi tạo notification trong followUser:', notificationError.message);
    }

    await transaction.commit();
    res.json({ follow, followed: true });
  } catch (error) {
    console.error('Lỗi trong followUser:', error.message);
    await transaction.rollback();
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    console.log('unfollowUser:', { userId: req.user.id, followingId: req.params.id });
    const follow = await Follow.findOne({
      where: { followerId: req.user.id, followingId: req.params.id },
    });
    if (!follow) {
      console.log('unfollowUser failed: Follow not found', { followerId: req.user.id, followingId: req.params.id });
      return res.status(404).json({ msg: 'Không tìm thấy quan hệ follow' });
    }

    await follow.destroy();
    console.log('unfollowUser success:', { followerId: req.user.id, followingId: req.params.id });
    res.json({ msg: 'Bỏ follow thành công' });
  } catch (error) {
    console.error('Lỗi trong unfollowUser:', error.message);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    console.log('searchUsers:', { tag: req.query.tag });
    const { tag } = req.query;
    if (!tag) {
      console.log('searchUsers failed: Missing tag');
      return res.status(400).json({ msg: 'Yêu cầu profileTag' });
    }

    const users = await User.findAll({
      where: { profileTag: tag },
      attributes: { exclude: ['password'] },
    });
    console.log('searchUsers success:', { count: users.length });
    res.json(users);
  } catch (error) {
    console.error('Lỗi trong searchUsers:', error.message);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

const getSuggestions = async (req, res) => {
  try {
    console.log('getSuggestions:', { userId: req.user.id });
    const currentUserId = req.user.id;
    const followedUsers = await Follow.findAll({
      where: { followerId: currentUserId },
      attributes: ['followingId'],
    });

    const followedIds = followedUsers?.map(f => f.followingId) || [];
    console.log('Followed IDs:', followedIds);

    const suggestions = await User.findAll({
      where: {
        id: { [Op.notIn]: [...followedIds, currentUserId] },
      },
      attributes: ['id', 'username', 'profilePicture', 'profileTag'],
      limit: 10,
    });

    console.log('getSuggestions success:', { count: suggestions.length });
    res.json(suggestions);
  } catch (error) {
    console.error('Lỗi trong getSuggestions:', error.message);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    console.log('getFollowing:', { userId: req.params.id });
    const user = await User.findByPk(req.params.id);
    if (!user) {
      console.log('getFollowing failed: User not found', { userId: req.params.id });
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }

    const following = await Follow.findAll({
      where: { followerId: req.params.id },
      include: [{ model: User, as: 'Following', attributes: ['id', 'username', 'profilePicture', 'profileTag'] }],
    });

    console.log('getFollowing success:', { count: following.length });
    res.json(following.map(f => f.Following));
  } catch (error) {
    console.error('Lỗi trong getFollowing:', error.message);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    console.log('getFollowers:', { userId: req.params.id });
    const user = await User.findByPk(req.params.id);
    if (!user) {
      console.log('getFollowers failed: User not found', { userId: req.params.id });
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }

    const followers = await Follow.findAll({
      where: { followingId: req.params.id },
      include: [{ model: User, as: 'Follower', attributes: ['id', 'username', 'profilePicture', 'profileTag'] }],
    });

    console.log('getFollowers success:', { count: followers.length });
    res.json(followers.map(f => f.Follower));
  } catch (error) {
    console.error('Lỗi trong getFollowers:', error.message);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

module.exports = { getUser, updateUser, followUser, unfollowUser, searchUsers, getSuggestions, getFollowing, getFollowers };