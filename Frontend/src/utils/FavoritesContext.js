"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from './api';

// Create the favorites context
const FavoritesContext = createContext();

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

  // Load user favorites when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      // Clear favorites when not authenticated
      setFavorites([]);
    }
  }, [isAuthenticated, user]);

  // Load user's favorites from the API
  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.user.getFavorites();
      if (response.data) {
        setFavorites(response.data);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Failed to load favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a car is in favorites
  const isFavorite = (carId) => {
    return favorites.some(fav => fav._id === carId || fav.id === carId);
  };

  // Add a car to favorites
  const addToFavorites = async (carId) => {
    if (!isAuthenticated) {
      setError('Please log in to add favorites');
      return { success: false, message: 'Please log in to add favorites' };
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.user.addToFavorites(carId);
      
      if (response.status === 'success') {
        // Reload favorites to get updated list
        await loadFavorites();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to add to favorites');
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
    if (!isAuthenticated) {
      setError('Please log in to manage favorites');
      return { success: false, message: 'Please log in to manage favorites' };
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.user.removeFromFavorites(carId);
      
      if (response.status === 'success') {
        // Reload favorites to get updated list
        await loadFavorites();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setError(error.message || 'Failed to remove from favorites');
      return { success: false, message: error.message || 'Failed to remove from favorites' };
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (carId) => {
    if (isFavorite(carId)) {
      return await removeFromFavorites(carId);
    } else {
      return await addToFavorites(carId);
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
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext; 
 
 