import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/';
const DB_NAME = 'my-ride';

// Connect to MongoDB
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(DB_NAME);
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

export default async function handler(req, res) {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Get query parameters
    const { type, make, model, year, sort, limit = 20, page = 1 } = req.query;
    
    // Build query
    const query = {};
    if (type) query.type = type;
    if (make) query.make = make;
    if (model) query.model = model;
    if (year) query.year = parseInt(year);
    
    // Build sort options
    let sortOptions = { createdAt: -1 }; // Default sort
    if (sort) {
      if (sort === 'price-asc') sortOptions = { price: 1 };
      if (sort === 'price-desc') sortOptions = { price: -1 };
      if (sort === 'year-asc') sortOptions = { year: 1 };
      if (sort === 'year-desc') sortOptions = { year: -1 };
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
    console.error('Error fetching cars:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch cars',
    });
  }
} 