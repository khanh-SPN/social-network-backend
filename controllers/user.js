const User = require('../models/User');
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');
const { Sequelize, Op } = require('sequelize');

const getUser = async (req, res) => {
  try {
    console.log('==============USER=======')
 
   console.log('=====================')
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const { bio } = req.body;
    if (bio) user.bio = bio;
    if (req.file) user.profilePicture = `/uploads/${req.file.filename}`;
    if (req.file && req.body.coverPicture) user.coverPicture = `/uploads/${req.file.filename}`;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findByPk(req.params.id);
    if (!userToFollow) return res.status(404).json({ msg: 'Người dùng không tồn tại' });

    if (req.user.id === parseInt(req.params.id)) {
      return res.status(400).json({ msg: 'Không thể tự theo dõi' });
    }

    const existingFollow = await Follow.findOne({
      where: { followerId: req.user.id, followingId: req.params.id },
    });

    if (existingFollow) {
      return res.status(400).json({ msg: 'Bạn đã theo dõi người dùng này' });
    }

    const follow = await Follow.create({
      followerId: req.user.id,
      followingId: req.params.id,
    });

    await Notification.create({
      userId: req.params.id,
      type: 'follow',
      relatedUserId: req.user.id,
    });

    res.json({ follow, followed: true });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const follow = await Follow.findOne({
      where: { followerId: req.user.id, followingId: req.params.id },
    });
    if (!follow) return res.status(404).json({ msg: 'Follow not found' });

    await follow.destroy();
    res.json({ msg: 'Unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const searchUsers = async (req, res) => {
  console.log('=====================')
   console.log(req.query.tag)
   console.log('=====================')
  try {
    const { tag } = req.query;
    const users = await User.findAll({
      where: { profileTag: tag },
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getSuggestions = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const followedUsers = await Follow.findAll({
      where: { followerId: currentUserId },
      attributes: ['followingId'],
    });

    console.log('*****')
    console.log(followedUsers)
    const followedIds = followedUsers?.map(f => f.followingId);
    console.log('*****')
    console.log(followedIds)


    // const suggestions = await User.findAll({
    //   where: {
    //     id: { [Sequelize.Op.notIn]: [...followedIds, currentUserId] },
    //   },
    //   attributes: ['id', 'username', 'profilePicture', 'profileTag'],
    //   limit: 10,
    // });

    const suggestions = await User.findAll({
      where: {
        id: {
          [Op.notIn]: [...followedIds, currentUserId], // Exclude these IDs
        },
      },
      attributes: ['id', 'username','profilePicture', 'profileTag'], // Select specific columns
      limit: 10, // Limit results
    });


console.log('*****')
    // console.log(suggestions)
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

const getFollowing = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    console.log('*****')
    console.log('*****')
    if (!user) return res.status(404).json({ msg: 'Người dùng không tồn tại' });

    const following = await Follow.findAll({
      where: { followerId: req.params.id },
      include: [{ model: User, as: 'Following', attributes: ['id', 'username', 'profilePicture', 'profileTag'] }],
    });
    res.json(following.map(f => f.Following));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

const getFollowers = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Người dùng không tồn tại' });

    const followers = await Follow.findAll({
      where: { followingId: req.params.id },
      include: [{ model: User, as: 'Follower', attributes: ['id', 'username', 'profilePicture', 'profileTag'] }],
    });

    res.json(followers.map(f => f.Follower)); // Sửa Followers thành Follower
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

module.exports = { getUser, updateUser, followUser, unfollowUser, searchUsers, getSuggestions, getFollowing, getFollowers };