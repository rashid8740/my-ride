"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from './api';
import { toast } from 'react-hot-toast';

// Create the favorites context with initial values
const FavoritesContext = createContext({
  favorites: [],
  isLoading: false,
  error: null,
  isFavorite: () => Boolean(false),
  addToFavorites: async () => ({ success: false }),
  removeFromFavorites: async () => ({ success: false }),
  toggleFavorite: async () => ({ success: false }),
  syncFavorites: async () => Boolean(false),
  clearLocalFavorites: () => Boolean(false),
  favoritesCount: 0,
  usingLocalStorage: false,
  backendAvailable: false,
  refreshFavorites: async () => [],
  isAuthSynced: false,
  canUseBackend: false,
  isAuthenticated: false
});

// LocalStorage key for favorites
const LOCAL_FAVORITES_KEY = 'my-ride-favorites';
const SESSION_FAVORITES_KEY = 'my-ride-session-favorites';
// Add a key to track notification status
const FAVORITES_NOTIFICATION_SHOWN_KEY = 'my-ride-favorites-notification-shown';

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
  // Add state to track if notification has been shown
  const [notificationShown, setNotificationShown] = useState(false);

  // Check if notification was already shown in this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shown = sessionStorage.getItem(FAVORITES_NOTIFICATION_SHOWN_KEY) === 'true';
      setNotificationShown(shown);
    }
  }, []);
  
  // Mark notification as shown
  const markNotificationShown = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(FAVORITES_NOTIFICATION_SHOWN_KEY, 'true');
      setNotificationShown(true);
    }
  };

  // Clear notification flag for explicit user actions
  const clearNotificationFlag = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(FAVORITES_NOTIFICATION_SHOWN_KEY);
      setNotificationShown(false);
    }
  };

  // Load favorites from storage first, then try API
  useEffect(() => {
    // Function to load favorites based on auth state
    const fetchFavorites = async () => {
      setIsLoading(true);
      
      // Check token directly to avoid issues with auth state sync
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const isLoggedIn = isAuthenticated || !!token;
      
      console.log(`Initial favorites load - Auth state: ${isAuthenticated}, Token: ${token ? 'present' : 'absent'}`);
      
      try {
        if (isLoggedIn) {
          // If logged in, try API first
          try {
            await loadFavorites();
            console.log("Loaded favorites from API");
            setUsingLocalStorage(false);
          } catch (apiError) {
            console.error("Error loading favorites from API, falling back to local:", apiError);
            // Fall back to storage if API fails
            initialLoadFromStorage();
          }
        } else {
          // Not logged in, use local storage
          initialLoadFromStorage();
        }
      } catch (error) {
        console.error("Error in fetchFavorites:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Function to load from local/session storage
    const initialLoadFromStorage = () => {
      // First load from session storage (fastest)
      const sessionFavs = loadSessionFavoritesSync();
      console.log("Initial session favorites:", sessionFavs);
      
      if (sessionFavs && sessionFavs.length > 0) {
        console.log("Using session favorites on initial load");
        setFavorites(sessionFavs);
        setUsingLocalStorage(true);
        return;
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
      } else {
        setFavorites([]);
        setUsingLocalStorage(true);
      }
    };
    
    // Start fetching favorites
    fetchFavorites();
  }, [isAuthenticated]);

  // Check if backend is available periodically
  useEffect(() => {
    const checkBackendAvailability = async () => {
      try {
        // Get the backend URL with proper fallback
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 
                          (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
                           ? 'https://my-ride-hhne.vercel.app' 
                           : 'http://localhost:5000');
        
        console.log("Checking backend availability at:", backendUrl);
        
        // Use a timeout for the request to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          const response = await fetch(`${backendUrl}/api/health`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          setBackendAvailable(response.ok);
          
          console.log("Backend availability check:", response.ok ? "✅ Available" : "❌ Unavailable");
          
          if (response.ok) {
            const data = await response.json();
            console.log("Backend health data:", data);
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.error("Fetch error during health check:", fetchError);
          setBackendAvailable(false);
        }
      } catch (error) {
        console.error('Backend unavailable:', error);
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
      
      // Check if user is authenticated with a token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const shouldUseApi = isAuthenticated || token;
      
      console.log(`Loading favorites - Auth:${isAuthenticated}, Token:${token ? 'present' : 'absent'}`);
      
      if (!shouldUseApi) {
        console.log("Not authenticated, using local favorites");
        const localFavs = loadLocalFavorites();
        return localFavs;
      }
      
      console.log("Loading favorites from API...");
      
      // Use the favorites endpoint
      try {
      const response = await apiService.favorites.getAll();
      console.log("API favorites response:", response);
      
      if (response.data) {
        // Update favorites state
        setFavorites(response.data);
        
        // Check if we should use local storage (indicated by the meta property)
        const useLocalStorage = response.meta?.useLocalStorage || false;
        setUsingLocalStorage(useLocalStorage);
        
        // Also update localStorage and sessionStorage for persistence
        saveLocalFavorites(response.data);
        saveSessionFavorites(response.data);
        
        console.log("Loaded favorites from API:", response.data);
        
        return response.data;
      }
      return [];
      } catch (apiError) {
        // Check if the error is authentication related
        if (apiError.message?.includes('Authentication required') && token) {
          console.log("Token expired or invalid, falling back to local storage");
          toast.error("Your session has expired. Please log in again.");
        }
        throw apiError;
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
    
    // Handle MongoDB ObjectId format better
    const targetId = String(carId).trim();
    
    // Normalize to number if possible
    let numericId = null;
    if (typeof carId === 'number') {
      numericId = carId; 
    } else if (typeof carId === 'string' && /^\d+$/.test(carId)) {
      numericId = parseInt(carId, 10);
    }
    
    console.log(`Checking if ${targetId} (${typeof carId}) is favorite, numeric: ${numericId}`);
    
    // Make a single pass through favorites array for efficiency
    for (const fav of favorites) {
      // Case 1: Object type favorite (from API)
      if (typeof fav === 'object' && fav !== null) {
        // Try multiple ID fields
        const favId = fav.id || fav._id || fav.carId;
        const favIdStr = String(favId).trim();
        
        // Check all possible matching scenarios
        if (
          favIdStr === targetId ||
          (numericId !== null && (
            favId === numericId || 
            Number(favId) === numericId
          ))
        ) {
          console.log(`Match found: object with ID ${favIdStr}`);
          return true;
        }
      } 
      // Case 2: Number type (from local storage)
      else if (typeof fav === 'number' && numericId !== null) {
        if (fav === numericId) {
          console.log(`Match found: number ${fav} === ${numericId}`);
          return true;
        }
      }
      // Case 3: String type
      else if (typeof fav === 'string') {
        const favStr = String(fav).trim();
        
        // Numeric comparison if applicable
        if (numericId !== null && /^\d+$/.test(fav)) {
          if (parseInt(fav, 10) === numericId) {
            console.log(`Match found: string "${favStr}" as number === ${numericId}`);
            return true;
          }
        }
        
        // Direct string comparison
        if (favStr === targetId) {
          console.log(`Match found: string "${favStr}" === "${targetId}"`);
          return true;
        }
      }
    }
    
    // If we get here, no match was found
    console.log(`No match found for ${targetId} in favorites`);
    return false;
  };

  // Add a car to favorites
  const addToFavorites = async (carId, carData = null) => {
    // Normalize to number for sample data
    let idToStore = carId;
    if (typeof carId === 'string' && /^\d+$/.test(carId)) {
      idToStore = parseInt(carId, 10);
    }
    
    console.log(`Adding to favorites: ID ${idToStore} (${typeof idToStore})`, carData ? 'with car data' : 'without car data');
    
    // Check if already in favorites
    if (isFavorite(idToStore)) {
      console.log("Already in favorites, skipping");
      return { success: true };
    }
    
    // If authenticated and backend is available, try to add to backend first
    if (isAuthenticated && backendAvailable) {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Adding to backend favorites: ${idToStore}`);
        
        // Use the favorites endpoint
        const response = await apiService.favorites.add(idToStore);
        
        console.log("Add to favorites response:", response);
        
        if (response.status === 'success') {
          // If we have car data, we should store it
          if (carData) {
            // Update the favorites list with the full car data
            const newFavorites = [...favorites, {
              ...carData,
              _id: idToStore,
              id: idToStore
            }];
            setFavorites(newFavorites);
            saveLocalFavorites(newFavorites);
            saveSessionFavorites(newFavorites);
          } else {
            // No car data, just update from server
            await loadFavorites(); // Refresh the favorites from server
          }
          setUsingLocalStorage(false);
          return { success: true };
        } else {
          console.warn("API responded with an error:", response.message);
          throw new Error(response.message || 'Failed to add to favorites');
        }
      } catch (apiError) {
        console.error('API Error adding to favorites:', apiError);
        // Only fall back to local storage if necessary
        if (!isAuthenticated || !backendAvailable) {
          // Temporary fallback to local storage
          addToLocalStorage(idToStore, carData);
        }
        return { success: false, error: apiError.message };
      } finally {
        setIsLoading(false);
      }
    } else {
      // Temporary fallback to local storage
      addToLocalStorage(idToStore, carData);
      return { success: true, localOnly: true };
    }
  };
  
  // Helper to add to local storage (as a temporary fallback)
  const addToLocalStorage = (idToStore, carData = null) => {
    // Store the complete car object if available, otherwise just the ID
    const favoriteToAdd = carData ? {
      ...carData,
      _id: idToStore,
      id: idToStore
    } : idToStore;
    
    // Update local state immediately with the new favorite
    const newFavorites = [...favorites, favoriteToAdd];
    console.log("Setting local favorites to:", newFavorites);
    setFavorites(newFavorites);
    
    // Save to storage
    saveLocalFavorites(newFavorites);
    saveSessionFavorites(newFavorites);
    setUsingLocalStorage(true);
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
    
    // If authenticated and backend is available, try to remove from backend first
    if (isAuthenticated && backendAvailable) {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Removing from backend favorites: ${idToRemove}`);
        
        // Use the favorites endpoint
        const response = await apiService.favorites.remove(idToRemove);
        
        console.log("Remove from favorites response:", response);
        
        if (response.status === 'success') {
          // Update local state with the server response
          await loadFavorites(); // Refresh the favorites from server
          setUsingLocalStorage(false);
          toast.success("Vehicle removed from favorites");
          return { success: true };
        } else {
          console.warn("API responded with an error:", response.message);
          throw new Error(response.message || 'Failed to remove from favorites');
        }
      } catch (apiError) {
        console.error('API Error removing from favorites:', apiError);
        // Only fall back to local storage if necessary
        if (!isAuthenticated || !backendAvailable) {
          // Temporary fallback to local storage
          removeFromLocalStorage(idToRemove);
          toast.success("Vehicle removed from favorites");
        } else {
          toast.error("Failed to remove from favorites. Please try again.");
        }
        return { success: false, error: apiError.message };
      } finally {
        setIsLoading(false);
      }
    } else {
      // Temporary fallback to local storage
      removeFromLocalStorage(idToRemove);
      toast.success("Vehicle removed from favorites");
      return { success: true, localOnly: true };
    }
  };
  
  // Helper to remove from local storage (as a temporary fallback)
  const removeFromLocalStorage = (idToRemove) => {
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
    
    console.log("Setting local favorites to:", newFavorites);
    setFavorites(newFavorites);
    
    // Save to storage
    saveLocalFavorites(newFavorites);
    saveSessionFavorites(newFavorites);
    setUsingLocalStorage(true);
  };

  // Check backend connectivity and sync favorites if reconnected
  useEffect(() => {
    // Check if we've gone from offline to online
    if (backendAvailable && usingLocalStorage && isAuthenticated) {
      console.log('Backend became available - syncing favorites');
      syncFavorites().catch(console.error);
    }
  }, [backendAvailable, usingLocalStorage, isAuthenticated]);

  // Check if user has logged in and has local favorites to sync
  useEffect(() => {
    // If user just logged in and we have local favorites
    if (isAuthenticated && usingLocalStorage && favorites.length > 0) {
      console.log('User authenticated - syncing local favorites');
      syncFavorites().catch(console.error);
    }
  }, [isAuthenticated]);

  // Sync local favorites with backend (when user logs in or backend becomes available)
  const syncFavorites = async () => {
    // Only attempt to sync if authenticated
    if (!hasValidAuth()) {
      console.log('Not authenticated, skipping sync');
      return false;
    }
    
    if (!backendAvailable) {
      console.log('Backend not available, skipping sync');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Starting favorites sync with backend');
      
      // Get the user's current favorites from the server
      const serverResponse = await apiService.favorites.get();
      
      if (!serverResponse || !serverResponse.data) {
        throw new Error('Could not retrieve server favorites');
      }
      
      const serverFavorites = serverResponse.data;
      console.log('Server favorites:', serverFavorites);
      
      // Local favorites that need to be synced up
      const localFavs = loadLocalFavoritesSync();
      console.log('Local favorites:', localFavs);
      
      if (localFavs.length === 0 && serverFavorites.length === 0) {
        console.log('No favorites to sync in either direction');
        setUsingLocalStorage(false);
        setIsLoading(false);
        return true;
      }
      
      // If we have local favorites that aren't on the server, push them
      let syncSuccess = false;
      if (localFavs.length > 0) {
        const localFavsToSync = localFavs.filter(localId => {
          // Normalize IDs for comparison
          const normalizedLocalId = typeof localId === 'string' && /^\d+$/.test(localId) 
            ? parseInt(localId, 10) 
            : localId;
            
          // Check if this local ID already exists on server
          return !serverFavorites.some(serverFav => {
            const serverId = serverFav._id || serverFav.id || serverFav;
            return serverId == normalizedLocalId || String(serverId) === String(normalizedLocalId);
          });
        });
        
        console.log(`Found ${localFavsToSync.length} local favorites to sync to server`);
        
        // If we have local favorites to sync
        if (localFavsToSync.length > 0) {
          // Try to push each local favorite to the server
          for (const localId of localFavsToSync) {
            try {
              console.log(`Syncing local favorite to server: ${localId}`);
              const addResponse = await apiService.favorites.add(localId);
              if (addResponse.status === 'success') {
                console.log(`Successfully added ${localId} to server favorites`);
                syncSuccess = true;
              } else {
                console.warn(`Failed to add ${localId} to server favorites: ${addResponse.message}`);
              }
            } catch (err) {
              console.error(`Error syncing ${localId} to server:`, err);
            }
          }
          
          // Refresh favorites from server
          await loadFavorites();
          setUsingLocalStorage(false);
          return true;
        } else {
          syncSuccess = true;
        }
      }
      
      if (syncSuccess) {
        if (!notificationShown) {
          toast('Favorites synced successfully!', {
            icon: '✅',
            style: {
              borderRadius: '10px',
              background: '#ECFDF5',
              color: '#065F46',
            },
          });
          markNotificationShown();
        }
        
        // Refresh favorites from server
        await loadFavorites();
        setUsingLocalStorage(false);
        return true;
      } else {
        throw new Error('Failed to sync any favorites');
      }
    } catch (error) {
      console.error('Error syncing favorites:', error);
      setError('Failed to sync favorites with server. Please try again later.');
      
      // Keep using local storage
      setUsingLocalStorage(true);
      
      // Only show error notification if not shown before
      if (!notificationShown) {
        toast('Failed to sync favorites with server. Please try again later.', {
          icon: '⚠️',
          style: {
            borderRadius: '10px',
            background: '#FEF3C7',
            color: '#92400E',
          },
        });
        markNotificationShown();
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (carId, carData = null) => {
    // Clear notification flag for explicit user toggling actions
    clearNotificationFlag();
    
    // Check if we have a valid token (the true source of auth)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const isLoggedIn = !!token;
    
    // If token is missing, show login required message
    if (!isLoggedIn) {
      toast.error("Please log in to add favorites");
      return { success: false, message: "Authentication required" };
    }
    
    // Check backend availability
    if (!backendAvailable) {
      toast.error("Cannot update favorites: Server not available");
      return { success: false, message: "Server not available" };
    }
    
    // Normalize to number for sample data
    let idToToggle = carId;
    if (typeof carId === 'string' && /^\d+$/.test(carId)) {
      idToToggle = parseInt(carId, 10);
    }
    
    console.log(`Toggling favorite: ID ${idToToggle} (${typeof idToToggle})`, carData ? 'with car data' : 'without car data');
    
    // Check current favorite status
    const isCurrentlyFavorite = isFavorite(idToToggle);
    console.log(`Is currently favorite? ${isCurrentlyFavorite}`);
    
    try {
      // For authenticated users, directly use the API
      let response;
      
      if (isCurrentlyFavorite) {
        response = await apiService.favorites.remove(idToToggle);
        if (response.status === 'success') {
          toast.success("Removed from favorites");
          // Refresh favorites from server
          await loadFavorites();
          return { success: true, status: 'removed' };
        }
      } else {
        // If we don't have car data and we're adding to favorites, try to fetch it first
        let carObjectToStore = carData;
        
        if (!carObjectToStore) {
          console.log("No car data provided, attempting to fetch car details first");
          try {
            // Try to fetch car details from API
            const carResponse = await fetch(`/api/cars/${idToToggle}`);
            if (carResponse.ok) {
              const data = await carResponse.json();
              if (data && data.success && data.car) {
                console.log("Retrieved car data for storing with favorite:", data.car);
                carObjectToStore = data.car;
              }
            } else {
              // Try alternate endpoint
              const altResponse = await fetch(`/api/vehicles/${idToToggle}`);
              if (altResponse.ok) {
                const altData = await altResponse.json();
                if (altData && (altData.vehicle || altData.car)) {
                  const vehicle = altData.vehicle || altData.car;
                  console.log("Retrieved car data from alternate API:", vehicle);
                  carObjectToStore = vehicle;
                }
              }
            }
          } catch (fetchError) {
            console.warn("Couldn't fetch car data, will add favorite without details:", fetchError);
          }
        }
        
        // Now add to favorites with the car data (if we got it)
        response = await addToFavorites(idToToggle, carObjectToStore);
        if (response.success) {
          toast.success("Added to favorites");
          return { success: true, status: 'added' };
        }
      }
      
      // If we get here, the response was not successful
      console.error("Failed favorite toggle response:", response);
      toast.error(response.message || "Failed to update favorites");
      
      return { 
        success: response.success === true, 
        message: response.message || 'Failed to update favorites'
      };
    } catch (error) {
      console.error("Error in toggleFavorite:", error);
      
      // Check if this is an auth error and show appropriate message
      if (error.message?.includes('Authentication required') || 
          error.message?.includes('Not authorized')) {
        toast.error("Please log in to add favorites");
        return { success: false, message: "Authentication required" };
      }
      
      toast.error(error.message || "Failed to update favorites");
      return {
        success: false,
        message: error.message || 'Failed to toggle favorite status'
      };
    }
  };

  // Get reliable authentication status
  const hasValidAuth = () => {
    // Check for token in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return !!token; // Convert to boolean
  };

  // Clear local favorites (callable by user)
  const clearLocalFavorites = () => {
    if (typeof window !== 'undefined') {
      try {
        console.log('Clearing existing favorites from storage');
        localStorage.removeItem(LOCAL_FAVORITES_KEY);
        sessionStorage.removeItem(SESSION_FAVORITES_KEY);
        setFavorites([]);
        toast.success("Favorites have been cleared");
        return true;
      } catch (error) {
        console.error('Error clearing local favorites:', error);
        return false;
      }
    }
    return false;
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
    syncFavorites,
    clearLocalFavorites,
    favoritesCount: favorites.length,
    usingLocalStorage,
    backendAvailable,
    refreshFavorites: loadFavorites,
    isAuthSynced: isAuthenticated,
    canUseBackend: hasValidAuth() && backendAvailable,
    isAuthenticated: hasValidAuth()
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
 
 