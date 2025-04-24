"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import apiService from './api';

// Create auth context
const AuthContext = createContext(null);

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

// Utility function to safely get/set from storage
const storage = {
  get: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Error getting ${key} from localStorage:`, e);
      return null;
    }
  },
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error(`Error setting ${key} in localStorage:`, e);
    }
  },
  remove: (key) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing ${key} from localStorage:`, e);
    }
  }
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          console.log("Found existing auth token, validating...");
          
          try {
            // Try to get user profile with the token
            const userData = await apiService.auth.getProfile();
            
            if (userData) {
              console.log("Token valid, user authenticated:", userData);
              setUser(userData.data || userData);
              setIsAuthenticated(true);
              
              // Update session storage
              if (typeof window !== 'undefined') {
                sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(userData.data || userData));
              }
            }
          } catch (profileError) {
            console.error("Error validating token:", profileError);
            
            // Clear invalid token
            localStorage.removeItem('token');
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem(SESSION_AUTH_KEY);
            }
            
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No token found, check for saved session
          if (typeof window !== 'undefined') {
            const savedSession = sessionStorage.getItem(SESSION_AUTH_KEY);
            
            if (savedSession) {
              try {
                const sessionData = JSON.parse(savedSession);
                console.warn("Found session data but no token - user will need to login again");
                
                // Clean up invalid session
                sessionStorage.removeItem(SESSION_AUTH_KEY);
              } catch (e) {
                console.error("Error parsing saved session:", e);
                sessionStorage.removeItem(SESSION_AUTH_KEY);
              }
            }
          }
          
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
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
        setIsAuthenticated(true);
        
        // Store user in session storage for better refresh handling
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(response.data));
        }
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
      const response = await apiService.auth.login(credentials);
      console.log("Login response:", response);
      
      // Check if we have a token in the response - handle all possible response structures
      const token = 
        response.token || 
        (response.data && response.data.token) || 
        (response.data && response.data.data && response.data.data.token);
      
      if (token) {
        console.log("Token received, storing authentication data");
        
        // Store token
        localStorage.setItem('token', token);
        
        // Get user data from response with fallbacks for different API response structures
        const userData = 
          response.data?.user || 
          response.user || 
          response.data || 
          (response.data?.data) || 
          {};
        
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
        throw new Error(response.message || 'Login failed - no token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid credentials');
      return { success: false, message: error.message || 'Login failed' };
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

  // Forgot password - fixed implementation
  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!email) {
        throw new Error('Email is required');
      }
      
      console.log('Requesting password reset for email:', email);
      const response = await apiService.auth.forgotPassword({ email });
      
      if (!response || response.status === 'error') {
        throw new Error(response?.message || 'Failed to process password reset request');
      }
      
      console.log('Password reset response:', response);
      return { 
        success: true, 
        message: response.message || 'Password reset instructions sent to your email'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.message || 'Failed to process password reset request');
      return { 
        success: false, 
        message: error.message || 'Failed to send reset email. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password - fixed implementation
  const resetPassword = async (token, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!token || !password) {
        throw new Error('Reset token and new password are required');
      }
      
      console.log('Attempting to reset password with token');
      const response = await apiService.auth.resetPassword(token, { password });
      
      if (!response || response.status === 'error') {
        throw new Error(response?.message || 'Failed to reset password');
      }
      
      console.log('Password reset successful:', response);
      return { 
        success: true, 
        message: response.message || 'Password has been reset successfully'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message || 'Failed to reset password');
      return { 
        success: false, 
        message: error.message || 'Failed to reset password. Please try again.'
      };
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
        const updatedUser = {
          ...user,
          ...response.data
        };
        
        setUser(updatedUser);
        
        // Update session storage with updated user data
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(updatedUser));
        }
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