import { getApiUrl } from '@/utils/api';

/**
 * This API endpoint provides information about environment variables
 * for debugging purposes only. Never expose sensitive data.
 */
export default async function handler(req, res) {
  // Collect safe environment variables (no secrets)
  const safeEnvVars = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  };

  // Get API URL from our utility
  let apiUrl;
  try {
    apiUrl = getApiUrl();
  } catch (error) {
    apiUrl = 'Error getting API URL: ' + error.message;
  }

  // Test direct connectivity to backend
  let backendConnectivity = null;
  try {
    const testUrl = 'https://my-ride-backend-tau.vercel.app/api/health';
    const connectivityResponse = await fetch(testUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    backendConnectivity = {
      url: testUrl,
      status: connectivityResponse.status,
      statusText: connectivityResponse.statusText,
      ok: connectivityResponse.ok
    };
  } catch (error) {
    backendConnectivity = {
      error: error.message,
      connected: false
    };
  }

  // Share the environment details
  return res.status(200).json({
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    variables: safeEnvVars,
    apiUtilResult: apiUrl,
    backendConnectivity
  });
} 