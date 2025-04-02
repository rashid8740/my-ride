const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up storage for car images
const carStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'my-ride/cars',
    format: async (req, file) => 'auto', // Automatically detect format
    public_id: (req, file) => {
      // Generate a unique public_id based on car ID and timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      return `car-${uniqueSuffix}`;
    },
    transformation: [
      { width: 1200, crop: 'limit' }, // Set max width while maintaining aspect ratio
      { quality: 'auto' } // Auto optimize quality
    ]
  }
});

// Create multer upload instances for different use cases
const uploadCarImages = multer({ 
  storage: carStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
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
    const result = await cloudinary.uploader.destroy(publicId);
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