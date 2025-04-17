"use client";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useFavorites } from '@/utils/FavoritesContext';
import { Trash2 } from 'lucide-react';

const ClearFavoritesButton = ({ onCleared, variant = "default" }) => {
  const [isClearing, setIsClearing] = useState(false);
  const { refreshFavorites } = useFavorites();
  
  const handleClearFavorites = async () => {
    if (isClearing) return;
    
    try {
      setIsClearing(true);
      
      // Call our API endpoint to clear local favorites
      const response = await fetch('/api/clear-favorites');
      const data = await response.json();
      
      if (data.success) {
        toast.success('Local favorites cleared successfully');
        // Refresh favorites to update the UI
        await refreshFavorites();
        // Call the onCleared callback if provided
        if (typeof onCleared === 'function') {
          onCleared();
        }
      } else {
        toast.error(data.message || 'Failed to clear favorites');
      }
    } catch (error) {
      console.error('Error clearing favorites:', error);
      toast.error('Something went wrong');
    } finally {
      setIsClearing(false);
    }
  };
  
  // Different button styles based on variant
  if (variant === "icon") {
    return (
      <button
        onClick={handleClearFavorites}
        disabled={isClearing}
        className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 focus:outline-none disabled:opacity-50 transition-all"
        aria-label="Clear local favorites"
      >
        <Trash2 size={20} className={isClearing ? 'animate-pulse' : ''} />
      </button>
    );
  }
  
  return (
    <button
      onClick={handleClearFavorites}
      disabled={isClearing}
      className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
        isClearing ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
      }`}
    >
      {isClearing ? 'Clearing...' : 'Clear Local Favorites'}
    </button>
  );
};

export default ClearFavoritesButton; 