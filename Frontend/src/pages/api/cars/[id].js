import { getAuthToken } from '@/utils/auth';
import { getBackendUrl } from '@/utils/apiConfig';

export default async function handler(req, res) {
  const { id } = req.query;
  const backendUrl = getBackendUrl();
  
  try {
    // Get the auth token
    const token = getAuthToken(req);
    
    if (req.method === 'GET') {
      console.log(`Handling API request for car ID: ${id} with backend URL: ${backendUrl}`);
      
      // Get car by ID endpoint
      const getUrl = `${backendUrl}/api/cars/${id}`;
      console.log('Fetching car from:', getUrl);
      
      const getResponse = await fetch(getUrl, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      if (!getResponse.ok) {
        return res.status(getResponse.status).json({ 
          status: 'error',
          message: `Car not found with ID: ${id}`
        });
      }
      
      const data = await getResponse.json();
      return res.status(getResponse.status).json(data);
    }
    
    // All methods below need authentication
    if (!token) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Unauthorized. Please login.'
      });
    }
    
    if (req.method === 'PUT' || req.method === 'PATCH') {
      // Update car by ID
      const updateUrl = `${backendUrl}/api/cars/${id}`;
      
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(req.body)
      });
      
      const updateData = await updateResponse.json();
      return res.status(updateResponse.status).json(updateData);
    }
    
    if (req.method === 'DELETE') {
      // Delete car by ID
      const deleteUrl = `${backendUrl}/api/cars/${id}`;
      
      const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (deleteResponse.status === 204) {
        return res.status(204).end();
      }
      
      const deleteData = await deleteResponse.json();
      return res.status(deleteResponse.status).json(deleteData);
    }
    
    return res.status(405).json({ 
      status: 'error',
      message: 'Method not allowed'
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Internal server error',
      details: error.message
    });
  }
} 