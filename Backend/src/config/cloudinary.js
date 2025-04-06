const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary with improved timeout
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 60000 // 60 seconds timeout
});

// Set up storage for car images with simplified config
const carStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'my-ride/cars',
    // Don't use format: 'auto' as it's causing extension errors
    public_id: (req, file) => {
      // Generate a unique public_id based on timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      return `car-${uniqueSuffix}`;
    },
    // Add quality settings without format transformation
    transformation: [
      { quality: "auto:best", fetch_format: "auto" }
    ]
  }
});

// Create multer upload instances with extended timeout
const uploadCarImages = multer({ 
  storage: carStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    fieldSize: 10 * 1024 * 1024 // 10MB field size limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Utility function to delete images from Cloudinary
const deleteImage = async (publicId) => {
  try {
    console.log('Attempting to delete image with publicId:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary deletion result:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadCarImages,
  deleteImage
}; 