import { getAuthToken } from '@/utils/auth';
import { getBackendUrl, getMongoDBUri } from '@/utils/apiConfig';
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Make sure we're using the full path with /api/cars
  const backendUrl = getBackendUrl();
  
  try {
    // Get the auth token
    const token = getAuthToken(req);
    
    switch (req.method) {
      case 'GET':
        try {
          // Try to use the backend first
          // Forward query parameters
          const queryString = new URLSearchParams(req.query).toString();
          const getUrl = queryString 
            ? `${backendUrl}/api/cars?${queryString}` 
            : `${backendUrl}/api/cars`;
            
          const getResponse = await fetch(getUrl, {
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {}
          });
          
          const data = await getResponse.json();
          return res.status(getResponse.status).json(data);
        } catch (error) {
          console.warn('Backend fetch failed, trying direct MongoDB connection');
          
          // If backend fails, try direct MongoDB connection
          const mongoUri = getMongoDBUri();
          const client = new MongoClient(mongoUri);
          
          try {
            await client.connect();
            const database = client.db();
            const carsCollection = database.collection('cars');
            
            // Parse query parameters
            const { limit = 20, page = 1, ...filters } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            
            // Create MongoDB query from filters
            const query = {};
            if (filters.search) {
              query.$or = [
                { make: { $regex: filters.search, $options: 'i' } },
                { model: { $regex: filters.search, $options: 'i' } },
                { title: { $regex: filters.search, $options: 'i' } }
              ];
            }
            
            // Get cars with pagination
            const cars = await carsCollection
              .find(query)
              .skip(skip)
              .limit(parseInt(limit))
              .toArray();
              
            const total = await carsCollection.countDocuments(query);
            
            return res.status(200).json({
              status: 'success',
              message: 'Cars retrieved successfully (direct MongoDB)',
              data: cars,
              pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
              }
            });
          } catch (mongoError) {
            console.error('Direct MongoDB connection failed:', mongoError);
            throw new Error('Failed to connect to database');
          } finally {
            await client.close();
          }
        }
        
      case 'POST':
        // Log the token for debugging
        console.log('Token for vehicle creation:', token ? 'Present' : 'Missing');
        console.log('Using backend URL:', `${backendUrl}/api/cars`);
        
        // Create new vehicle - ensure we're using the correct endpoint
        const createResponse = await fetch(`${backendUrl}/api/cars`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify(req.body)
        });
        
        // Read the response text
        const responseText = await createResponse.text();
        console.log('Backend response status:', createResponse.status);
        console.log('Backend response:', responseText.substring(0, 500));
        
        let createData;
        
        try {
          // Try to parse the response as JSON
          createData = JSON.parse(responseText);
        } catch (error) {
          // If parsing fails, return the raw text with error status
          console.error('Failed to parse response:', responseText.substring(0, 200));
          return res.status(createResponse.status).json({ 
            status: 'error',
            message: `Server returned invalid JSON: ${responseText.substring(0, 200)}...`
          });
        }
        
        return res.status(createResponse.status).json(createData);
        
      default:
        // For other methods, only try the backend
        return res.status(405).json({ 
          status: 'error',
          message: 'Method not allowed' 
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Internal server error',
      details: error.message
    });
  }
} 