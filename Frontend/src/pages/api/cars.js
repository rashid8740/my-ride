import { getAuthToken } from '@/utils/auth';
import { getApiUrl } from '@/utils/api';

export default async function handler(req, res) {
  // Use the getApiUrl helper to ensure proper backend URL
  const backendUrl = getApiUrl();
  
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
        
        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        try {
          const getResponse = await fetch(getUrl, {
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {},
            signal: controller.signal
          });
          
          clearTimeout(timeoutId); // Clear the timeout
          
          if (!getResponse.ok) {
            console.error(`Backend returned error status: ${getResponse.status}`);
            // Try to read error message from response
            let errorText;
            try {
              const errorData = await getResponse.json();
              errorText = errorData.message || `Backend returned status ${getResponse.status}`;
            } catch (e) {
              errorText = `Backend returned status ${getResponse.status}`;
            }
            
            return res.status(getResponse.status).json({
              status: 'error',
              message: errorText
            });
          }
          
          const data = await getResponse.json();
          console.log('Successfully fetched cars data');
          return res.status(getResponse.status).json(data);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.error('Fetch error in cars API:', fetchError);
          
          if (fetchError.name === 'AbortError') {
            return res.status(504).json({
              status: 'error',
              message: 'Request to backend timed out'
            });
          }
          
          return res.status(500).json({ 
            status: 'error',
            message: fetchError.message || 'Failed to communicate with the backend server'
          });
        }
        
      case 'POST':
        // Log the token for debugging
        console.log('Token for vehicle creation (from /api/cars):', token ? 'Present' : 'Missing');
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
          
          // Log the created car ID
          if (createData.status === 'success' && createData.data && createData.data._id) {
            console.log('Successfully created car with ID:', createData.data._id);
          }
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