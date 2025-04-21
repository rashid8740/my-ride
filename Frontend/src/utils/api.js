// src/utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get the base API URL with proper fallbacks
 * @returns {string} The API URL
 */
export function getApiUrl() {
  // Prioritize environment variable, then fallback to production URL if in production, and local if not
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Check if we're in Vercel production environment
  if (process.env.VERCEL_ENV === 'production') {
    return 'https://my-ride-backend-tau.vercel.app';
  }
  
  // Check if we're in a browser and in production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://my-ride-backend-tau.vercel.app';
  }
  
  // Default for local development
  return 'http://localhost:5000';
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
    const url = `${API_URL}/api${endpoint}`;
    
    const isImportantRequest = endpoint.includes('/auth/login') || endpoint.includes('/users');
    
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
    } else if (endpoint.startsWith('/users') && !endpoint.includes('/profile')) {
      // Non-profile user endpoints typically require authentication
      console.warn('Making request to protected endpoint without authentication token:', endpoint);
    }
    
    const config = {
      ...options,
      headers,
    };
    
    try {
      // Send the request
      const response = await fetch(url, config);
      
      // For debugging - log important responses
      if (isImportantRequest) {
        console.log(`Response status: ${response.status} - ${response.statusText}`);
      }
      
      // Clone response for raw access if parsing fails
      const clonedResponse = response.clone();
      
      // Parse JSON response
      let data;
      try {
        data = await response.json();
        
        // For debugging - log important response data
        if (isImportantRequest) {
          console.log('Response data:', {
            status: data.status,
            message: data.message
          });
        }
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        // Try to get raw text for better debugging
        const rawText = await clonedResponse.text();
        console.error('Raw response text:', rawText.substring(0, 500));
        throw new Error('Invalid response from server. Please try again later.');
      }
      
      // Handle API errors
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication error on endpoint:', endpoint);
          
          // Clear invalid token if authorization fails
          if (token && (data.message?.includes('Not authorized') || data.message?.includes('invalid token'))) {
            console.warn('Clearing invalid token');
            localStorage.removeItem('token');
            sessionStorage.removeItem('my-ride-auth-session');
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
      console.error('API request error:', error);
      
      // Network errors or other fetch failures
      if (error.name === 'TypeError') {
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          console.error('Network error details:', error);
          throw new Error('Network error. Please check if the backend server is running and accessible.');
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
      return apiService.request('/auth/me');
    },
    
    async forgotPassword(email) {
      return apiService.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    
    async resetPassword(token, password) {
      return apiService.request(`/auth/reset-password/${token}`, {
        method: 'POST',
        body: JSON.stringify({ password }),
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