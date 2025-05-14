const cloudinary = require('cloudinary').v2;

const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ msg: 'Upload failed' });
  }
};

module.exports = { uploadImage };