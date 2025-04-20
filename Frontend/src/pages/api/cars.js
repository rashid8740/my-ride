import { getAuthToken } from '@/utils/auth';
import { getBackendUrl } from '@/utils/apiConfig';

export default async function handler(req, res) {
  // Get the backend URL from our configuration utility
  const backendUrl = getBackendUrl();
  
  try {
    // Get the auth token
    const token = getAuthToken(req);
    
    switch (req.method) {
      case 'GET':
        // Forward query parameters
        const queryString = new URLSearchParams(req.query).toString();
        const getUrl = queryString 
          ? `${backendUrl}/api/cars?${queryString}` 
          : `${backendUrl}/api/cars`;
          
        console.log('GET request to:', getUrl);
        
        const getResponse = await fetch(getUrl, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });
        
        const data = await getResponse.json();
        return res.status(getResponse.status).json(data);
        
      case 'POST':
        // Only allow authenticated users to create cars
        if (!token) {
          return res.status(401).json({ 
            status: 'error',
            message: 'Unauthorized. Please login.' 
          });
        }
        
        console.log('Using backend URL:', `${backendUrl}/api/cars`);
        
        // Create new car
        const createResponse = await fetch(`${backendUrl}/api/cars`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(req.body)
        });
        
        const createData = await createResponse.json();
        
        return res.status(createResponse.status).json(createData);
        
      default:
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