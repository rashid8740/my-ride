"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/utils/AuthContext";
import { useFavorites } from "@/utils/FavoritesContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { X, Car, Heart, AlertCircle, MapPin, Tag, Gauge, Fuel, Settings, ChevronRight, RefreshCw } from "lucide-react";

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { 
    favorites, 
    isLoading, 
    error, 
    removeFromFavorites, 
    usingLocalStorage, 
    backendAvailable,
    refreshFavorites 
  } = useFavorites();
  const [removingId, setRemovingId] = useState(null);
  const [localCarData, setLocalCarData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Handle removing a car from favorites
  const handleRemove = async (carId) => {
    try {
      setRemovingId(carId);
      await removeFromFavorites(carId);
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setRemovingId(null);
    }
  };

  // Handle manual refresh of favorites
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFavorites();
    setTimeout(() => setIsRefreshing(false), 800); // Add minimum delay for UX
  };

  // Redirect to login if not authenticated - with delay to avoid flash
  useEffect(() => {
    let redirectTimer;

    // Only check auth status once auth loading is complete
    if (!authLoading) {
      if (!isAuthenticated) {
        // Set a short delay to prevent flash of content
        redirectTimer = setTimeout(() => {
          router.push('/login');
        }, 200);
      }
      setAuthChecked(true);
    }

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [isAuthenticated, authLoading, router]);

  // Get local car data based on favorites IDs - FIX CRITICAL MATCHING ISSUE
  useEffect(() => {
    // Log favorites first for debugging
    console.log("=== FAVORITES PAGE DEBUG START ===");
    console.log("Current favorites state:", JSON.stringify(favorites));
    
    // Only proceed if we have favorites
    if (favorites && favorites.length > 0) {
      // Import the sample data
      import("@/app/inventory/data").then((module) => {
        const { cars } = module;
        console.log("Sample car data loaded:", cars.length, "cars available");
        console.log("First few sample car IDs:", cars.slice(0, 3).map(c => ({ id: c.id, title: c.title })));
        
        // FIXED APPROACH: Force car IDs to be numbers and compare directly
        const matchedCars = [];
        
        favorites.forEach(favorite => {
          // Extract the ID and convert to a number if possible
          let favoriteId = favorite;
          
          if (typeof favorite === 'object') {
            favoriteId = favorite.id || favorite._id;
          }
          
          // Always try to convert to a number for matching with sample data
          const numericId = Number(favoriteId);
          
          console.log(`Looking for car with ID "${favoriteId}" (numeric: ${numericId}, type: ${typeof favoriteId})`);
          
          // Find the car with matching ID in sample data
          // Try multiple matching strategies to ensure we find the car
          let matchingCar = null;
          
          // Strategy 1: Direct numeric comparison (most reliable)
          matchingCar = cars.find(car => Number(car.id) === numericId);
          
          // Strategy 2: Direct string comparison
          if (!matchingCar) {
            matchingCar = cars.find(car => String(car.id) === String(favoriteId));
          }
          
          // Strategy 3: Try matching with ObjectId's last part (for MongoDB IDs)
          if (!matchingCar && typeof favoriteId === 'string' && favoriteId.length === 24) {
            // Extract the numeric part from a MongoDB ObjectId
            const lastPart = favoriteId.slice(-6);
            if (/^[0-9a-f]+$/.test(lastPart)) {
              const numFromHex = parseInt(lastPart, 16);
              matchingCar = cars.find(car => Number(car.id) === numFromHex);
              
              if (matchingCar) {
                console.log(`Found car by ObjectId's last part: ${lastPart} -> ${numFromHex}`);
              }
            }
          }
          
          if (matchingCar) {
            console.log(`✅ FOUND car for ID ${favoriteId}:`, matchingCar.title);
            // Ensure we don't add duplicates
            if (!matchedCars.some(c => c.id === matchingCar.id)) {
              matchedCars.push(matchingCar);
            }
          } else {
            console.log(`❌ NO MATCH for ID ${favoriteId}`);
          }
        });
        
        console.log(`Total matches found: ${matchedCars.length} of ${favorites.length} favorites`);
        console.log("Matched cars:", matchedCars.map(c => ({ id: c.id, title: c.title })));
        console.log("=== FAVORITES PAGE DEBUG END ===");
        
        // Update the state with matched cars
        setLocalCarData(matchedCars);
      });
    } else {
      setLocalCarData([]);
      console.log("No favorites to display");
      console.log("=== FAVORITES PAGE DEBUG END ===");
    }
  }, [favorites]);

  // Always use local car data for display since we need the full car objects
  // to show images, details, etc.
  const displayCars = localCarData;

  // Debug the display state
  useEffect(() => {
    console.log("Display cars length:", displayCars.length);
    console.log("Local car data length:", localCarData.length);
    console.log("Using local storage:", usingLocalStorage);
  }, [displayCars.length, localCarData.length, usingLocalStorage]);

  // Show loading state while checking authentication
  if (!authChecked || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth required message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md w-full">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-900">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to view and manage your favorite vehicles</p>
          <Link
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-full inline-block transition-colors shadow-sm"
          >
            Log In to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Header with favorites count and refresh button */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 mb-8 shadow-sm flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-2xl font-bold">Your Favorites</h1>
            <p className="text-orange-50">
              {displayCars.length} {displayCars.length === 1 ? 'vehicle' : 'vehicles'} saved
              {!backendAvailable && " (Offline Mode)"}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 focus:outline-none disabled:opacity-50 transition-all"
            aria-label="Refresh favorites"
          >
            <RefreshCw size={20} className={`${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
            <p className="flex items-center font-medium">
              <AlertCircle size={18} className="mr-2" />
              {error}
            </p>
          </div>
        )}

        {!isLoading && displayCars.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <Heart size={32} className="text-orange-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Favorites Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our inventory and save your favorite vehicles here for easy comparison.
            </p>
            <Link
              href="/inventory"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Browse Vehicles <ChevronRight size={18} className="ml-1" />
            </Link>
          </div>
        )}

        {!isLoading && displayCars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCars.map((car) => (
              <div
                key={car.id || car._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="relative">
                  <Link href={`/cars/${car.id || car._id}`}>
                    <div className="aspect-[16/9] overflow-hidden bg-gray-200">
                      {(car.image || car.images?.[0]?.url) ? (
                        <img
                          src={car.image || car.images?.[0]?.url}
                          alt={car.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Car size={48} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemove(car.id || car._id)}
                    disabled={removingId === (car.id || car._id)}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm text-gray-700 hover:text-red-500 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    {removingId === (car.id || car._id) ? (
                      <div className="w-5 h-5 border-t-2 border-r-2 border-red-500 rounded-full animate-spin"></div>
                    ) : (
                      <X size={18} />
                    )}
                  </button>
                </div>

                <div className="p-5">
                  <Link href={`/cars/${car.id || car._id}`}>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-orange-500 transition-colors line-clamp-2">
                      {car.title}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-orange-500 font-bold text-xl">
                      ${car.price && typeof car.price === 'string' 
                          ? car.price.replace(/,/g, '') 
                          : car.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      {car.year} · {car.mileage}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center text-sm text-gray-700">
                      <Fuel size={16} className="mr-2 text-gray-400" />
                      {car.fuel}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Settings size={16} className="mr-2 text-gray-400" />
                      {car.transmission}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Tag size={16} className="mr-2 text-gray-400" />
                      {car.category}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      {car.location || "On Lot"}
                    </div>
                  </div>

                  <Link
                    href={`/cars/${car.id || car._id}`}
                    className="block w-full py-2.5 text-center bg-gray-100 hover:bg-orange-500 text-gray-800 hover:text-white rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
} 
 
 