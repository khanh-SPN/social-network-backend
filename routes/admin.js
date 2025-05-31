const express = require('express');
const router = express.Router();
const { adminLogin, getUsers, createUser, updateUser, deleteUser } = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file JPEG, JPG, PNG'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

// Debug middleware
router.use((req, res, next) => {
  console.log(`Admin route hit: ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
  next();
});

// Đăng nhập admin
router.post('/auth/admin-login', adminLogin);

// Quản lý tài khoản (yêu cầu admin)
router.get('/users', adminMiddleware, getUsers);
router.post('/users', adminMiddleware, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'coverPicture', maxCount: 1 },
]), createUser);
router.put('/users/:id', adminMiddleware, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'coverPicture', maxCount: 1 },
]), updateUser);
router.delete('/users/:id', adminMiddleware, deleteUser);

module.exports = router;