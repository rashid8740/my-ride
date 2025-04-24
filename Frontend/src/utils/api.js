// src/utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get the base API URL with proper fallbacks
 * @returns {string} The API URL
 */
export function getApiUrl() {
  // Check session storage for preferred API URL first (set by connectivity checks)
  if (typeof window !== 'undefined' && sessionStorage.getItem('preferred_api_url')) {
    const preferredUrl = sessionStorage.getItem('preferred_api_url');
    console.log('Using preferred API URL from session:', preferredUrl);
    return preferredUrl;
  }

  // Prioritize environment variable, then fallback to production URL if in production, and local if not
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Check if we're in a browser and in production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Return the correct backend URL
    return 'https://my-ride-backend.vercel.app';
  }
  
  // Default for local development
  return 'http://localhost:5000';
}

/**
 * Diagnose API connection issues
 * @param {string} apiUrl - The URL to diagnose
 * @returns {Promise<Object>} Diagnostic results
 */
export async function diagnoseApiConnection(apiUrl) {
  console.log(`🔍 Diagnosing API connection to ${apiUrl}...`);
  const results = {
    url: apiUrl,
    dns: false,
    connection: false,
    cors: null,
    response: null,
    error: null,
    timestamp: new Date().toISOString()
  };
  
  try {
    // Try HEAD request first (lightweight)
    console.log(`Attempting HEAD request to ${apiUrl}...`);
    const headResponse = await fetch(apiUrl, {
      method: 'HEAD',
      mode: 'cors',
      // 5 second timeout
      signal: AbortSignal.timeout(5000)
    });
    
    results.connection = true;
    results.cors = true;
    results.response = {
      status: headResponse.status,
      ok: headResponse.ok,
      headers: Object.fromEntries([...headResponse.headers]),
    };
    
    console.log(`✅ HEAD request successful: ${headResponse.status}`);
    return results;
  } catch (headError) {
    results.error = {
      name: headError.name,
      message: headError.message
    };
    
    // If we got a TypeError, DNS or connection failed
    if (headError.name === 'TypeError') {
      console.log(`❌ Connection error: ${headError.message}`);
      
      // Check if it's a CORS issue by trying no-cors mode
      try {
        console.log('Attempting no-cors request to check if server is reachable...');
        await fetch(apiUrl, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: AbortSignal.timeout(5000)
        });
        
        // If we get here, the server is reachable but might have CORS issues
        results.connection = true;
        results.cors = false;
        console.log('✅ Server is reachable, but CORS might be an issue');
      } catch (noCorsError) {
        console.log(`❌ No-cors request also failed: ${noCorsError.message}`);
        // Even no-cors failed, might be a real connectivity issue
        results.connection = false;
      }
    } else if (headError.name === 'AbortError') {
      console.log('❌ Request timed out');
      results.connection = false;
    }
    
    return results;
  }
}

/**
 * Make an API request with proper error handling
 * @param {string} endpoint - API endpoint without leading slash
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}/${endpoint.startsWith('api/') ? endpoint : `api/${endpoint}`}`;
  
  try {
    // Add default headers if not provided
    const headers = options.headers || {};
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Check if the network response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request to ${url} failed:`, error);
    throw error;
  }
}

/**
 * Check if the backend is accessible
 * @returns {Promise<boolean>} Whether the backend is accessible
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${getApiUrl()}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

/**
 * API service for making requests to the backend
 */
const apiService = {
  /**
   * Base method for making HTTP requests
   */
  async request(endpoint, options = {}) {
    // Use getApiUrl to ensure correct URL in all environments
    const url = `${getApiUrl()}/api${endpoint}`;
    
    const isImportantRequest = endpoint.includes('/auth/login') || endpoint.includes('/users') || endpoint.includes('/auth/me');
    
    if (isImportantRequest) {
      console.log(`API Request to: ${url} [${options.method || 'GET'}]`);
    }
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      if (isImportantRequest) {
        console.log('Using token for request:', token.substring(0, 15) + '...');
      }
    } else if (isImportantRequest && (endpoint.includes('/auth/me') || endpoint === '/user')) {
      // Skip requests that require auth if no token available
      console.warn('Auth token required but not available for:', endpoint);
      throw new Error('Authentication required. Please log in first.');
    }
    
    // Create fetch config with proper signal handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
    
    // Build config object properly to include signal
    const config = {
      method: options.method || 'GET',
      headers,
      body: options.body,
      credentials: options.credentials,
      cache: options.cache,
      redirect: options.redirect,
      referrer: options.referrer,
      referrerPolicy: options.referrerPolicy,
      integrity: options.integrity,
      keepalive: options.keepalive,
      signal: controller.signal
    };
    
    try {
      if (isImportantRequest) {
        console.log(`Initiating fetch to ${url} with config:`, {
          method: config.method,
          headers: { ...config.headers, Authorization: token ? 'Bearer [REDACTED]' : undefined }
        });
      }
      
      // Perform the fetch operation
      const response = await fetch(url, config);
      
      // Clear timeout since request completed
      clearTimeout(timeoutId);
      
      if (isImportantRequest) {
        console.log(`Response from ${url}: ${response.status} ${response.statusText}`);
      }
      
      // Parse the response data
      const data = await response.json().catch(err => {
        console.warn(`Error parsing JSON from ${url}:`, err);
        return { message: 'Invalid response from server' };
      });
      
      if (isImportantRequest) {
        console.log(`Response data from ${url}:`, data);
      }
      
      // Handle API errors
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication error on endpoint:', endpoint);
          
          // Clear invalid token if authorization fails
          if (token && (data.message?.includes('Not authorized') || 
                        data.message?.includes('invalid token') || 
                        data.message?.includes('jwt expired') ||
                        data.message?.includes('Authentication required'))) {
            console.warn('Clearing invalid token due to auth error');
            localStorage.removeItem('token');
            sessionStorage.removeItem('my-ride-auth-session');
            
            // Reload the page to reset the app state if on a protected route
            if (typeof window !== 'undefined' && 
                window.location.pathname !== '/' && 
                window.location.pathname !== '/login' &&
                window.location.pathname !== '/register' &&
                !window.location.pathname.includes('/reset-password')) {
              console.log('Redirecting to login page due to auth error');
              window.location.href = '/login';
              return null; // Stop execution
            }
          }
          
          throw new Error('Authentication required. Please log in first.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to access this resource.');
        } else if (response.status === 404) {
          throw new Error('The requested resource was not found.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(data.message || `Server error (${response.status})`);
      }
      
      return data;
    } catch (error) {
      // Clear timeout if there was an error
      clearTimeout(timeoutId);
      
      console.error('API request error:', error);
      
      // Handle timeout errors
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again later.');
      }
      
      // Network errors or other fetch failures
      if (error.name === 'TypeError') {
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          console.error('Network error details:', error);
          
          // Special case for login, try with direct API call as a fallback
          if (endpoint === '/auth/login' && options.method === 'POST') {
            try {
              // Run diagnostics on the API URL
              const apiUrl = getApiUrl();
              console.log('Running API connection diagnostics...');
              const diagnosticResults = await diagnoseApiConnection(apiUrl);
              console.log('Diagnostic results:', diagnosticResults);
              
              // Try multiple backend URLs in sequence
              const fallbackUrls = [
                getApiUrl(),
                'https://my-ride-backend.vercel.app',
                'https://my-ride-backend.onrender.com'
              ];
              
              console.log('Attempting direct login with multiple backends as fallback...');
              
              // Try each URL in sequence
              for (const baseUrl of fallbackUrls) {
                try {
                  console.log(`Trying login with: ${baseUrl}/api/auth/login`);
                  const directResponse = await fetch(`${baseUrl}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: options.body,
                    // 10 second timeout for fallback attempts
                    signal: AbortSignal.timeout(10000)
                  });
                  
                  if (directResponse.ok) {
                    const directData = await directResponse.json();
                    console.log(`Direct login succeeded with ${baseUrl}`);
                    return directData;
                  } else {
                    console.log(`Direct login failed with ${baseUrl}:`, directResponse.status);
                  }
                } catch (urlError) {
                  console.error(`Failed with ${baseUrl}:`, urlError.message);
                }
              }
            } catch (directError) {
              console.error('All direct login attempts failed:', directError);
            }
          }
          
          throw new Error('Network error. Please try one of the following: 1) Check if the backend server is running and accessible. 2) Try a different network connection. 3) Check browser console for detailed error information.');
        }
      }
      
      throw error;
    }
  },
  
  // Auth endpoints
  auth: {
    async register(userData) {
      return apiService.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    
    async login(credentials) {
      return apiService.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },
    
    async getProfile() {
      try {
        // Check for token first
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token missing for getProfile request');
          throw new Error('Authentication required. Please log in first.');
        }
        
        // Make the request with explicit auth header
        const response = await apiService.request('/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Get profile response:', response);
        return response;
      } catch (error) {
        console.error('Error getting profile:', error);
        throw error;
      }
    },
    
    async forgotPassword(emailData) {
      // Support both object format and string format for backward compatibility
      const email = typeof emailData === 'string' ? emailData : emailData.email;
      const payload = typeof emailData === 'string' ? { email } : emailData;
      
      console.log('Sending forgot password request with:', { ...payload });
      
      return apiService.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    
    async resetPassword(token, passwordData) {
      // Support both object format and string format for backward compatibility
      const password = typeof passwordData === 'string' ? passwordData : passwordData.password;
      const payload = typeof passwordData === 'string' ? { password } : passwordData;
      
      console.log('Sending reset password request with token');
      
      return apiService.request(`/auth/reset-password/${token}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    
    async verifyEmail(token) {
      return apiService.request(`/auth/verify/${token}`);
    },
  },
  
  // Cars endpoints
  cars: {
    async getAll(params = {}) {
      // Convert params object to query string
      const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      return apiService.request(`/cars?${queryString}`);
    },
    
    async getFeatured(limit = 6) {
      return apiService.request(`/cars/featured?limit=${limit}`);
    },
    
    async getById(id) {
      return apiService.request(`/cars/${id}`);
    },
    
    async create(carData) {
      console.log('Creating car with data:', carData);
      
      // Send the car data as JSON since we've already uploaded images
      // and have their URLs in the images array
      return apiService.request('/cars', {
        method: 'POST',
        body: JSON.stringify(carData),
      });
    },
    
    async update(id, carData) {
      return apiService.request(`/cars/${id}`, {
        method: 'PUT',
        body: JSON.stringify(carData),
      });
    },
    
    async delete(id) {
      return apiService.request(`/cars/${id}`, {
        method: 'DELETE',
      });
    },
    
    async uploadImages(id, imageFiles) {
      const formData = new FormData();
      
      imageFiles.forEach(image => {
        formData.append('images', image);
      });
      
      return apiService.request(`/cars/${id}/images`, {
        method: 'POST',
        body: formData,
        headers: {}, // Override default Content-Type
      });
    },
    
    async setMainImage(carId, imageId) {
      return apiService.request(`/cars/${carId}/images/${imageId}/main`, {
        method: 'PATCH',
      });
    },
    
    async deleteImage(carId, imageId) {
      return apiService.request(`/cars/${carId}/images/${imageId}`, {
        method: 'DELETE',
      });
    },
  },
  
  // Contact endpoints
  contact: {
    async submitInquiry(inquiryData) {
      console.log('🔍 [API] Submitting inquiry with data:', inquiryData);
      console.log(`🔍 [API] API URL: ${API_URL}/api/contact`);
      
      try {
        const response = await apiService.request('/contact', {
          method: 'POST',
          body: JSON.stringify(inquiryData),
        });
        console.log('✅ [API] Inquiry submission successful:', response);
        return response;
      } catch (error) {
        console.error('❌ [API] Inquiry submission failed:', error);
        console.error('❌ [API] Error details:', {
          message: error.message,
          url: `${API_URL}/api/contact`,
          data: inquiryData
        });
        throw error;
      }
    },
    
    async getAll(params = {}) {
      console.log('🔍 [API] Fetching all inquiries with params:', params);
      const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      try {
        const response = await apiService.request(`/contact?${queryString}`);
        console.log(`✅ [API] Retrieved ${response.data?.length || 0} inquiries`);
        return response;
      } catch (error) {
        console.error('❌ [API] Failed to fetch inquiries:', error);
        throw error;
      }
    },
    
    async getById(id) {
      return apiService.request(`/contact/${id}`);
    },
    
    async updateStatus(id, status) {
      return apiService.request(`/contact/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    
    async assignToUser(id, userId) {
      return apiService.request(`/contact/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ userId }),
      });
    },
    
    async addResponse(id, message) {
      return apiService.request(`/contact/${id}/response`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },
    
    async delete(id) {
      console.log('🔍 [API] Deleting inquiry with ID:', id);
      try {
        const response = await apiService.request(`/contact/${id}`, {
          method: 'DELETE',
        });
        console.log('✅ [API] Inquiry deletion successful:', response);
        return response;
      } catch (error) {
        console.error('❌ [API] Inquiry deletion failed:', error);
        throw error;
      }
    },
  },
  
  // User endpoints
  users: {
    async updateProfile(profileData) {
      return apiService.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    },
    
    async uploadAvatar(imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      return apiService.request('/users/avatar', {
        method: 'POST',
        body: formData,
        headers: {}, // Override default Content-Type
      });
    },
    
    async getFavorites() {
      // Deprecated - use favorites.getAll() instead
      console.warn('api.users.getFavorites() is deprecated, use api.favorites.getAll() instead');
      return apiService.request('/favorites');
    },
    
    async addToFavorites(carId) {
      // Deprecated - use favorites.add() instead
      console.warn('api.users.addToFavorites() is deprecated, use api.favorites.add() instead');
      return apiService.request(`/favorites/${carId}`, {
        method: 'POST',
      });
    },
    
    async removeFromFavorites(carId) {
      // Deprecated - use favorites.remove() instead
      console.warn('api.users.removeFromFavorites() is deprecated, use api.favorites.remove() instead');
      return apiService.request(`/favorites/${carId}`, {
        method: 'DELETE',
      });
    },
    
    // Admin user management endpoints
    async getAll() {
      console.log('API: Fetching all users');
      try {
        // First try admin-specific endpoint
        try {
          const response = await apiService.request('/admin/users');
          console.log('Admin users endpoint response:', response);
          
          if (response && Array.isArray(response.users)) {
            console.log(`Admin endpoint: Successfully fetched ${response.users.length} users`);
            return {
              status: 'success',
              data: response.users,
              count: response.users.length
            };
          }
        } catch (adminError) {
          console.log('Admin endpoint failed, trying generic users endpoint:', adminError.message);
        }
        
        // Fall back to standard users endpoint
        const response = await apiService.request('/users');
        console.log('Standard users endpoint response:', response);
        
        // Handle different response formats
        if (response && response.status === 'success' && Array.isArray(response.data)) {
          // Format: { status: 'success', data: [...] }
          console.log(`Successfully fetched ${response.data.length} users`);
          return response;
        } else if (response && Array.isArray(response.users)) {
          // Format: { users: [...] }
          console.log(`Successfully fetched ${response.users.length} users`);
          return {
            status: 'success',
            data: response.users,
            count: response.users.length
          };
        } else if (response && Array.isArray(response)) {
          // Format: [...]
          console.log(`Successfully fetched ${response.length} users`);
          return {
            status: 'success',
            data: response,
            count: response.length
          };
        }
        
        console.error('Invalid response format from users API:', response);
        throw new Error('Invalid response format from users API');
      } catch (error) {
        console.error('Error in users.getAll():', error);
        throw error;
      }
    },
    
    async getById(userId) {
      try {
        // Try admin endpoint first
        try {
          const response = await apiService.request(`/admin/users/${userId}`);
          return response;
        } catch (adminError) {
          console.log('Admin user detail endpoint failed, trying standard endpoint');
          return await apiService.request(`/users/${userId}`);
        }
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        throw error;
      }
    },
    
    async create(userData) {
      console.log('API: Creating new user', userData);
      try {
        // Try admin route first
        try {
          const response = await apiService.request('/admin/users', {
            method: 'POST',
            body: JSON.stringify(userData),
          });
          return response;
        } catch (adminError) {
          console.log('Admin create user endpoint failed, trying standard endpoint');
          return await apiService.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
          });
        }
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    },
    
    async updateUser(userId, userData) {
      try {
        // Try admin endpoint first
        try {
          const response = await apiService.request(`/admin/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
          });
          return response;
        } catch (adminError) {
          console.log('Admin update user endpoint failed, trying standard endpoint');
          return await apiService.request(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
          });
        }
      } catch (error) {
        console.error(`Error updating user ${userId}:`, error);
        throw error;
      }
    },
    
    async deleteUser(userId) {
      try {
        // Try admin endpoint first
        try {
          const response = await apiService.request(`/admin/users/${userId}`, {
            method: 'DELETE',
          });
          return response;
        } catch (adminError) {
          console.log('Admin delete user endpoint failed, trying standard endpoint');
          return await apiService.request(`/users/${userId}`, {
            method: 'DELETE',
          });
        }
      } catch (error) {
        console.error(`Error deleting user ${userId}:`, error);
        throw error;
      }
    },
    
    async updateStatus(userId, isActive) {
      return apiService.request(`/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive }),
      });
    },
  },
  
  // New favorites endpoints
  favorites: {
    async getAll() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }
        return apiService.request('/favorites');
      } catch (error) {
        console.error('Error getting favorites:', error);
        throw error;
      }
    },
    
    async check(carId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }
        return apiService.request(`/favorites/check/${carId}`);
      } catch (error) {
        console.error('Error checking favorite:', error);
        throw error;
      }
    },
    
    async add(carId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }
        return apiService.request(`/favorites/${carId}`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
      }
    },
    
    async remove(carId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }
        return apiService.request(`/favorites/${carId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
      }
    },
    
    async sync(localFavorites) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }
        return apiService.request('/favorites/sync', {
          method: 'POST',
          body: JSON.stringify({ localFavorites }),
        });
      } catch (error) {
        console.error('Error syncing favorites:', error);
        throw error;
      }
    },
  },
  
  // Dashboard endpoints
  dashboard: {
    async getStats() {
      return apiService.request('/dashboard/stats');
    },
  },
};

export default apiService; 