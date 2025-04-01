"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import apiService from './api';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from local storage on initial render
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          // Get user profile from API
          const userData = await apiService.auth.getProfile();
          setUser(userData.data);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserFromStorage();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.auth.register(userData);
      
      // In development mode, we auto-verify users and get token back
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
      }
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Log in a user
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.auth.login(credentials);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
      }
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Log out a user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.auth.forgotPassword(email);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.auth.resetPassword(token, password);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.auth.verifyEmail(token);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.users.updateProfile(profileData);
      
      if (response.data) {
        setUser(prevUser => ({
          ...prevUser,
          ...response.data
        }));
      }
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  // Value to be provided by context
  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin,
    isLoading,
    error,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 