const mongoose = require('mongoose');
const User = require('../models/User');
const Car = require('../models/Car');

/**
 * @desc    Get all user favorites
 * @route   GET /api/favorites
 * @access  Private
 */
exports.getFavorites = async (req, res) => {
  try {
    // Get user with populated favorites for MongoDB IDs
    const user = await User.findById(req.user._id).populate('favorites');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Prepare response data
    const regularFavorites = user.favorites || [];
    
    // For local favorites, we need to respond with the IDs
    const localFavorites = user.localFavorites || [];
    
    // Combine results for response
    // For local favorites, we'll just return the carId
    const combinedFavorites = [
      ...regularFavorites,
      ...localFavorites.map(fav => ({ 
        _id: fav.carId, 
        id: fav.carId,
        isLocalOnly: true,
        dateAdded: fav.dateAdded
      }))
    ];
    
    // Log for debugging
    console.log(`User ${user._id} has ${regularFavorites.length} regular favorites and ${localFavorites.length} local favorites`);
    
    res.status(200).json({
      status: 'success',
      data: combinedFavorites,
      meta: {
        totalFavorites: combinedFavorites.length,
        regularFavorites: regularFavorites.length,
        localFavorites: localFavorites.length,
        useLocalStorage: localFavorites.length > 0
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while retrieving favorites',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Check if a car is a favorite
 * @route   GET /api/favorites/check/:carId
 * @access  Private
 */
exports.checkFavorite = async (req, res) => {
  try {
    const { carId } = req.params;
    
    if (!carId) {
      return res.status(400).json({
        status: 'error',
        message: 'Car ID is required'
      });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Use the helper method to check if car is a favorite
    const isFavorite = user.isFavorite(carId);
    
    return res.status(200).json({
      status: 'success',
      data: {
        isFavorite,
        carId
      }
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while checking favorite status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Add car to favorites
 * @route   POST /api/favorites/:carId
 * @access  Private
 */
exports.addToFavorites = async (req, res) => {
  try {
    const { carId } = req.params;
    
    // Validate carId
    if (!carId) {
      return res.status(400).json({
        status: 'error',
        message: 'Car ID is required'
      });
    }
    
    console.log(`Adding car ${carId} to favorites for user ${req.user._id}`);
    
    // First try to find the car in the database
    let car = null;
    const isValidObjectId = mongoose.isValidObjectId(carId);
    
    if (isValidObjectId) {
      try {
        car = await Car.findById(carId);
      } catch (carFindError) {
        console.log('Error finding car by ID:', carFindError);
        // Continue - we'll handle this below
      }
    }
    
    // If car not found and we're in development, allow using a local/sample ID
    if (!car && (process.env.NODE_ENV === 'development' || process.env.ALLOW_SAMPLE_DATA === 'true')) {
      console.log(`Car not found, but allowing sample data ID ${carId}`);
      // In development, allow any ID to be added as a local favorite
    } else if (!car && !(process.env.NODE_ENV === 'development' || process.env.ALLOW_SAMPLE_DATA === 'true')) {
      return res.status(404).json({
        status: 'error',
        message: 'Car not found'
      });
    }
    
    // Get user
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Check if already a favorite
    if (user.isFavorite(carId)) {
      return res.status(200).json({
        status: 'success',
        message: 'Car is already in favorites',
        data: {
          carId,
          isLocalId: !isValidObjectId || !car,
          action: 'none'
        }
      });
    }
    
    // Add to favorites using the model method
    const result = await user.addFavorite(carId);
    
    return res.status(200).json({
      status: 'success',
      message: result?.message || 'Car added to favorites',
      data: {
        carId,
        isLocalId: !isValidObjectId || !car,
        action: 'added'
      }
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding to favorites',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Remove car from favorites
 * @route   DELETE /api/favorites/:carId
 * @access  Private
 */
exports.removeFromFavorites = async (req, res) => {
  try {
    const { carId } = req.params;
    
    // Validate carId
    if (!carId) {
      return res.status(400).json({
        status: 'error',
        message: 'Car ID is required'
      });
    }
    
    console.log(`Removing car ${carId} from favorites for user ${req.user._id}`);
    
    // Get user
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Check if car is in favorites
    if (!user.isFavorite(carId)) {
      return res.status(200).json({
        status: 'success',
        message: 'Car is not in favorites',
        data: {
          carId,
          action: 'none'
        }
      });
    }
    
    // Remove from favorites using the model method
    const result = await user.removeFavorite(carId);
    
    return res.status(200).json({
      status: 'success',
      message: result?.message || 'Car removed from favorites',
      data: {
        carId,
        action: 'removed'
      }
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while removing from favorites',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Sync local favorites with server
 * @route   POST /api/favorites/sync
 * @access  Private
 */
exports.syncFavorites = async (req, res) => {
  try {
    const { localFavorites } = req.body;
    
    console.log("Received sync request with data:", req.body);
    
    if (!localFavorites) {
      console.log("Missing localFavorites in request body");
      return res.status(400).json({
        status: 'error',
        message: 'Local favorites data is required'
      });
    }
    
    if (!Array.isArray(localFavorites)) {
      console.log("localFavorites is not an array:", typeof localFavorites);
      return res.status(400).json({
        status: 'error',
        message: 'Local favorites must be an array'
      });
    }
    
    console.log(`Syncing ${localFavorites.length} local favorites for user ${req.user._id}`);
    console.log("Local favorites:", localFavorites);
    
    // Get user
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Check if user has favorites and localFavorites fields
    if (!Array.isArray(user.favorites)) {
      console.log("User favorites field is not an array, initializing empty array");
      user.favorites = [];
    }
    
    if (!Array.isArray(user.localFavorites)) {
      console.log("User localFavorites field is not an array, initializing empty array");
      user.localFavorites = [];
    }
    
    // Track operations
    const stats = {
      added: 0,
      alreadyExists: 0,
      invalid: 0,
      total: localFavorites.length
    };
    
    // Process each local favorite
    const addPromises = [];
    
    for (const favoriteId of localFavorites) {
      if (!favoriteId) {
        console.log("Invalid favorite ID:", favoriteId);
        stats.invalid++;
        continue;
      }
      
      try {
        // Check if already a favorite
        const isFavorite = user.isFavorite(favoriteId);
        
        if (isFavorite) {
          console.log(`Car ${favoriteId} is already a favorite`);
          stats.alreadyExists++;
          continue;
        }
        
        // Add each favorite in a separate async operation
        addPromises.push(
          (async () => {
            try {
              // Add to favorites
              await user.addFavorite(favoriteId);
              console.log(`Added car ${favoriteId} to favorites`);
              stats.added++;
            } catch (addError) {
              console.error(`Error adding favorite ${favoriteId}:`, addError);
              stats.invalid++;
            }
          })()
        );
      } catch (checkError) {
        console.error(`Error checking if ${favoriteId} is a favorite:`, checkError);
        stats.invalid++;
      }
    }
    
    // Wait for all add operations to complete
    await Promise.all(addPromises);
    
    // Save user to persist changes
    await user.save();
    
    // Get updated favorites with population
    const updatedUser = await User.findById(req.user._id).populate('favorites');
    
    console.log("Sync completed with stats:", stats);
    
    return res.status(200).json({
      status: 'success',
      message: 'Favorites synced successfully',
      data: {
        regularFavorites: updatedUser.favorites || [],
        localFavorites: updatedUser.localFavorites || [],
        stats
      }
    });
  } catch (error) {
    console.error('Sync favorites error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while syncing favorites',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 