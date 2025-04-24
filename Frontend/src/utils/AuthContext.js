"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import apiService from './api';

// Create auth context
const AuthContext = createContext();

// Session storage key
const SESSION_AUTH_KEY = 'my-ride-auth-session';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore auth session from sessionStorage first for better page refreshes
  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      try {
        // Try to get user from sessionStorage first (fastest)
        if (typeof window !== 'undefined') {
          const sessionUser = sessionStorage.getItem(SESSION_AUTH_KEY);
          if (sessionUser) {
            const userData = JSON.parse(sessionUser);
            setUser(userData);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }
        
        // Then try to get user from localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          try {
            // Verify token by getting user profile
            const response = await apiService.auth.getProfile();
            
            if (response.status === 'success' && response.data) {
              setUser(response.data);
              setIsAuthenticated(true);
              // Update session storage to speed up future page loads
              if (typeof window !== 'undefined') {
                sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(response.data));
              }
            } else {
              // Invalid token
              handleLogout();
            }
          } catch (error) {
            console.error('Error verifying auth token:', error);
            // Token validation failed, clear authentication
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Authentication restoration error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    restoreSession();
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

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Attempting login with credentials:", {...credentials, password: '****'});
      
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      
      const response = await apiService.auth.login(credentials);
      console.log("Login response:", response);
      
      // Handle specific server error responses
      if (response.status === 'error' || response.error) {
        const errorMessage = response.message || response.error || 'Authentication failed';
        
        // Check for specific error conditions
        if (errorMessage.toLowerCase().includes('user not found') || 
            errorMessage.toLowerCase().includes('email not found')) {
          throw new Error('Account not found. Please check your email or register for a new account');
        }
        
        if (errorMessage.toLowerCase().includes('password') || 
            errorMessage.toLowerCase().includes('invalid credentials')) {
          throw new Error('Invalid password. Please try again');
        }
        
        throw new Error(errorMessage);
      }
      
      // Check if we have a token in the response
      if (response.token || (response.data && response.data.token)) {
        // Get the token from wherever it is in the response
        const token = response.token || response.data.token;
        
        // Store token
        localStorage.setItem('token', token);
        
        // Get user data
        const userData = response.data?.user || response.user || response.data;
        
        // Set user state
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store user in session storage for better refresh handling
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(userData));
        }
        
        return { success: true };
      } else {
        console.error("No token in response:", response);
        throw new Error('Login failed - authentication token not received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Enhance error message based on error type
      let errorMessage = error.message || 'Login failed';
      
      if (error.name === 'TypeError') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem('token');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    }
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
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
  const isAdmin = user && (user.role === 'admin' || user.role === 'administrator');

  // Value to be provided by context
  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    register,
    login: handleLogin,
    logout: handleLogout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateProfile,
    getToken: () => localStorage.getItem('token')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 