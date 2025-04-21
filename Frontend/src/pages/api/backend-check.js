import { getApiUrl } from '@/utils/api';

export default async function handler(req, res) {
  // Ensure we get the production backend URL for Vercel deployment
  let backendUrl = 'https://my-ride-backend-tau.vercel.app';
  
  // Try to get the backend URL from our utility
  try {
    backendUrl = getApiUrl();
  } catch (error) {
    console.error('Error getting API URL:', error);
  }
  
  console.log('Checking backend connectivity to:', backendUrl);
  
  try {
    // Attempt to connect to the backend health endpoint
    const healthUrl = `${backendUrl}/api/health`;
    console.log('Checking health at:', healthUrl);
    
    const healthResponse = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Add timeout to avoid hanging requests
      signal: AbortSignal.timeout(5000)
    });
    
    // Get the response as text first for better error logging
    const responseText = await healthResponse.text();
    console.log('Health check response:', responseText);
    
    let responseData;
    try {
      // Try to parse as JSON
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = { raw: responseText };
    }
    
    // Return the health check results
    return res.status(healthResponse.status).json({
      status: healthResponse.ok ? 'success' : 'error',
      backendUrl,
      statusCode: healthResponse.status,
      response: responseData,
      connected: healthResponse.ok
    });
  } catch (error) {
    console.error('Backend connectivity check failed:', error);
    
    return res.status(500).json({
      status: 'error',
      backendUrl,
      message: 'Failed to connect to backend',
      error: error.message,
      connected: false,
      suggestion: 'The backend might be down or inaccessible. Please try a direct request to: ' + backendUrl
    });
  }
} 