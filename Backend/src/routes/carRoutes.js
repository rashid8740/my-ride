const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { isAuthenticated, isDealer, isResourceOwner } = require('../middlewares/authMiddleware');
const { uploadCarImages } = require('../config/cloudinary');
const Car = require('../models/Car');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', carController.getAllCars);
router.get('/featured', carController.getFeaturedCars);
router.get('/:id', carController.getCarById);

// Protected routes
router.post(
  '/',
  isAuthenticated,
  isDealer,
  uploadCarImages.array('images', 10),
  carController.createCar
);

router.put(
  '/:id',
  isAuthenticated,
  isResourceOwner(Car),
  carController.updateCar
);

router.delete(
  '/:id',
  isAuthenticated,
  isResourceOwner(Car),
  carController.deleteCar
);

// Image management routes
router.post(
  '/:id/images',
  isAuthenticated,
  isResourceOwner(Car),
  uploadMiddleware.uploadMultipleImages('images', 10),
  uploadMiddleware.handleUploadErrors,
  carController.uploadCarImages
);

router.patch(
  '/:id/images/:imageId/main',
  isAuthenticated,
  isResourceOwner(Car),
  carController.setMainImage
);

router.delete(
  '/:id/images/:imageId',
  isAuthenticated,
  isResourceOwner(Car),
  carController.deleteCarImage
);

module.exports = router;