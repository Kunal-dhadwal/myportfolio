const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, quality: 'auto' }],
  },
});

// Video storage
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'webm', 'mov'],
  },
});

// Document storage (resumes, certificates)
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/documents',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx'],
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

const uploadMultiple = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('images', 10);

module.exports = { cloudinary, uploadImage, uploadVideo, uploadDocument, uploadMultiple };
