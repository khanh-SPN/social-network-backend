const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Đăng nhập admin (mật khẩu cố định "123")
exports.adminLogin = async (req, res) => {
  try {
    console.log('adminLogin request:', req.body);
    const { username, password } = req.body || {};
    if (!username || !password) {
      console.log('adminLogin failed: Missing username or password');
      return res.status(400).json({ msg: 'Username và password là bắt buộc' });
    }

    // Giả lập admin cố định
    const admin = { id: 1, username: 'admin', password: '123' };
    if (username !== admin.username || password !== admin.password) {
      console.log('adminLogin failed: Invalid credentials');
      return res.status(401).json({ msg: 'Sai username hoặc password' });
    }

    const token = jwt.sign({ id: admin.id, isAdmin: true }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });
    console.log('adminLogin success, token:', token);
    res.json({ token });
  } catch (error) {
    console.error('Lỗi trong adminLogin:', error.message);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

// Lấy danh sách tài khoản
exports.getUsers = async (req, res) => {
  try {
    console.log('getUsers request, admin:', req.admin);
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'profileTag', 'bio', 'profilePicture', 'coverPicture', 'createdAt'],
    });
    console.log('getUsers success, users:', users.length);
    res.json(users);
  } catch (error) {
    console.error('Lỗi trong getUsers:', error.message);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

// Thêm tài khoản
exports.createUser = async (req, res) => {
  try {
    console.log('createUser request:', req.body, req.files);
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('createUser failed: Empty request body');
      return res.status(400).json({ msg: 'Dữ liệu request không hợp lệ' });
    }

    const { username, email, password, profileTag, bio } = req.body;
    const profilePicture = req.files?.profilePicture ? `/uploads/${req.files.profilePicture[0].filename}` : null;
    const coverPicture = req.files?.coverPicture ? `/uploads/${req.files.coverPicture[0].filename}` : null;

    if (!username || !email || !password) {
      console.log('createUser failed: Missing required fields');
      return res.status(400).json({ msg: 'Username, email và password là bắt buộc' });
    }

    let user = await User.findOne({ where: { email } });
    if (user) {
      console.log('createUser failed: Email already exists', email);
      return res.status(400).json({ msg: 'Người dùng đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      username,
      email,
      password: hashedPassword,
      profileTag: profileTag || `@${username}`,
      bio: bio || '',
      profilePicture: profilePicture || '/uploads/default-profile.jpg',
      coverPicture: coverPicture || '/uploads/default-cover.jpg',
    });

    console.log('createUser success, user:', user.id);
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      profileTag: user.profileTag,
      bio: user.bio,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
    });
  } catch (error) {
    console.error('Lỗi trong createUser:', error.message);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

// Sửa tài khoản
exports.updateUser = async (req, res) => {
  try {
    console.log('updateUser request:', req.params, req.body, req.files);
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('updateUser failed: Empty request body');
      return res.status(400).json({ msg: 'Dữ liệu request không hợp lệ' });
    }

    const { id } = req.params;
    const { username, email, password, profileTag, bio } = req.body;
    const profilePicture = req.files?.profilePicture ? `/uploads/${req.files.profilePicture[0].filename}` : null;
    const coverPicture = req.files?.coverPicture ? `/uploads/${req.files.coverPicture[0].filename}` : null;

    const user = await User.findByPk(id);
    if (!user) {
      console.log('updateUser failed: User not found');
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        console.log('updateUser failed: Email already exists', email);
        return res.status(400).json({ msg: 'Email đã được sử dụng' });
      }
    }

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (profileTag) updates.profileTag = profileTag;
    if (bio !== undefined) updates.bio = bio;
    if (profilePicture) updates.profilePicture = profilePicture;
    if (coverPicture) updates.coverPicture = coverPicture;

    await user.update(updates);
    console.log('updateUser success, user:', user.id);
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

// Xóa tài khoản
exports.deleteUser = async (req, res) => {
  try {
    console.log('deleteUser request:', req.params);
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      console.log('deleteUser failed: User not found');
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }

    await user.destroy();
    console.log('deleteUser success, user:', id);
    res.json({ msg: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('Lỗi trong deleteUser:', error.message);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};