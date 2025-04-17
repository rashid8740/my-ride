"use client";
import { Car, X, AlertCircle, RefreshCw, MapPin, Gauge, Fuel, Settings, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

// Helper function to format vehicle IDs for display
const formatVehicleId = (id) => {
  if (!id) return 'Unknown';
  
  // If it's a MongoDB ObjectId (24 hex chars)
  if (typeof id === 'string' && /^[0-9a-f]{24}$/i.test(id)) {
    return `${id.substring(0, 6)}...${id.substring(id.length - 6)}`;
  }
  
  // For other ID formats
  const idStr = String(id);
  if (idStr.length > 12) {
    return `${idStr.substring(0, 6)}...${idStr.substring(idStr.length - 6)}`;
  }
  
  return idStr;
};

export default function PlaceholderCarCard({ car, onRefresh, isRefreshing, onRemove, isRemoving }) {
  // Check if we have a MongoDB ObjectId
  const isMongoId = /^[0-9a-f]{24}$/i.test(car.id || car._id);
  const hasImage = car.image || (car.images && car.images.length > 0 && car.images[0].url);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleRemoveClick = () => {
    if (confirmDelete) {
      onRemove();
    } else {
      setConfirmDelete(true);
    }
  };
  
  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200">
      {/* Image section */}
      <div className="relative h-48 sm:h-52 bg-gray-100 overflow-hidden">
        {hasImage ? (
          <img
            src={car.image || car.images[0].url}
            alt={car.title || "Vehicle"}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-orange-200/50 blur-md"></div>
              <div className="relative bg-orange-100 p-4 rounded-full">
                <Car size={36} className="text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unavailable
          </span>
        </div>

        {/* Year Badge */}
        {car.year && car.year !== 'N/A' && car.year !== 'Unknown' && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
            {car.year}
          </div>
        )}
      </div>

      {/* Car Details */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg">
            {car.title || `${car.year || ''} ${car.make || ''} ${car.model || ''}`.trim()}
          </h3>
          
          {car.location && (
            <div className="flex items-center text-gray-500 text-xs mt-1">
              <MapPin size={12} className="mr-1" />
              {car.location}
            </div>
          )}
        </div>
        
        {/* Unavailable message */}
        <div className="text-sm text-yellow-700 bg-yellow-50 rounded-lg p-3 flex items-start">
          <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <p>This vehicle appears to be unavailable. You can remove it from your favorites.</p>
        </div>

        {/* Price */}
        <div className="text-orange-500 font-bold text-xl">
          {typeof car.price === 'number' 
            ? `KSh ${car.price.toLocaleString()}`
            : (car.price || 'Contact for Price')}
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
              href={`/inventory?category=${encodeURIComponent(car.category || car.bodyType || 'N/A')}`}
              className="truncate hover:text-orange-500 hover:underline"
            >
              {car.category || car.bodyType || 'N/A'}
            </Link>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="border-t border-gray-100 p-4 flex space-x-2">
        <button
          onClick={onRemove}
          disabled={isRemoving}
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors"
          aria-label="Remove from favorites"
        >
          {isRemoving ? (
            <div className="w-4 h-4 border-t-2 border-b-2 border-orange-500 rounded-full animate-spin"></div>
          ) : (
            <X size={16} />
          )}
        </button>
        <Link 
          href="/inventory" 
          className="flex-1 flex items-center justify-center py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-medium rounded-lg transition-colors"
        >
          <Car size={16} className="mr-2" />
          Browse Inventory
        </Link>
      </div>
    </div>
  );
} 