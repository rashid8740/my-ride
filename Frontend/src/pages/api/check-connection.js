// /api/check-connection
export default async function handler(req, res) {
  // Get the backend URL from environment variables
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    // Attempt to connect to the backend health endpoint
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000 // 5 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Return successful connection info
      return res.status(200).json({
        status: 'success',
        backendUrl,
        connected: true,
        message: 'Successfully connected to backend',
        backendResponse: data
      });
    } else {
      // If response is not OK, return error with status code
      const errorText = await response.text();
      return res.status(response.status).json({
        status: 'error',
        backendUrl,
        statusCode: response.status,
        response: {
          raw: errorText
        },
        connected: false,
        message: `Backend returned error status: ${response.status}`
      });
    }
  } catch (error) {
    // If there's a network error or other exception
    return res.status(500).json({
      status: 'error',
      backendUrl,
      message: 'Failed to connect to backend',
      error: error.message || 'Unknown error',
      connected: false
    });
  }
} 