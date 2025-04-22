// /api/check-connection
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/test';
const DB_NAME = 'test';

export default async function handler(req, res) {
  let client = null;
  
  try {
    // Attempt to connect to MongoDB directly
    client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    
    // Basic check - list databases
    const admin = client.db().admin();
    const listDatabases = await admin.listDatabases({ nameOnly: true });
    
    // Check if we can access the test database
    const testDb = client.db(DB_NAME);
    const collections = await testDb.listCollections().toArray();
    
    return res.status(200).json({
      status: 'success',
      connected: true,
      message: 'Successfully connected to MongoDB',
      databaseCount: listDatabases.databases.length,
      testDbCollections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    return res.status(500).json({
      status: 'error',
      connected: false,
      message: 'Failed to connect to MongoDB',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
} 