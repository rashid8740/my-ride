import { getAuthToken } from '@/utils/auth';
import { getApiUrl } from '@/utils/api';

export default async function handler(req, res) {
  // Get the configured backend URL with fallbacks
  let backendUrl;
  
  try {
    backendUrl = getApiUrl();
  } catch (error) {
    // Fallback to hardcoded URL if getApiUrl fails
    backendUrl = 'https://my-ride-backend-tau.vercel.app';
    console.error('Error getting API URL, using fallback:', backendUrl, error);
  }
  
  console.log('API handler using backend URL:', backendUrl);
  
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
        
        try {
          const getResponse = await fetch(getUrl, {
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {},
            // Add timeout to avoid hanging requests
            signal: AbortSignal.timeout(8000)
          });
          
          if (!getResponse.ok) {
            const errorText = await getResponse.text();
            console.error(`Backend error (${getResponse.status}):`, errorText);
            return res.status(getResponse.status).json({ 
              status: 'error',
              message: `Backend returned error: ${getResponse.status}`,
              details: errorText.substring(0, 200)
            });
          }
          
          const data = await getResponse.json();
          return res.status(getResponse.status).json(data);
        } catch (fetchError) {
          console.error('Fetch error in GET /api/cars:', fetchError);
          return res.status(500).json({
            status: 'error',
            message: 'Failed to connect to backend',
            details: fetchError.message,
            backendUrl: backendUrl // Include the backend URL for debugging
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