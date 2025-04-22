import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/test';
  const DB_NAME = 'test';
  
  console.log('MongoDB status check API called');
  console.log('Node.js version:', process.version);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Vercel environment:', process.env.VERCEL ? 'Yes' : 'No');
  console.log('MongoDB URI (masked):', MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@'));
  
  let client = null;
  
  try {
    // Connect to MongoDB directly (no caching)
    console.log('Attempting to connect to MongoDB...');
    client = await MongoClient.connect(MONGODB_URI);
    
    // Try to access the database
    const db = client.db(DB_NAME);
    
    // Get server status
    const serverStatus = await db.command({ serverStatus: 1 });
    
    // Get collection names
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Check if cars collection exists
    const hasCarsCollection = collectionNames.includes('cars');
    
    // If cars collection exists, count documents
    let carCount = 0;
    if (hasCarsCollection) {
      carCount = await db.collection('cars').countDocuments();
    }
    
    // Get MongoDB version
    const buildInfo = await db.command({ buildInfo: 1 });
    
    // Return success with details
    return res.status(200).json({
      status: 'success',
      message: 'MongoDB connection successful',
      details: {
        databaseName: DB_NAME,
        mongoVersion: buildInfo.version,
        collections: collectionNames,
        hasCarsCollection,
        carCount,
        connectionInfo: {
          host: serverStatus.host,
          version: serverStatus.version,
          process: serverStatus.process,
          pid: serverStatus.pid,
          uptime: serverStatus.uptime,
          uptimeMillis: serverStatus.uptimeMillis,
          localTime: serverStatus.localTime
        }
      }
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Return detailed error information
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect to MongoDB',
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        code: error.code,
        codeName: error.codeName
      },
      environment: {
        nodejs: process.version,
        env: process.env.NODE_ENV,
        vercel: process.env.VERCEL === '1'
      }
    });
  } finally {
    // Close the client connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
} 