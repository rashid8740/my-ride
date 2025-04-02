import { getAuthToken } from '@/utils/auth';

export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  try {
    // Get the auth token
    const token = getAuthToken(req);
    
    switch (req.method) {
      case 'GET':
        // Forward query parameters
        const queryString = new URLSearchParams(req.query).toString();
        const getUrl = queryString 
          ? `${backendUrl}/cars?${queryString}` 
          : `${backendUrl}/cars`;
          
        const getResponse = await fetch(getUrl, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });
        
        const data = await getResponse.json();
        return res.status(getResponse.status).json(data);
        
      case 'POST':
        // Create new vehicle
        const createResponse = await fetch(`${backendUrl}/cars`, {
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
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: error.message || 'An error occurred while processing your request' 
    });
  }
} 