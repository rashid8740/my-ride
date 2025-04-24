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
      const response = await apiService.auth.login(credentials);
      console.log("Login response:", response);
      
      // First extract token from response
      let token = null;
      let userData = null;
      
      // Check standard API format: { status, message, data: { id, firstName, lastName, email, role, token } }
      if (response.status === 'success' && response.data && response.data.token) {
        console.log("Standard API response format detected");
        token = response.data.token;
        userData = response.data;
      } 
      // Check older format: { token, user: {...} }
      else if (response.token) {
        console.log("Legacy API response format detected (token at root)");
        token = response.token;
        userData = response.user || response;
      }
      
      if (token) {
        console.log("Token extracted:", token.substring(0, 15) + "...");
        // Store token
        localStorage.setItem('token', token);
        
        // Set user state
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store user in session storage for better refresh handling
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(userData));
        }
        
        console.log("Login successful, user data stored:", userData);
        return { success: true };
      } else {
        console.error("No token found in response:", response);
        throw new Error('Login failed - no token received. Check console for details.');
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