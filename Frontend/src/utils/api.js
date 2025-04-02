// src/utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * API service for making requests to the backend
 */
const apiService = {
  /**
   * Base method for making HTTP requests
   */
  async request(endpoint, options = {}) {
    const url = `${API_URL}/api${endpoint}`;
    
    // For debugging - log URL and options for login requests
    if (endpoint === '/auth/login') {
      console.log('Login request to:', url);
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
    }
    
    const config = {
      ...options,
      headers,
    };
    
    try {
      // For debugging - log login attempts
      if (endpoint === '/auth/login') {
        console.log('Attempting login with config:', JSON.stringify({
          method: config.method,
          headers: config.headers,
          bodyLength: config.body ? config.body.length : 0
        }));
      }
      
      const response = await fetch(url, config);
      
      // For debugging - log login response
      if (endpoint === '/auth/login') {
        console.log('Login response status:', response.status);
      }
      
      // Parse JSON response
      let data;
      try {
        data = await response.json();
        
        // For debugging - log login response data structure
        if (endpoint === '/auth/login') {
          console.log('Login response data structure:', Object.keys(data));
        }
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response from server. Please try again later.');
      }
      
      // Handle API errors
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
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
      // For multipart/form-data (with images), we need to use FormData and not set Content-Type
      const formData = new FormData();
      
      // Add car data fields
      Object.keys(carData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, carData[key]);
        }
      });
      
      // Add images if they exist
      if (carData.images && carData.images.length > 0) {
        carData.images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      return apiService.request('/cars', {
        method: 'POST',
        body: formData,
        headers: {}, // Override default Content-Type, let browser set it with boundary
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
      return apiService.request('/contact', {
        method: 'POST',
        body: JSON.stringify(inquiryData),
      });
    },
    
    async getAll(params = {}) {
      const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      return apiService.request(`/contact?${queryString}`);
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
  },
  
  // User endpoints
  user: {
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
      return apiService.request('/users/favorites');
    },
    
    async addToFavorites(carId) {
      return apiService.request(`/users/favorites/${carId}`, {
        method: 'POST',
      });
    },
    
    async removeFromFavorites(carId) {
      return apiService.request(`/users/favorites/${carId}`, {
        method: 'DELETE',
      });
    },
    
    // Admin methods
    async getAll() {
      return apiService.request('/users');
    },
    
    async getById(userId) {
      return apiService.request(`/users/${userId}`);
    },
    
    async updateUser(userId, userData) {
      return apiService.request(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    },
    
    async deleteUser(userId) {
      return apiService.request(`/users/${userId}`, {
        method: 'DELETE',
      });
    },
    
    async updateStatus(userId, isActive) {
      return apiService.request(`/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive }),
      });
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