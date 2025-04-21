import { getApiUrl } from '@/utils/api';

export default async function handler(req, res) {
  let backendUrl = getApiUrl();
  
  // Explicit production URL fallback for Vercel deployments
  if (backendUrl === 'http://localhost:5000' && process.env.VERCEL_ENV === 'production') {
    backendUrl = 'https://my-ride-backend-tau.vercel.app';
    console.log('Forcing backend URL to production URL in Vercel environment');
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
      connected: false
    });
  }
} 