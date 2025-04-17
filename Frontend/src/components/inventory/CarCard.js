// src/components/inventory/CarCard.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Heart, MapPin, ChevronRight, Tag, Award, Clock, Activity, Check, Gauge, Fuel, Settings, X } from "lucide-react";
import { useFavorites } from "@/utils/FavoritesContext";
import { useAuth } from "@/utils/AuthContext";
import { toast } from "react-hot-toast";

export default function CarCard({ car, listView = false }) {
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showFavoriteButton, setShowFavoriteButton] = useState(true);
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Check if we're on the favorites page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShowFavoriteButton(!window.location.pathname.includes('/favorites'));
    }
  }, []);
  
  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to add favorites");
      return;
    }

    try {
      const result = await toggleFavorite(car.id || car._id, car);
      
      if (result && result.status === 'success') {
        // Notification already handled by the FavoritesContext
        return;
      } else if (result && result.status === 'error') {
        toast.error(result.message || "Failed to update favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Something went wrong");
    }
  };

  // Status badge configuration
  const getStatusBadge = () => {
    const statusConfig = {
      'sold': { color: 'bg-gray-100 text-gray-800', text: 'Sold' },
      'available': { color: 'bg-green-100 text-green-800', text: 'Available' },
      'reserved': { color: 'bg-blue-100 text-blue-800', text: 'Reserved' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    };

    const status = car.status?.toLowerCase() || 'available';
    const config = statusConfig[status] || statusConfig['available'];

    return (
      <span className={`${config.color} text-xs font-medium px-2 py-1 rounded-full flex items-center whitespace-nowrap`}>
        <Check className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  // Helper function to safely get an image URL from car data
  const getImageUrl = (car) => {
    // Case 1: Check for images array with objects containing url property
    if (car.images && Array.isArray(car.images) && car.images.length > 0) {
      const firstImage = car.images[0];
      if (typeof firstImage === 'string') {
        return firstImage;
      } else if (firstImage && typeof firstImage === 'object') {
        if (firstImage.url) return firstImage.url;
        if (firstImage.secure_url) return firstImage.secure_url;
      }
    }
    
    // Case 2: Check for single image property
    if (car.image && typeof car.image === 'string') {
      return car.image;
    }
    
    // Case 3: Check for imageUrl property
    if (car.imageUrl && typeof car.imageUrl === 'string') {
      return car.imageUrl;
    }
    
    // Default placeholder
    return "/images/car-placeholder.jpg";
  };

  // Use the helper function for the image
  const carImageUrl = getImageUrl(car);

  // Grid view layout
  if (!listView) {
    return (
      <div 
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Car Image with Badges */}
        <div className="relative h-48 sm:h-52 bg-gray-100 overflow-hidden">
          <img
            src={carImageUrl}
            alt={car.title || `${car.year} ${car.make} ${car.model}`}
            className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
          />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            {getStatusBadge()}
          </div>

          {/* Top badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
            {car.featured && (
              <div className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </div>
            )}

            {/* Photo Count Badge */}
            <div className="flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              <Camera size={12} />
              <span>{car.images?.length || car.photoCount || 0}</span>
            </div>
          </div>

          {/* Favorite button - only show if not on favorites page */}
          {showFavoriteButton && (
            <button
              onClick={handleFavoriteToggle}
              className={`absolute bottom-3 right-3 ${
                isFavorite(car.id || car._id)
                  ? "bg-orange-500 text-white"
                  : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white"
              } w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${isTogglingFavorite ? "opacity-70" : ""}`}
              disabled={isTogglingFavorite}
              aria-label={isFavorite(car.id || car._id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={18} 
                fill={isFavorite(car.id || car._id) ? "currentColor" : "none"} 
              />
            </button>
          )}

          {/* Year Badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
            {car.year}
          </div>
        </div>

        {/* Car Details */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {car.title || `${car.year} ${car.make} ${car.model}`}
            </h3>
            
            {car.location && (
              <div className="flex items-center text-gray-500 text-xs mt-1">
                <MapPin size={12} className="mr-1" />
                {car.location}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex justify-between items-center">
            <div className="text-orange-500 font-bold text-xl">
              KSh {typeof car.price === 'number' 
                ? car.price.toLocaleString() 
                : car.price}
            </div>
            
            {car.msrp && car.msrp > car.price && (
              <div className="text-xs text-gray-500 line-through">
                MSRP: KSh {car.msrp.toLocaleString()}
              </div>
            )}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-gray-400" />
              <span className="truncate">
                {typeof car.mileage === 'number' 
                  ? `${car.mileage.toLocaleString()} mi` 
                  : car.mileage || 'N/A'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Fuel className="h-4 w-4 text-gray-400" />
              <span className="truncate">
                {car.fuel || 'N/A'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-gray-400" />
              <span className="truncate">
                {car.transmission || 'N/A'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-gray-400" />
              <Link 
                href={`/inventory?category=${encodeURIComponent(car.category || 'N/A')}`}
                className="truncate hover:text-orange-500 hover:underline"
              >
                {car.category || 'N/A'}
              </Link>
            </div>
          </div>
        </div>

        {/* View Car Button */}
        <div className="border-t border-gray-100 p-4">
          <Link
            href={`/cars/${car._id || car.id}`}
            className="w-full flex items-center justify-center py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-medium rounded-lg transition-colors"
          >
            View Details
            <ChevronRight size={16} className="ml-1 mt-0.5" />
          </Link>
        </div>
      </div>
    );
  }

  // List view layout
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 flex flex-col md:flex-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Car Image with Badges */}
      <div className="relative h-60 md:w-80 md:h-auto bg-gray-100 overflow-hidden flex-shrink-0">
        <img
          src={carImageUrl}
          alt={car.title || `${car.year} ${car.make} ${car.model}`}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {getStatusBadge()}
        </div>

        {/* Top badges */}
        <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
          {car.featured && (
            <div className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
              <Award className="h-3 w-3 mr-1" />
              Featured
            </div>
          )}

          {/* Photo Count Badge */}
          <div className="flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            <Camera size={12} />
            <span>{car.images?.length || car.photoCount || 0}</span>
          </div>
        </div>

        {/* Favorite button - only show if not on favorites page */}
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteToggle}
            className={`absolute bottom-3 right-3 ${
              isFavorite(car.id || car._id)
                ? "bg-orange-500 text-white"
                : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white"
            } w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${isTogglingFavorite ? "opacity-70" : ""}`}
            disabled={isTogglingFavorite}
            aria-label={isFavorite(car.id || car._id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={18} 
              fill={isFavorite(car.id || car._id) ? "currentColor" : "none"} 
            />
          </button>
        )}

        {/* Year Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
          {car.year}
        </div>
      </div>

      {/* Car Details */}
      <div className="flex-1 p-4 md:p-5 flex flex-col">
        {/* Title */}
        <div className="mb-2">
          <h3 className="font-bold text-gray-900 text-xl">
            {car.title || `${car.year} ${car.make} ${car.model}`}
        </h3>
          
          {car.location && (
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              {car.location}
            </div>
          )}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 my-3 py-3 border-y border-gray-100">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-gray-400" />
            <span>
              {typeof car.mileage === 'number' 
                ? `${car.mileage.toLocaleString()} mi` 
                : car.mileage || 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-gray-400" />
            <span>
              {car.fuel || 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-400" />
            <span>
              {car.transmission || 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <Link 
              href={`/inventory?category=${encodeURIComponent(car.category || 'N/A')}`}
              className="truncate hover:text-orange-500 hover:underline"
            >
              {car.category || 'N/A'}
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
        {/* Price */}
          <div>
            <div className="text-orange-500 font-bold text-2xl">
              KSh {typeof car.price === 'number' 
                ? car.price.toLocaleString() 
                : car.price}
            </div>
            
            {car.msrp && car.msrp > car.price && (
              <div className="text-sm text-gray-500 line-through">
                MSRP: KSh {car.msrp.toLocaleString()}
              </div>
            )}
          </div>

          {/* Button */}
        <Link
            href={`/cars/${car._id || car.id}`}
            className="flex items-center justify-center py-2.5 px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
        >
          View Details
            <ChevronRight size={16} className="ml-1 mt-0.5" />
        </Link>
        </div>
      </div>
    </div>
  );
}
