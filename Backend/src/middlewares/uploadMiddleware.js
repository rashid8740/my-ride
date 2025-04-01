const path = require('path');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Define storage for files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB limit
  }
});

// Middleware for handling errors from multer
exports.handleUploadErrors = (req, res, next) => {
  return (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 'error',
          message: 'File size too large. Maximum size is 5MB.'
        });
      }
      return res.status(400).json({
        status: 'error',
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
    next();
  };
};

// Export configured upload middleware
exports.uploadSingleImage = upload.single('image');
exports.uploadMultipleImages = upload.array('images', 10);  // Allow up to 10 images

// Helper function to delete a file
exports.deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create Cloudinary storage for different types of uploads
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `my-ride/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 1200, height: 800, crop: 'limit' }
      ]
    }
  });
};

// Multer storages for different upload types
const carImageStorage = createCloudinaryStorage('cars');
const avatarStorage = createCloudinaryStorage('avatars');
const logoStorage = createCloudinaryStorage('logos');

// File size limit (10MB)
const fileSize = 10 * 1024 * 1024;

// File filter for images
const imageFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Single image upload function (for avatar, logo, etc.)
const uploadSingleImage = (fieldName) => {
  let storage;
  
  // Choose storage based on field name
  switch (fieldName) {
    case 'avatar':
      storage = avatarStorage;
      break;
    case 'logo':
      storage = logoStorage;
      break;
    default:
      storage = carImageStorage;
  }
  
  const upload = multer({
    storage,
    limits: { fileSize },
    fileFilter: imageFilter
  }).single(fieldName);
  
  return upload;
};

// Multiple images upload function (for car images)
const uploadMultipleImages = (fieldName, maxCount = 10) => {
  const upload = multer({
    storage: carImageStorage,
    limits: { fileSize },
    fileFilter: imageFilter
  }).array(fieldName, maxCount);
  
  return upload;
};

// Handle multer errors
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is 10MB'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'Too many files uploaded or invalid field name'
      });
    }
    
    return res.status(400).json({
      status: 'error',
      message: `Multer error: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  next();
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  handleUploadErrors,
  cloudinary // Export cloudinary instance for direct use if needed
}; 
 
 