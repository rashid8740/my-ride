import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/test';
const DB_NAME = 'test';

export default async function handler(req, res) {
  console.log('DB check API called');
  
  let client = null;
  try {
    // Connect to MongoDB
    console.log('Attempting to connect to:', MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@'));
    client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const db = client.db(DB_NAME);
    
    // Check collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Try to count documents in cars collection
    let carCount = 0;
    if (collectionNames.includes('cars')) {
      carCount = await db.collection('cars').countDocuments();
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Database connection successful',
      collections: collectionNames,
      carCount,
      environment: process.env.NODE_ENV,
      vercel: process.env.VERCEL === '1'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect to database',
      error: error.message,
      environment: process.env.NODE_ENV,
      vercel: process.env.VERCEL === '1'
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
} 