const Car = require('../models/Car');
const { deleteFile } = require('../middlewares/uploadMiddleware');
const path = require('path');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
exports.getAllCars = async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      minYear, 
      maxYear, 
      fuel, 
      transmission,
      search,
      sort,
      limit = 10,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (fuel) filter.fuel = fuel;
    if (transmission) filter.transmission = transmission;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (minYear || maxYear) {
      filter.year = {};
      if (minYear) filter.year.$gte = Number(minYear);
      if (maxYear) filter.year.$lte = Number(maxYear);
    }
    
    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Sorting
    let sortOptions = { createdAt: -1 }; // Default sort by newest
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOptions = { price: 1 };
          break;
        case 'price_desc':
          sortOptions = { price: -1 };
          break;
        case 'year_asc':
          sortOptions = { year: 1 };
          break;
        case 'year_desc':
          sortOptions = { year: -1 };
          break;
        case 'mileage_asc':
          sortOptions = { mileage: 1 };
          break;
        case 'mileage_desc':
          sortOptions = { mileage: -1 };
          break;
      }
    }

    // Execute query with pagination
    const cars = await Car.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .populate('seller', 'firstName lastName avatar');

    // Get total count
    const totalCars = await Car.countDocuments(filter);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCars / Number(limit));

    res.status(200).json({
      status: 'success',
      results: cars.length,
      totalCars,
      totalPages,
      currentPage: Number(page),
      data: cars
    });
  } catch (error) {
    console.error('Get all cars error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while retrieving cars'
    });
  }
};

// @desc    Get featured cars
// @route   GET /api/cars/featured
// @access  Public
exports.getFeaturedCars = async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    
    const featuredCars = await Car.find({ 
      isFeatured: true,
      status: 'Available'
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('seller', 'firstName lastName avatar');
    
    res.status(200).json({
      status: 'success',
      results: featuredCars.length,
      data: featuredCars
    });
  } catch (error) {
    console.error('Get featured cars error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while retrieving featured cars'
    });
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('seller', 'firstName lastName email phone avatar');
    
    if (!car) {
      return res.status(404).json({
        status: 'error',
        message: 'Car not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: car
    });
  } catch (error) {
    console.error('Get car by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while retrieving car details'
    });
  }
};

// @desc    Create new car
// @route   POST /api/cars
// @access  Private
exports.createCar = async (req, res) => {
  try {
    const {
      title,
      make,
      model,
      category,
      year,
      price,
      mileage,
      fuel,
      transmission,
      description,
      features,
      color,
      engine,
      doors,
      seats,
      vin,
      status,
      stock
    } = req.body;

    // Handle features as array
    let featuresArray = [];
    if (features) {
      featuresArray = typeof features === 'string' 
        ? features.split(',').map(feature => feature.trim()) 
        : features;
    }

    // Format title if not provided
    const formattedTitle = title || `${make} ${model} ${year}`;

    // Create car with initial data
    const carData = {
      title: formattedTitle,
      make,
      model,
      category,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage || 0),
      fuel,
      transmission,
      description,
      features: featuresArray,
      color,
      engine,
      doors: doors ? Number(doors) : undefined,
      seats: seats ? Number(seats) : undefined,
      vin,
      status: status || 'available',
      stock: stock ? Number(stock) : 1,
      seller: req.user._id,
      images: []
    };

    // Handle images if uploaded to Cloudinary
    if (req.files && req.files.length > 0) {
      carData.images = req.files.map((file, index) => ({
        url: file.path, // Cloudinary URL
        publicId: file.filename, // Cloudinary public ID
        isMain: index === 0 // First image is the main image
      }));
    }

    const car = await Car.create(carData);

    res.status(201).json({
      status: 'success',
      message: 'Car created successfully',
      data: car
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error while creating car'
    });
  }
};

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private
exports.updateCar = async (req, res) => {
  try {
    const carId = req.params.id;
    
    // Find the car
    let car = await Car.findById(carId);
    
    if (!car) {
      return res.status(404).json({
        status: 'error',
        message: 'Car not found'
      });
    }
    
    // Check ownership
    if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this car'
      });
    }
    
    // Handle features as array
    if (req.body.features) {
      req.body.features = typeof req.body.features === 'string' 
        ? req.body.features.split(',').map(feature => feature.trim()) 
        : req.body.features;
    }
    
    // Convert numeric strings to numbers
    if (req.body.price) req.body.price = Number(req.body.price);
    if (req.body.year) req.body.year = Number(req.body.year);
    if (req.body.mileage) req.body.mileage = Number(req.body.mileage);
    if (req.body.doors) req.body.doors = Number(req.body.doors);
    if (req.body.seats) req.body.seats = Number(req.body.seats);
    
    // Update the car
    car = await Car.findByIdAndUpdate(
      carId,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Car updated successfully',
      data: car
    });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating car'
    });
  }
};

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        status: 'error',
        message: 'Car not found'
      });
    }
    
    // Check ownership
    if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this car'
      });
    }
    
    // Delete associated images
    if (car.images && car.images.length > 0) {
      car.images.forEach(image => {
        const imagePath = path.join(__dirname, '../../', image.url);
        deleteFile(imagePath);
      });
    }
    
    // Delete the car
    await Car.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting car'
    });
  }
};

// @desc    Upload car images
// @route   POST /api/cars/:id/images
// @access  Private
exports.uploadCarImages = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        status: 'error',
        message: 'Car not found'
      });
    }
    
    // Check ownership
    if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this car'
      });
    }
    
    // Process uploaded images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No images uploaded'
      });
    }
    
    // Add new images
    const newImages = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      isMain: false
    }));
    
    // Update the car with new images
    car.images.push(...newImages);
    await car.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Images uploaded successfully',
      data: car.images
    });
  } catch (error) {
    console.error('Upload car images error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while uploading images'
    });
  }
};

// @desc    Set main car image
// @route   PATCH /api/cars/:id/images/:imageId/main
// @access  Private
exports.setMainImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    
    const car = await Car.findById(id);
    
    if (!car) {
      return res.status(404).json({
        status: 'error',
        message: 'Car not found'
      });
    }
    
    // Check ownership
    if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this car'
      });
    }
    
    // Reset all images to non-main
    car.images.forEach(image => {
      image.isMain = image._id.toString() === imageId;
    });
    
    await car.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Main image updated successfully',
      data: car.images
    });
  } catch (error) {
    console.error('Set main image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while setting main image'
    });
  }
};

// @desc    Delete car image
// @route   DELETE /api/cars/:id/images/:imageId
// @access  Private
exports.deleteCarImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    
    const car = await Car.findById(id);
    
    if (!car) {
      return res.status(404).json({
        status: 'error',
        message: 'Car not found'
      });
    }
    
    // Check ownership
    if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this image'
      });
    }
    
    // Find the image
    const imageIndex = car.images.findIndex(img => img._id.toString() === imageId);
    
    if (imageIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Image not found'
      });
    }
    
    // Delete the image file
    const imagePath = path.join(__dirname, '../../', car.images[imageIndex].url);
    deleteFile(imagePath);
    
    // If it's the main image and there are other images, set the first remaining image as main
    const wasMain = car.images[imageIndex].isMain;
    
    // Remove the image from the array
    car.images.splice(imageIndex, 1);
    
    // If it was the main image and there are other images, set the first one as main
    if (wasMain && car.images.length > 0) {
      car.images[0].isMain = true;
    }
    
    await car.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Image deleted successfully',
      data: car.images
    });
  } catch (error) {
    console.error('Delete car image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting image'
    });
  }
};