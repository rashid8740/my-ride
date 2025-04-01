const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { uploadSingleImage, handleUploadErrors } = require('../middlewares/uploadMiddleware');
const userController = require('../controllers/userController');

// Profile Routes
router.get('/profile', isAuthenticated, userController.getProfile);
router.put('/profile', isAuthenticated, userController.updateProfile);
router.put('/avatar', isAuthenticated, uploadSingleImage('avatar'), handleUploadErrors, userController.updateAvatar);

// Favorites Routes
router.get('/favorites', isAuthenticated, userController.getFavorites);
router.post('/favorites/:carId', isAuthenticated, userController.addToFavorites);
router.delete('/favorites/:carId', isAuthenticated, userController.removeFromFavorites);

// Admin Routes
router.get('/', isAuthenticated, isAdmin, userController.getAllUsers);
router.get('/:id', isAuthenticated, isAdmin, userController.getUserById);
router.put('/:id', isAuthenticated, isAdmin, userController.updateUser);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);
router.patch('/:id/status', isAuthenticated, isAdmin, userController.updateUserStatus);

module.exports = router; 