const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Sedan', 'SUV', 'Hatchback', 'MUV', 'Luxury', 'Convertible', 'Hybrid', 'Electric'],
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
    required: [true, 'Mileage is required'],
    min: 0
  },
  fuel: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'],
    trim: true
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
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
    enum: ['Available', 'Sold', 'Reserved', 'Pending'],
    default: 'Available'
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
  return this.price.toLocaleString('en-US');
});

// Virtual for formatted mileage (with commas)
carSchema.virtual('formattedMileage').get(function() {
  return this.mileage.toLocaleString('en-US') + ' kms';
});

// Index for searching
carSchema.index({ title: 'text', description: 'text', category: 'text' });

const Car = mongoose.model('Car', carSchema);

module.exports = Car; 
 
 