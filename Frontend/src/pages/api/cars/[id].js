import { getAuthToken } from '@/utils/auth';
import { getApiUrl } from '@/utils/api';

export default async function handler(req, res) {
  const { id } = req.query;
  const backendUrl = getApiUrl();
  
  try {
    // Get the auth token
    const token = getAuthToken(req);
    
    if (req.method === 'GET') {
      console.log(`Fetching car with ID: ${id} from backend`);
      
      // Get car by ID endpoint
      const getUrl = `${backendUrl}/api/cars/${id}`;
      console.log('GET request to:', getUrl);
      
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
    
    // Handle PUT/PATCH (update)
    if (req.method === 'PUT' || req.method === 'PATCH') {
      console.log(`Updating car with ID: ${id}`);
      console.log('Update payload:', JSON.stringify(req.body));
      
      // Log the token to verify it's available
      console.log('Token available for update:', token ? 'YES' : 'NO');
      
      const updateUrl = `${backendUrl}/api/cars/${id}`;
      const updateResponse = await fetch(updateUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(req.body)
      });
      
      const responseText = await updateResponse.text();
      console.log('Update response status:', updateResponse.status);
      console.log('Update response:', responseText.substring(0, 500));
      
      try {
        const data = JSON.parse(responseText);
        return res.status(updateResponse.status).json(data);
      } catch (error) {
        console.error('Failed to parse update response:', error);
        return res.status(updateResponse.status).json({ 
          status: 'error',
          message: `Failed to parse response: ${responseText.substring(0, 200)}...`
        });
      }
    }
    
    // Handle DELETE
    if (req.method === 'DELETE') {
      console.log(`Deleting car with ID: ${id}`);
      
      const deleteUrl = `${backendUrl}/api/cars/${id}`;
      const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      const data = await deleteResponse.json();
      return res.status(deleteResponse.status).json(data);
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: error.message || 'An error occurred while processing your request' 
    });
  }
} 