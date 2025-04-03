"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from './api';
import { toast } from 'react-hot-toast';

// Create the favorites context
const FavoritesContext = createContext();

// LocalStorage key for favorites
const LOCAL_FAVORITES_KEY = 'my-ride-favorites';
const SESSION_FAVORITES_KEY = 'my-ride-session-favorites';

// Custom hook to use the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

// Favorites provider component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);

  // Initialize favorites from localStorage or API
  useEffect(() => {
    // First, try to load from sessionStorage for immediate display during refreshes
    const sessionFavs = loadSessionFavoritesSync();
    if (sessionFavs && sessionFavs.length > 0) {
      setFavorites(sessionFavs);
    } else {
      // Then try localStorage
      const localFavs = loadLocalFavoritesSync();
      if (localFavs && localFavs.length > 0) {
        setFavorites(localFavs);
        setUsingLocalStorage(true);
        // Save to session storage for better refresh handling
        saveSessionFavorites(localFavs);
      }
    }

    // Then if authenticated, try to load from API
    if (isAuthenticated && user) {
      loadFavorites();
    }
  }, [isAuthenticated, user]);

  // Check if backend is available periodically
  useEffect(() => {
    const checkBackendAvailability = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/health`, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        setBackendAvailable(response.ok);
      } catch (error) {
        console.log('Backend unavailable:', error);
        setBackendAvailable(false);
      }
    };

    // Check immediately
    checkBackendAvailability();
    
    // Then check every minute
    const interval = setInterval(checkBackendAvailability, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync with local storage whenever favorites change
  useEffect(() => {
    if (usingLocalStorage && favorites.length > 0) {
      saveLocalFavorites(favorites);
    }
  }, [favorites, usingLocalStorage]);

  // Load favorites synchronously from sessionStorage (for immediate display during refreshes)
  const loadSessionFavoritesSync = () => {
    try {
      if (typeof window !== 'undefined') {
        const sessionFavs = sessionStorage.getItem(SESSION_FAVORITES_KEY);
        if (sessionFavs) {
          return JSON.parse(sessionFavs);
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading from sessionStorage:', error);
      return null;
    }
  };

  // Save favorites to sessionStorage
  const saveSessionFavorites = (favs) => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SESSION_FAVORITES_KEY, JSON.stringify(favs));
      }
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  };

  // Load favorites synchronously from localStorage (for immediate display)
  const loadLocalFavoritesSync = () => {
    try {
      if (typeof window !== 'undefined') {
        const localFavs = localStorage.getItem(LOCAL_FAVORITES_KEY);
        if (localFavs) {
          return JSON.parse(localFavs);
        }
      }
      return [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  };

  // Save favorites to localStorage
  const saveLocalFavorites = (favs) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favs));
        // Also save to session storage for better refresh handling
        saveSessionFavorites(favs);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Load favorites from localStorage
  const loadLocalFavorites = () => {
    try {
      if (typeof window !== 'undefined') {
        const localFavs = localStorage.getItem(LOCAL_FAVORITES_KEY);
        if (localFavs) {
          setFavorites(JSON.parse(localFavs));
          setUsingLocalStorage(true);
          // Also update session storage
          saveSessionFavorites(JSON.parse(localFavs));
        } else {
          setFavorites([]);
          setUsingLocalStorage(true);
        }
      } else {
        setFavorites([]);
        setUsingLocalStorage(true);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setFavorites([]);
      setUsingLocalStorage(true);
    }
  };

  // Load user's favorites from the API
  const loadFavorites = async () => {
    if (!backendAvailable) {
      loadLocalFavorites();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.user.getFavorites();
      if (response.data) {
        setFavorites(response.data);
        setUsingLocalStorage(false);
        
        // Also update localStorage and sessionStorage for persistence
        saveLocalFavorites(response.data);
        saveSessionFavorites(response.data);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Failed to load favorites from server. Using local data instead.');
      toast('Server connection issue. Using local favorites instead.', {
        icon: '⚠️',
        style: {
          borderRadius: '10px',
          background: '#FEF3C7',
          color: '#92400E',
        },
      });
      // Fall back to localStorage
      loadLocalFavorites();
      setBackendAvailable(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a car is in favorites
  const isFavorite = (carId) => {
    if (!favorites || favorites.length === 0) return false;
    
    // Always work with string version of IDs for comparison
    const normalizedId = String(carId);
    console.log(`Checking if ${normalizedId} is in favorites`);
    
    // Check against all possible formats
    const result = favorites.some(fav => {
      if (typeof fav === 'object') {
        const favIdStr1 = String(fav._id || '');
        const favIdStr2 = String(fav.id || '');
        return favIdStr1 === normalizedId || favIdStr2 === normalizedId;
      } else {
        const favIdStr = String(fav || '');
        return favIdStr === normalizedId;
      }
    });
    
    console.log(`Is ${normalizedId} in favorites? ${result}`);
    return result;
  };

  // Add a car to favorites
  const addToFavorites = async (carId) => {
    // CRITICAL FIX: Always use a consistent string format for IDs
    const normalizedId = String(carId);
    console.log("Raw Adding to favorites, ID:", carId, "type:", typeof carId);
    console.log("Normalized Adding to favorites, ID:", normalizedId);
    
    // Check if it's already a favorite with normalized ID
    if (isFavorite(normalizedId)) {
      console.log("Already in favorites, skipping");
      return { success: true };
    }
    
    // Always update local state immediately with the normalized ID for better UX
    const newFavorites = [...favorites, normalizedId];
    console.log("New favorites:", newFavorites);
    setFavorites(newFavorites);
    saveLocalFavorites(newFavorites);
    saveSessionFavorites(newFavorites);
    
    if (!isAuthenticated || !backendAvailable) {
      setUsingLocalStorage(true);
      return { success: true };
    }

    // For MongoDB, convert the ID to a compatible format
    const mongoCompatibleId = ensureMongoId(normalizedId);

    try {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiService.user.addToFavorites(mongoCompatibleId);
        
        if (response.status === 'success') {
          // Reload favorites to get updated list
          await loadFavorites();
          return { success: true };
        } else {
          throw new Error(response.message || 'Failed to add to favorites');
        }
      } catch (apiError) {
        console.error('API Error adding to favorites:', apiError);
        // Fall back to localStorage only
        setUsingLocalStorage(true);
        setBackendAvailable(false);
        toast('Added to local favorites (server unavailable)', {
          icon: '⚠️',
          style: {
            borderRadius: '10px',
            background: '#FEF3C7',
            color: '#92400E',
          },
        });
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setError(error.message || 'Failed to add to favorites');
      return { success: false, message: error.message || 'Failed to add to favorites' };
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a car from favorites
  const removeFromFavorites = async (carId) => {
    // CRITICAL FIX: Always use a consistent string format for IDs
    const normalizedId = String(carId);
    console.log("Raw Removing from favorites, ID:", carId, "type:", typeof carId);
    console.log("Normalized Removing from favorites, ID:", normalizedId);
    
    // Always update local state immediately for better UX
    const newFavorites = favorites.filter(fav => {
      if (typeof fav === 'object') {
        return String(fav._id || '') !== normalizedId && String(fav.id || '') !== normalizedId;
      } else {
        return String(fav) !== normalizedId;
      }
    });
    
    console.log("New favorites after removal:", newFavorites);
    setFavorites(newFavorites);
    saveLocalFavorites(newFavorites);
    saveSessionFavorites(newFavorites);
    
    if (!isAuthenticated || !backendAvailable) {
      setUsingLocalStorage(true);
      return { success: true };
    }

    // For MongoDB, convert the ID to a compatible format
    const mongoCompatibleId = ensureMongoId(normalizedId);

    try {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiService.user.removeFromFavorites(mongoCompatibleId);
        
        if (response.status === 'success') {
          // Reload favorites to get updated list
          await loadFavorites();
          return { success: true };
        } else {
          throw new Error(response.message || 'Failed to remove from favorites');
        }
      } catch (apiError) {
        console.error('API Error removing from favorites:', apiError);
        // Already updated localStorage above
        setUsingLocalStorage(true);
        setBackendAvailable(false);
        toast('Removed from local favorites (server unavailable)', {
          icon: '⚠️',
          style: {
            borderRadius: '10px',
            background: '#FEF3C7',
            color: '#92400E',
          },
        });
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setError(error.message || 'Failed to remove from favorites');
      return { success: false, message: error.message || 'Failed to remove from favorites' };
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert simple numeric IDs to MongoDB compatible format
  const ensureMongoId = (id) => {
    // If it's already a valid MongoDB ObjectId (24 hex chars), return as is
    if (typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)) {
      return id;
    }
    
    // For sample/mock data with simple numeric IDs, create a fake ObjectId
    // by padding the number with zeros to make a 24-character hex string
    // Make sure the result is a valid hex string by only using 0-9 and a-f
    let result;
    
    if (typeof id === 'string' && /^\d+$/.test(id)) {
      // Convert numeric string to hex string
      const numericValue = parseInt(id, 10);
      const hexValue = numericValue.toString(16);
      // Pad with zeros to make a 24-character string
      result = hexValue.padStart(24, '0');
    } else if (typeof id === 'number') {
      // Convert number to hex string
      const hexValue = id.toString(16);
      // Pad with zeros to make a 24-character string
      result = hexValue.padStart(24, '0');
    } else {
      // If we can't convert it, return as is
      return id;
    }
    
    // Ensure the result only contains valid hex characters (0-9, a-f)
    if (!/^[0-9a-f]{24}$/.test(result)) {
      // Replace any invalid characters with '0'
      result = result.replace(/[^0-9a-f]/g, '0');
      // If still not 24 characters, pad or truncate
      result = result.padEnd(24, '0').substring(0, 24);
    }
    
    return result;
  };

  // Toggle favorite status
  const toggleFavorite = async (carId) => {
    console.log("Toggle favorite for carId:", carId);
    
    // Make sure we have a normalized ID
    const normalizedId = String(carId);
    console.log("Using normalized ID:", normalizedId);
    
    if (isFavorite(normalizedId)) {
      console.log("Car is in favorites, removing it");
      return await removeFromFavorites(normalizedId);
    } else {
      console.log("Car is not in favorites, adding it");
      return await addToFavorites(normalizedId);
    }
  };

  // Value to be provided by context
  const value = {
    favorites,
    isLoading,
    error,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    favoritesCount: favorites.length,
    usingLocalStorage,
    backendAvailable,
    refreshFavorites: loadFavorites
  };

  // Debug logging to trace favorites state
  useEffect(() => {
    console.log("Current favorites:", favorites);
    console.log("Using localStorage:", usingLocalStorage);
    console.log("Backend available:", backendAvailable);
  }, [favorites, usingLocalStorage, backendAvailable]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext; 
 
 