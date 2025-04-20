/**
 * Utility for making fetch requests to the backend with proper error handling
 */
import { getBackendUrl } from './apiConfig';

/**
 * Fetch data from the backend API with proper error handling
 * 
 * @param {string} endpoint - The API endpoint (without /api prefix)
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Response data
 * @throws {Error} - If the request fails
 */
export async function fetchWithBackend(endpoint, options = {}) {
  // Get the correct backend URL based on environment
  const backendUrl = getBackendUrl();
  
  // Ensure endpoint starts with a slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Build the full URL
  const url = `${backendUrl}/api${normalizedEndpoint}`;
  
  try {
    console.log(`Fetching from: ${url}`);
    
    // Add default headers if not provided
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Parse JSON
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Invalid response from server');
    }
    
    // Check for error status codes
    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  } catch (error) {
    // Check if it's a network error (likely backend not running)
    if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
      throw new Error('Network error. Please check if the backend server is running and accessible.');
    }
    
    // Re-throw the error for handling by the caller
    throw error;
  }
}

export default fetchWithBackend; 