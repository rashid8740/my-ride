// Health check endpoint to verify backend connectivity

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    // Get backend URL from environment or default to localhost
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('Checking backend health at:', backendUrl);

    // Try to reach the backend health endpoint
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000, // 5 second timeout
    }).catch(error => {
      console.error('Fetch error:', error);
      return { ok: false, error: error.message || 'fetch failed' };
    });

    if (!response.ok) {
      // If response object has error property, it's our custom error
      if (response.error) {
        return res.status(503).json({
          status: 'error',
          backendUrl,
          message: 'Failed to connect to backend',
          error: response.error,
          connected: false
        });
      }

      // Otherwise it's a real response with an error status
      const errorText = await response.text().catch(() => 'Could not read error response');
      return res.status(response.status).json({
        status: 'error',
        backendUrl,
        statusCode: response.status,
        response: { raw: errorText },
        connected: false
      });
    }

    // Parse the successful response
    const data = await response.json().catch(() => ({ status: 'unknown' }));

    // Return health status
    return res.status(200).json({
      status: 'success',
      backendUrl,
      message: 'Backend connection successful',
      response: data,
      connected: true
    });
  } catch (error) {
    console.error('Backend health check error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error checking backend health',
      error: error.message,
      connected: false
    });
  }
} 