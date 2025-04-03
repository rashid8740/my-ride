// src/components/cars/CarListingSection.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, Heart, Award, Gauge, Fuel, Settings, ChevronRight, MapPin, Tag, Check } from "lucide-react";
import { cars as sampleCars } from "@/app/inventory/data";
import { useAuth } from "@/utils/AuthContext";
import { useFavorites } from "@/utils/FavoritesContext";
import { toast } from "react-hot-toast";

// Body Type Tab Component - exact match to the reference
function BodyTypeTab({ type, isActive, onClick }) {
  return (
    <button
      className={`py-3 px-5 font-medium text-sm transition-colors relative ${
        isActive
          ? "text-black border-b-2 border-orange-500 font-semibold"
          : "text-gray-600 hover:text-gray-800"
      }`}
      onClick={onClick}
    >
      {type}
    </button>
  );
}

// Car Card Component - identical to inventory page
function CarCard({ car }) {
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please log in to add favorites");
      return;
    }
    
    try {
      setIsTogglingFavorite(true);
      const result = await toggleFavorite(car.id || car._id);
      
      if (result.success) {
        if (isFavorite(car.id || car._id)) {
          toast.success("Removed from favorites");
        } else {
          toast.success("Added to favorites");
        }
      } else {
        toast.error(result.message || "Failed to update favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Something went wrong");
    } finally {
      setIsTogglingFavorite(false);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Car Image with Badges */}
      <div className="relative h-48 sm:h-52 bg-gray-100 overflow-hidden">
        <img
          src={car.image || "/images/car-placeholder.jpg"}
          alt={car.title || `${car.year} ${car.make} ${car.model}`}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
        />

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
            <span>{car.photoCount || 0}</span>
          </div>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            isFavorite(car.id || car._id)
              ? "bg-orange-500 text-white"
              : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white"
          } shadow-md ${isTogglingFavorite ? "opacity-70" : ""}`}
          disabled={isTogglingFavorite}
          aria-label={isFavorite(car.id || car._id) ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} fill={isFavorite(car.id || car._id) ? "currentColor" : "none"} />
        </button>

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
            ${typeof car.price === 'number' 
              ? car.price.toLocaleString() 
              : car.price}
          </div>
          
          {car.msrp && car.msrp > car.price && (
            <div className="text-xs text-gray-500 line-through">
              MSRP: ${car.msrp.toLocaleString()}
            </div>
          )}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Gauge className="h-4 w-4 text-gray-400" />
            <span className="truncate">
              {car.mileage || 'N/A'}
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
            <span className="truncate">
              {car.category || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* View Car Button */}
      <div className="border-t border-gray-100 p-4">
        <Link
          href={`/cars/${car.id}`}
          className="w-full flex items-center justify-center py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-medium rounded-lg transition-colors"
        >
          View Details
          <ChevronRight size={16} className="ml-1 mt-0.5" />
        </Link>
      </div>
    </div>
  );
}

export default function CarListingSection({ id }) {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured cars
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Get only featured cars
      const featured = sampleCars.filter(car => car.featured);
      setFeaturedCars(featured);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <section id={id} className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-gray-200 h-8 w-48 animate-pulse rounded"></div>
            <div className="bg-gray-200 h-6 w-24 animate-pulse rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-[200px] bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 flex justify-center">
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Vehicles</h2>
          <Link href="/inventory" className="text-orange-500 hover:text-orange-600 font-medium flex items-center">
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map(car => (
            <CarCard key={car.id} car={{...car, featured: true}} />
          ))}
        </div>

        {/* View All Vehicles Button */}
        <div className="text-center mt-10">
          <Link
            href="/inventory"
            className="inline-block px-6 py-3 rounded-full border-2 border-orange-500 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition-colors"
          >
            View All Vehicles
          </Link>
        </div>
      </div>
    </section>
  );
}
