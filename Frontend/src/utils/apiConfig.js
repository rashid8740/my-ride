/**
 * API Configuration Utility
 * 
 * This utility handles determining the correct backend URL based on the environment:
 * - In development: Uses localhost
 * - In production: Uses the deployed backend URL or falls back to API gateway URL
 */

// Helper to determine if we're running on the server side
const isServer = typeof window === 'undefined';

/**
 * Get the appropriate backend URL based on current environment
 */
export function getBackendUrl() {
  // Check for environment variables
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // If we have a configured URL, use it
  if (configuredUrl) {
    console.log(`Using configured backend URL: ${configuredUrl}`);
    return configuredUrl;
  }

  // Determine if we're in production or development
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // In production, use the main API URL or the Vercel deployment URL
    // Note: You should set NEXT_PUBLIC_API_URL in your Vercel environment variables
    const productionUrl = 'https://api.my-ride.com';
    console.log(`Using production backend URL: ${productionUrl}`);
    return productionUrl;
  } else {
    // In development, use localhost
    const devUrl = 'http://localhost:5000';
    console.log(`Using development backend URL: ${devUrl}`);
    return devUrl;
  }
}

/**
 * Check the health of the backend API
 */
export async function checkBackendHealth() {
  const backendUrl = getBackendUrl();
  const healthUrl = `${backendUrl}/api/health`;
  
  console.log(`Checking health of backend at: ${healthUrl}`);
  
  try {
    const response = await fetch(healthUrl, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Short timeout to avoid hanging
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        isHealthy: true,
        message: data.message || 'Backend is healthy',
        details: data
      };
    } else {
      return {
        isHealthy: false,
        message: `Backend returned status: ${response.status}`,
        details: null
      };
    }
  } catch (error) {
    return {
      isHealthy: false,
      message: `Could not connect to backend: ${error.message}`,
      details: error
    };
  }
}

// Default export with all utilities
export default {
  getBackendUrl,
  checkBackendHealth
}; 