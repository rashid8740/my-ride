import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/test';
const DB_NAME = 'test';

export default async function handler(req, res) {
  let client = null;
  
  try {
    // Attempt to connect to MongoDB
    client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    
    // Check connection by listing databases
    const adminDb = client.db('admin');
    const dbInfo = await adminDb.command({ listDatabases: 1, nameOnly: true });
    
    // Check if we can access the specific database
    const testDb = client.db(DB_NAME);
    const collections = await testDb.listCollections().toArray();
    
    return res.status(200).json({
      status: 'ok',
      message: 'API is running',
      database: 'connected',
      dbInfo: {
        databaseCount: dbInfo.databases.length,
        databaseNames: dbInfo.databases.map(db => db.name).slice(0, 5), // Only show first 5 for security
        testDbCollections: collections.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return res.status(500).json({
      status: 'error',
      message: 'MongoDB connection failed',
      error: error.message,
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  } finally {
    // Close MongoDB connection
    if (client) await client.close();
  }
} 