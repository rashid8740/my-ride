const mongoose = require('mongoose');

const dealershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dealership name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'United States'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  services: [{
    type: String,
    enum: ['Sales', 'Service', 'Parts', 'Financing', 'Insurance', 'Trade-In']
  }],
  images: [{
    url: String,
    caption: String
  }],
  active: {
    type: Boolean,
    default: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
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

// Virtual for formatted address
dealershipSchema.virtual('formattedAddress').get(function() {
  const { street, city, state, zipCode } = this.address;
  return `${street}, ${city}, ${state} ${zipCode}`;
});

// Add index for geospatial queries
if (dealershipSchema.address && dealershipSchema.address.coordinates) {
  dealershipSchema.index({ 'address.coordinates': '2dsphere' });
}

const Dealership = mongoose.model('Dealership', dealershipSchema);

module.exports = Dealership; 
 
 