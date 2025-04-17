const User = require('../models/User');
const Car = require('../models/Car');
const mongoose = require('mongoose');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        address: user.address,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while retrieving profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    
    // Find user
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    // Save updated user
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
exports.updateAvatar = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload an image'
      });
    }
    
    // Get file path from Cloudinary URL
    const avatarUrl = req.file.path;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Avatar updated successfully',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating avatar'
    });
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
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
      ...localFavorites.map(fav => fav.carId)
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

// @desc    Add car to favorites
// @route   POST /api/users/favorites/:carId
// @access  Private
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
    const isValidObjectId = mongoose.Types.ObjectId.isValid(carId);
    
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
        message: 'Car is already in favorites'
      });
    }
    
    // Add to favorites using the model method
    await user.addFavorite(carId);
    
    return res.status(200).json({
      status: 'success',
      message: 'Car added to favorites',
      data: {
        carId,
        isLocalId: !isValidObjectId || !car
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

// @desc    Remove car from favorites
// @route   DELETE /api/users/favorites/:carId
// @access  Private
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
        message: 'Car is not in favorites'
      });
    }
    
    // Remove from favorites using the model method
    await user.removeFavorite(carId);
    
    return res.status(200).json({
      status: 'success',
      message: 'Car removed from favorites'
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

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    res.status(200).json({
      status: 'success',
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching users',
    });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user',
    });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    
    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isVerified = isActive;
    
    const updatedUser = await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isVerified,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating user',
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    
    await user.remove();
    
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting user',
    });
  }
};

// @desc    Update user status (active/inactive) (Admin only)
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (isActive === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'isActive field is required',
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    
    user.isVerified = isActive;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: user._id,
        isActive: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating user status',
    });
  }
};

// Clear local favorites for a user (admin only)
exports.clearLocalFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only admins can clear local favorites
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to perform this action'
      });
    }
    
    // Get user document
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Store counts for response
    const prevCount = user.localFavorites.length;
    
    // Clear local favorites
    user.localFavorites = [];
    await user.save();
    
    return res.status(200).json({
      status: 'success',
      message: 'Local favorites cleared successfully',
      data: {
        userId: id,
        cleared: prevCount,
        remainingFavorites: user.favorites.length
      }
    });
  } catch (error) {
    console.error('Error clearing local favorites:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while clearing local favorites',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 