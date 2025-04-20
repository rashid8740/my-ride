import { MongoClient } from 'mongodb';
import { getMongoDBUri } from '@/utils/apiConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error', 
      message: 'Method not allowed' 
    });
  }

  try {
    const mongoUri = getMongoDBUri();
    const client = new MongoClient(mongoUri);
    
    await client.connect();
    console.log('MongoDB Connected successfully!');
    
    // Get database stats
    const database = client.db();
    const admin = database.admin();
    
    // Get database information
    const dbInfo = await database.command({ dbStats: 1 });
    
    // List collections
    const collections = await database.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Get a sample document from cars collection if it exists
    let sampleCar = null;
    if (collectionNames.includes('cars')) {
      const carsCollection = database.collection('cars');
      sampleCar = await carsCollection.findOne({});
    }
    
    // Close the connection
    await client.close();
    
    return res.status(200).json({
      status: 'success',
      message: 'Successfully connected to MongoDB',
      data: {
        databaseName: dbInfo.db,
        collections: collectionNames,
        stats: {
          documents: dbInfo.objects,
          collections: dbInfo.collections,
          dataSize: `${(dbInfo.dataSize / 1024 / 1024).toFixed(2)} MB`,
        },
        sampleCar: sampleCar ? {
          _id: sampleCar._id,
          make: sampleCar.make,
          model: sampleCar.model
        } : null
      }
    });
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    return res.status(500).json({
      status: 'error',
      message: `Failed to connect to MongoDB: ${error.message}`,
      error: error.toString()
    });
  }
} 