import { getBackendUrl, checkBackendHealth } from '@/utils/apiConfig';

export default async function handler(req, res) {
  try {
    // Check configuration
    const backendUrl = getBackendUrl();
    
    // Try to connect to backend /health endpoint
    const healthStatus = await checkBackendHealth();
    
    // Return the health check results
    return res.status(200).json({
      status: healthStatus.isHealthy ? 'success' : 'error',
      message: healthStatus.message,
      backendUrl,
      details: healthStatus.details || {},
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasApiUrlConfig: !!process.env.NEXT_PUBLIC_API_URL,
      }
    });
  } catch (error) {
    console.error('Backend health check error:', error);
    return res.status(500).json({
      status: 'error',
      message: `Failed to check backend health: ${error.message}`,
      error: error.toString()
    });
  }
} 