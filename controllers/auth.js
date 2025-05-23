const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async (req, res) => {
  const { username, email, password, profileTag } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ msg: 'Người dùng đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      username,
      email,
      password: hashedPassword,
      profileTag,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user.id });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user.id });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

module.exports = { signup, login };