const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
  try {
    console.log('adminMiddleware request:', req.originalUrl, req.headers.authorization); // Debug log
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ msg: 'Không có quyền truy cập, thiếu token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    if (!decoded.isAdmin) {
      return res.status(401).json({ msg: 'Không có quyền truy cập, không phải admin' });
    }

    req.admin = { id: decoded.id, isAdmin: decoded.isAdmin };
    console.log('adminMiddleware success, admin:', req.admin); // Debug log
    next();
  } catch (error) {
    console.error('Lỗi trong adminMiddleware:', error.message);
    res.status(401).json({ msg: 'Không có quyền truy cập, token không hợp lệ' });
  }
};

module.exports = adminMiddleware;