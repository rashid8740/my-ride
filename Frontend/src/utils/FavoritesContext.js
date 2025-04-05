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
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);

  // Load favorites from storage first, then try API
  useEffect(() => {
    // Immediately load from session/local storage
    const initialLoad = () => {
      // First load from session storage (fastest)
      const sessionFavs = loadSessionFavoritesSync();
      console.log("Initial session favorites:", sessionFavs);
      
      if (sessionFavs && sessionFavs.length > 0) {
        console.log("Using session favorites on initial load");
        setFavorites(sessionFavs);
        setUsingLocalStorage(true);
        return true;
      }
      
      // If no session favorites, try localStorage
      const localFavs = loadLocalFavoritesSync();
      console.log("Initial local favorites:", localFavs);
      
      if (localFavs && localFavs.length > 0) {
        console.log("Using local favorites on initial load");
        setFavorites(localFavs);
        setUsingLocalStorage(true);
        // Save to session for better performance on subsequent navigations
        saveSessionFavorites(localFavs);
        return true;
      }
      
      return false;
    };
    
    // Run initial load from storage
    const loadedFromStorage = initialLoad();
    
    // Then if authenticated, try to load from API
    const loadFromApi = async () => {
      if (isAuthenticated && user) {
        try {
          await loadFavorites();
        } catch (error) {
          console.error("Error loading favorites from API:", error);
          // We already loaded from storage, so no further action needed
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadFromApi();
    
    // Set loading to false even if nothing loaded
    if (!loadedFromStorage && (!isAuthenticated || !user)) {
      setIsLoading(false);
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
        console.log("Backend availability check:", response.ok ? "✅ Available" : "❌ Unavailable");
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
    if (favorites.length > 0) {
      // Always save to both storage types for maximum persistence
      saveLocalFavorites(favorites);
      saveSessionFavorites(favorites);
      console.log("Favorites changed, saved to storage:", favorites);
    }
  }, [favorites]);

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
      if (typeof window !== 'undefined' && favs && Array.isArray(favs)) {
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
      if (typeof window !== 'undefined' && favs && Array.isArray(favs)) {
        console.log('Saving to localStorage:', favs);
        localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favs));
      }
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  // Load favorites from localStorage
  const loadLocalFavorites = () => {
    try {
      if (typeof window !== 'undefined') {
        const localFavs = localStorage.getItem(LOCAL_FAVORITES_KEY);
        if (localFavs) {
          const parsedFavs = JSON.parse(localFavs);
          setFavorites(parsedFavs);
          setUsingLocalStorage(true);
          // Also update session storage
          saveSessionFavorites(parsedFavs);
          return parsedFavs;
        } else {
          setFavorites([]);
          setUsingLocalStorage(true);
          return [];
        }
      } else {
        setFavorites([]);
        setUsingLocalStorage(true);
        return [];
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setFavorites([]);
      setUsingLocalStorage(true);
      return [];
    }
  };

  // Load user's favorites from the API
  const loadFavorites = async () => {
    if (!backendAvailable) {
      const localFavs = loadLocalFavorites();
      console.log("Backend unavailable, using local favorites:", localFavs);
      return localFavs;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Loading favorites from API...");
      const response = await apiService.user.getFavorites();
      console.log("API favorites response:", response);
      
      if (response.data) {
        setFavorites(response.data);
        setUsingLocalStorage(false);
        
        // Also update localStorage and sessionStorage for persistence
        saveLocalFavorites(response.data);
        saveSessionFavorites(response.data);
        
        console.log("Loaded favorites from API:", response.data);
        return response.data;
      }
      return [];
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
      const localFavs = loadLocalFavorites();
      setBackendAvailable(false);
      return localFavs;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a car is in favorites - improved version
  const isFavorite = (carId) => {
    if (!favorites || favorites.length === 0) return false;
    
    // Normalize to number if possible
    let numericId = null;
    if (typeof carId === 'number') {
      numericId = carId; 
    } else if (typeof carId === 'string' && /^\d+$/.test(carId)) {
      numericId = parseInt(carId, 10);
    }
    
    console.log(`Checking if ${carId} (${typeof carId}) is favorite, numeric: ${numericId}`);
    console.log("Current favorites:", favorites);
    
    const result = favorites.some(fav => {
      // Object type favorite (from API)
      if (typeof fav === 'object' && fav !== null) {
        const favId = fav.id || fav._id;
        const match = favId === carId || 
                     (numericId !== null && (favId === numericId || Number(favId) === numericId)) ||
                     String(favId) === String(carId);
        if (match) console.log(`Match found: object with ID ${favId}`);
        return match;
      } 
      // Number type (from local storage)
      else if (typeof fav === 'number' && numericId !== null) {
        const match = fav === numericId;
        if (match) console.log(`Match found: number ${fav} === ${numericId}`);
        return match;
      }
      // String type
      else if (typeof fav === 'string') {
        // Try numeric comparison if both can be numbers
        if (numericId !== null && /^\d+$/.test(fav)) {
          const match = parseInt(fav, 10) === numericId;
          if (match) console.log(`Match found: string "${fav}" as number === ${numericId}`);
          return match;
        }
        // String comparison
        const match = String(fav) === String(carId);
        if (match) console.log(`Match found: string "${fav}" === "${carId}"`);
        return match;
      }
      // Fallback
      return String(fav) === String(carId);
    });
    
    console.log(`isFavorite result for ${carId}: ${result}`);
    return result;
  };

  // Add a car to favorites
  const addToFavorites = async (carId) => {
    // Normalize to number for sample data
    let idToStore = carId;
    if (typeof carId === 'string' && /^\d+$/.test(carId)) {
      idToStore = parseInt(carId, 10);
    }
    
    console.log(`Adding to favorites: ID ${idToStore} (${typeof idToStore})`);
    
    // Check if already in favorites
    if (isFavorite(idToStore)) {
      console.log("Already in favorites, skipping");
      return { success: true };
    }
    
    // Update local state immediately with the new favorite
    const newFavorites = [...favorites, idToStore];
    console.log("Setting favorites to:", newFavorites);
    setFavorites(newFavorites);
    
    // Save to storage
    saveLocalFavorites(newFavorites);
    saveSessionFavorites(newFavorites);
    
    // If not authenticated or backend unavailable, just use local storage
    if (!isAuthenticated || !backendAvailable) {
      setUsingLocalStorage(true);
      console.log("Using local storage for favorites");
      return { success: true };
    }

    // For MongoDB, convert the ID to a compatible format
    try {
      setIsLoading(true);
      setError(null);
      
      const mongoCompatibleId = ensureMongoId(idToStore);
      console.log("Using MongoDB-compatible ID:", mongoCompatibleId);
      
      try {
        const response = await apiService.user.addToFavorites(mongoCompatibleId);
        
        if (response.status === 'success') {
          // Reload favorites from API but don't wait
          loadFavorites().catch(console.error);
          return { success: true };
        } else {
          console.warn("API responded with an error:", response.message);
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
    // Normalize to number for sample data
    let idToRemove = carId;
    if (typeof carId === 'string' && /^\d+$/.test(carId)) {
      idToRemove = parseInt(carId, 10);
    }
    
    console.log(`Removing from favorites: ID ${idToRemove} (${typeof idToRemove})`);
    
    // Make sure it's actually in favorites
    if (!isFavorite(idToRemove)) {
      console.log("Not in favorites, nothing to remove");
      return { success: true };
    }
    
    // Update local state immediately by filtering out the removed favorite
    const newFavorites = favorites.filter(fav => {
      if (typeof fav === 'object') {
        const favId = fav.id || fav._id;
        return favId !== idToRemove && String(favId) !== String(idToRemove);
      } else if (typeof fav === 'number' && typeof idToRemove === 'number') {
        return fav !== idToRemove;
      } else {
        return String(fav) !== String(idToRemove);
      }
    });
    
    console.log("Setting favorites to:", newFavorites);
    setFavorites(newFavorites);
    
    // Save to storage
    saveLocalFavorites(newFavorites);
    saveSessionFavorites(newFavorites);
    
    // If not authenticated or backend unavailable, just use local storage
    if (!isAuthenticated || !backendAvailable) {
      setUsingLocalStorage(true);
      console.log("Using local storage for favorites");
      return { success: true };
    }

    // For MongoDB, convert the ID to a compatible format
    try {
      setIsLoading(true);
      setError(null);
      
      const mongoCompatibleId = ensureMongoId(idToRemove);
      console.log("Using MongoDB-compatible ID:", mongoCompatibleId);
      
      try {
        const response = await apiService.user.removeFromFavorites(mongoCompatibleId);
        
        if (response.status === 'success') {
          // Reload favorites from API but don't wait
          loadFavorites().catch(console.error);
          return { success: true };
        } else {
          console.warn("API responded with an error:", response.message);
          throw new Error(response.message || 'Failed to remove from favorites');
        }
      } catch (apiError) {
        console.error('API Error removing from favorites:', apiError);
        // Already saved to local storage above
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
    // Normalize to number for sample data
    let idToToggle = carId;
    if (typeof carId === 'string' && /^\d+$/.test(carId)) {
      idToToggle = parseInt(carId, 10);
    }
    
    console.log(`Toggling favorite: ID ${idToToggle} (${typeof idToToggle})`);
    
    // Check current favorite status
    const isCurrentlyFavorite = isFavorite(idToToggle);
    console.log(`Is currently favorite? ${isCurrentlyFavorite}`);
    
    // Toggle based on current state
    if (isCurrentlyFavorite) {
      return await removeFromFavorites(idToToggle);
    } else {
      return await addToFavorites(idToToggle);
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
 
 