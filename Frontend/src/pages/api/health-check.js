import { getApiUrl } from '@/utils/api';

export default async function handler(req, res) {
  const backendUrl = getApiUrl();
  
  try {
    console.log('Health check request for backend URL:', backendUrl);
    
    // Try to reach the backend health endpoint
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000 // 5 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({
        status: 'success',
        message: 'Backend is accessible',
        backendUrl,
        backendResponse: data,
        connected: true
      });
    } else {
      return res.status(response.status).json({
        status: 'error',
        message: `Backend returned status ${response.status}`,
        backendUrl,
        statusCode: response.status,
        connected: false
      });
    }
  } catch (error) {
    console.error('Backend health check failed:', error);
    return res.status(500).json({
      status: 'error',
      backendUrl,
      message: 'Failed to connect to backend',
      error: error.message || 'Unknown error',
      connected: false
    });
  }
} 