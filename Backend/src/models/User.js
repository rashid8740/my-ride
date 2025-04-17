const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in query results by default
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['customer', 'dealer', 'admin'],
    default: 'customer'
  },
  dealership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealership',
    required: function() {
      return this.role === 'dealer';
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  favorites: [{
    type: mongoose.Schema.Types.Mixed, // Changed from ObjectId to Mixed for flexibility
    ref: 'Car'
  }],
  // New field to track local/sample IDs separately
  localFavorites: [{
    carId: {
      type: String,
      required: true
    },
    dateAdded: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Helper method to add a favorite
userSchema.methods.addFavorite = async function(carId) {
  try {
    // Ensure carId is a valid ObjectId
    let carObjectId;
    
    if (typeof carId === 'string') {
      carObjectId = new mongoose.Types.ObjectId(carId);
    } else if (carId instanceof mongoose.Types.ObjectId) {
      carObjectId = carId;
    } else {
      throw new Error('Invalid car ID format');
    }
    
    // Check if the car is already in favorites
    const isAlreadyFavorite = this.favorites.some(favId => 
      favId.equals(carObjectId)
    );

    if (isAlreadyFavorite) {
      return { added: false, message: 'Car already in favorites' };
    }

    // Add to favorites
    this.favorites.push(carObjectId);
    await this.save();
    
    return { added: true, message: 'Car added to favorites' };
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

// Helper method to remove a favorite
userSchema.methods.removeFavorite = async function(carId) {
  try {
    // For MongoDB ObjectIds
    if (mongoose.isValidObjectId(carId)) {
      const carObjectId = new mongoose.Types.ObjectId(carId);
      
      // Remove from favorites array
      const initialLength = this.favorites.length;
      this.favorites = this.favorites.filter(favId => !favId.equals(carObjectId));
      
      const removed = initialLength > this.favorites.length;
      
      // If nothing was removed from regular favorites, try local favorites
      if (!removed) {
        const initialLocalLength = this.localFavorites.length;
        this.localFavorites = this.localFavorites.filter(fav => 
          fav.carId !== carId.toString()
        );
        
        const removedLocal = initialLocalLength > this.localFavorites.length;
        
        if (removedLocal) {
          await this.save();
          return { removed: true, message: 'Car removed from local favorites' };
        } else {
          return { removed: false, message: 'Car not found in favorites' };
        }
      }
      
      await this.save();
      return { removed: true, message: 'Car removed from favorites' };
    } 
    // For non-MongoDB IDs (sample/local data)
    else {
      const initialLocalLength = this.localFavorites.length;
      this.localFavorites = this.localFavorites.filter(fav => 
        fav.carId !== carId.toString()
      );
      
      const removedLocal = initialLocalLength > this.localFavorites.length;
      
      await this.save();
      
      if (removedLocal) {
        return { removed: true, message: 'Car removed from local favorites' };
      } else {
        return { removed: false, message: 'Car not found in local favorites' };
      }
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

// Helper method to check if a car is in favorites
userSchema.methods.isFavorite = function(carId) {
  // Check in both regular and local favorites
  const inRegularFavorites = this.favorites.some(favId => favId.toString() === carId.toString());
  const inLocalFavorites = this.localFavorites.some(fav => fav.carId === carId.toString());
  
  return inRegularFavorites || inLocalFavorites;
};

// Helper to get all favorites (combined)
userSchema.methods.getAllFavorites = function() {
  const regularFavs = this.favorites.map(favId => favId.toString());
  const localFavs = this.localFavorites.map(fav => fav.carId);
  
  return [...regularFavs, ...localFavs];
};

const User = mongoose.model('User', userSchema);

module.exports = User; 
 
 