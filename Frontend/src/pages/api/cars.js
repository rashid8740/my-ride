import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/test';
const DB_NAME = 'test'; // Make sure this matches your actual database name

// Connect to MongoDB
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    console.log('Using cached database connection');
    return { client: cachedClient, db: cachedDb };
  }

  console.log('Creating new database connection');
  console.log('Connection URI (masked):', MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@'));
  
  try {
    // Updated MongoDB client options for version 6+
    const client = await MongoClient.connect(MONGODB_URI);
    
    const db = client.db(DB_NAME);
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();
    console.log('Connected to MongoDB. Collections available:', collections.map(c => c.name));
    
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  console.log('API route /api/cars called with query:', req.query);
  
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Get query parameters
    const { 
      category, type, make, model, minYear, maxYear, year, 
      minPrice, maxPrice, fuel, transmission, sort, 
      limit = 20, page = 1, search 
    } = req.query;
    
    // Build query
    const query = {};
    
    // Handle various filter combinations
    if (category) query.category = category;
    if (type) query.type = type;
    if (make) query.make = make;
    if (model) query.model = model;
    if (fuel) query.fuel = fuel;
    if (transmission) query.transmission = transmission;
    
    // Handle year as single value or range
    if (year) {
      query.year = parseInt(year);
    } else if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = parseInt(minYear);
      if (maxYear) query.year.$lte = parseInt(maxYear);
    }
    
    // Handle price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    // Handle search term (across multiple fields)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { make: searchRegex },
        { model: searchRegex },
        { description: searchRegex }
      ];
    }
    
    console.log('MongoDB query:', JSON.stringify(query));
    
    // Build sort options
    let sortOptions = { createdAt: -1 }; // Default sort
    if (sort) {
      if (sort === 'price_asc' || sort === 'price-asc') sortOptions = { price: 1 };
      if (sort === 'price_desc' || sort === 'price-desc') sortOptions = { price: -1 };
      if (sort === 'year_asc' || sort === 'year-asc') sortOptions = { year: 1 };
      if (sort === 'year_desc' || sort === 'year-desc') sortOptions = { year: -1 };
      if (sort === 'latest') sortOptions = { createdAt: -1 };
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get cars from database
    const cars = await db
      .collection('cars')
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    console.log(`Found ${cars.length} cars matching query`);
    
    // Get total count
    const totalCount = await db
      .collection('cars')
      .countDocuments(query);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    
    // Return response
    return res.status(200).json({
      status: 'success',
      data: cars,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error('Error in /api/cars endpoint:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch cars',
      error: error.message,
    });
  }
} 