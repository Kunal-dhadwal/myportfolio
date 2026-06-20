const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadImage, uploadVideo, uploadDocument, uploadMultiple, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// Single image upload
router.post('/image', protect, adminOnly, uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({
    success: true,
    url: req.file.path,
    publicId: req.file.filename,
    originalName: req.file.originalname,
  });
});

// Multiple images
router.post('/images', protect, adminOnly, (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.files?.length) return res.status(400).json({ success: false, message: 'No files uploaded' });
    const files = req.files.map(f => ({ url: f.path, publicId: f.filename }));
    res.json({ success: true, files });
  });
});

// Video upload
router.post('/video', protect, adminOnly, uploadVideo.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({
    success: true,
    url: req.file.path,
    publicId: req.file.filename,
  });
});

// Document upload (resume/pdf)
router.post('/document', protect, adminOnly, uploadDocument.single('document'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({
    success: true,
    url: req.file.path,
    publicId: req.file.filename,
  });
});

// Delete file from Cloudinary
router.delete('/:publicId', protect, adminOnly, async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
