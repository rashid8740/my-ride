const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  make: {
    type: String,
    required: [true, 'Make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Sedan', 'SUV', 'Hatchback', 'MUV', 'Luxury', 'Convertible', 'Hybrid', 'Electric', 'Truck', 'Van'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: 1900,
    max: new Date().getFullYear() + 1 // Allow for next year's models
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  mileage: {
    type: Number,
    min: 0,
    default: 0
  },
  fuel: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'],
    trim: true
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic', 'CVT', 'Semi-Automatic'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  color: {
    type: String,
    trim: true
  },
  engine: {
    type: String,
    trim: true
  },
  doors: {
    type: Number,
    min: 2,
    max: 7
  },
  seats: {
    type: Number,
    min: 1,
    max: 10
  },
  vin: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'pending'],
    default: 'available'
  },
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted price (with commas)
carSchema.virtual('formattedPrice').get(function() {
  return this.price ? this.price.toLocaleString('en-US') : '0';
});

// Virtual for formatted mileage (with commas)
carSchema.virtual('formattedMileage').get(function() {
  return this.mileage ? this.mileage.toLocaleString('en-US') + ' kms' : '0 kms';
});

// Index for searching
carSchema.index({ title: 'text', make: 'text', model: 'text', description: 'text', category: 'text' });

const Car = mongoose.model('Car', carSchema);

module.exports = Car; 
 
 