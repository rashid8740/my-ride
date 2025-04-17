const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const favoriteController = require('../controllers/favoriteController');

// Get all user favorites
router.get('/', isAuthenticated, favoriteController.getFavorites);

// Check if a car is a favorite
router.get('/check/:carId', isAuthenticated, favoriteController.checkFavorite);

// Add car to favorites
router.post('/:carId', isAuthenticated, favoriteController.addToFavorites);

// Remove car from favorites
router.delete('/:carId', isAuthenticated, favoriteController.removeFromFavorites);

// Sync local favorites with server
router.post('/sync', isAuthenticated, favoriteController.syncFavorites);

module.exports = router; 