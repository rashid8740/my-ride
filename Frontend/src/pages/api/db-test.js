// /api/db-test
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/test';
const DB_NAME = 'test';

export default async function handler(req, res) {
  let client = null;
  
  try {
    console.log('Connecting to MongoDB:', MONGODB_URI);
    
    // Attempt to connect to MongoDB directly
    client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    
    // Get info about the databases
    const adminDb = client.db('admin');
    const dbInfo = await adminDb.command({ listDatabases: 1 });
    
    // Get specific database
    const db = client.db(DB_NAME);
    
    // List all collections in the database
    const collections = await db.listCollections().toArray();
    
    // Get a sample document from each collection (up to 1)
    const sampleData = {};
    for (const collection of collections) {
      const collName = collection.name;
      const sample = await db.collection(collName).find().limit(1).toArray();
      sampleData[collName] = sample.length > 0 ? sample[0] : null;
    }
    
    // Return comprehensive information
    return res.status(200).json({
      status: 'success',
      connection: {
        uri: MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@'), // Hide credentials
        dbName: DB_NAME
      },
      databases: dbInfo.databases,
      collections: collections.map(c => c.name),
      sampleData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect to MongoDB',
      error: error.message,
      uri: MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@'), // Hide credentials
      timestamp: new Date().toISOString()
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
} 