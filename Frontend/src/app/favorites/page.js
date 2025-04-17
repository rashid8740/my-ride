"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/utils/AuthContext";
import { useFavorites } from "@/utils/FavoritesContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClearFavoritesButton from "@/components/shared/ClearFavoritesButton";
import { X, Car, Heart, AlertCircle, MapPin, Tag, Gauge, Fuel, Settings, ChevronRight, RefreshCw, Loader2, AlertTriangle, Clock } from "lucide-react";
import { cars as sampleCars } from '@/app/inventory/data';
import CarCard from "@/components/inventory/CarCard";
import PlaceholderCarCard from "@/components/shared/PlaceholderCarCard";
import { toast } from "react-hot-toast";

// Add a helper function to format vehicle IDs for better display
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

// Update the createPlaceholder function to make it compatible with CarCard
const createPlaceholder = (id) => {
  // Extract any possible information from the ID
  let extractedMake = "";
  let extractedModel = "";
  let extractedYear = null;
  
  // Check if it's a MongoDB ObjectId
  const isObjectId = typeof id === 'string' && /^[0-9a-f]{24}$/i.test(id);
  
  // Try to extract information from ID if it's a string with potential info
  if (typeof id === 'string') {
    if (id.includes('-')) {
      // Try to extract structured data from hyphenated IDs like "toyota-camry-2020-123"
      const parts = id.split('-');
      if (parts.length > 1 && parts[0].length > 1) {
        extractedMake = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
      }
      
      if (parts.length > 2 && parts[1].length > 1) {
        extractedModel = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
      }
      
      // Look for a year (4 digit number)
      for (const part of parts) {
        const yearMatch = part.match(/^(19|20)\d{2}$/);
        if (yearMatch) {
          extractedYear = yearMatch[0];
          break;
        }
      }
    }
  }
  
  console.log(`Creating placeholder for ID: ${id}`);
  
  // For MongoDB IDs, generate a random realistic price
  const randomPrice = isObjectId ? Math.floor(Math.random() * 3000000) + 1000000 : null;
  
  // Create a placeholder that's compatible with the CarCard component
  return {
    _id: id,
    id: id,
    title: isObjectId 
      ? `${['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Nissan'][Math.floor(Math.random() * 7)]} ${['Sedan', 'SUV', 'Crossover', 'Hatchback', 'Coupe'][Math.floor(Math.random() * 5)]}`
      : (extractedYear 
          ? `${extractedYear} ${extractedMake} ${extractedModel}` 
          : `${extractedMake} ${extractedModel}`.trim() || `Vehicle ${formatVehicleId(id)}`),
    price: id.includes('-') 
      ? Math.floor(Math.random() * 1000000) + 500000 
      : (isObjectId ? randomPrice : 'Contact for Price'),
    image: isObjectId 
      ? `https://source.unsplash.com/random/800x600/?car,${Math.floor(Math.random() * 100)}`
      : null,
    images: isObjectId ? [{url: `https://source.unsplash.com/random/800x600/?car,${Math.floor(Math.random() * 100)}`}] : [],
    isPlaceholder: true,
    year: isObjectId ? (2015 + Math.floor(Math.random() * 8)) : (extractedYear || 'Unknown'),
    make: isObjectId ? ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Nissan'][Math.floor(Math.random() * 7)] : (extractedMake || ""),
    model: isObjectId ? ['Camry', 'Civic', 'Explorer', '3 Series', 'C-Class', 'A4', 'Altima'][Math.floor(Math.random() * 7)] : (extractedModel || ""),
    mileage: isObjectId ? Math.floor(Math.random() * 100000) + 5000 : 'N/A',
    fuel: isObjectId ? ['Petrol', 'Diesel', 'Hybrid', 'Electric'][Math.floor(Math.random() * 4)] : 'N/A',
    transmission: isObjectId ? ['Automatic', 'Manual', 'CVT'][Math.floor(Math.random() * 3)] : 'N/A',
    category: isObjectId ? ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Truck'][Math.floor(Math.random() * 5)] : 'N/A',
    status: 'unavailable',
    photoCount: isObjectId ? Math.floor(Math.random() * 10) + 1 : 0,
    lastUpdated: new Date().toISOString(),
    placeholderReason: isObjectId 
      ? 'This vehicle may have been removed from the database.'
      : 'This vehicle could not be found in our database.',
    location: isObjectId ? ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'][Math.floor(Math.random() * 4)] : 'Unknown location',
    source: 'placeholder'
  };
};

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { 
    favorites, 
    isLoading, 
    error: favoritesError, 
    removeFromFavorites, 
    usingLocalStorage, 
    backendAvailable,
    refreshFavorites 
  } = useFavorites();
  const [removingId, setRemovingId] = useState(null);
  const [localCarData, setLocalCarData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  // Handle removing a car from favorites
  const handleRemove = async (carId) => {
    try {
      setRemovingId(carId);
      const result = await removeFromFavorites(carId);
      
      if (result.success) {
        // Update UI by removing the car
        setLocalCarData(prevCars => prevCars.filter(car => 
          String(car._id || car.id) !== String(carId)
        ));
        // Toast notification now handled by FavoritesContext
      } else {
        console.error(`Failed to remove car: ${result.message}`);
        setError(`Failed to remove from favorites: ${result.message}`);
      }
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Error removing from favorites. Please try again.');
    } finally {
      setRemovingId(null);
      setConfirmRemove(null);
    }
  };

  // Start the remove confirmation process
  const confirmRemoveAction = (carId) => {
    setConfirmRemove(carId);
  };

  // Cancel the remove action
  const cancelRemove = () => {
    setConfirmRemove(null);
  };

  // Handle manual refresh of favorites
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null); // Clear any previous errors
    
    try {
      // First refresh the favorites list in context
      const refreshResult = await refreshFavorites();
      
      if (!refreshResult?.success) {
        console.warn("Refresh context warning:", refreshResult?.message || "Unknown issue");
      }
      
      // Short delay to ensure context is updated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Force refresh the local car data with retries
      let retryCount = 0;
      let success = false;
      
      while (!success && retryCount < 2) {
        try {
          await refreshFavoritesList();
          success = true;
        } catch (retryErr) {
          console.error(`Refresh attempt ${retryCount + 1} failed:`, retryErr);
          retryCount++;
          // Wait a bit longer between retries
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      if (!success) {
        throw new Error("Failed to refresh after multiple attempts");
      }
      
      // Show success message for development
      if (process.env.NODE_ENV === 'development') {
        console.log('Favorites refreshed successfully');
      }
    } catch (err) {
      console.error('Error refreshing favorites:', err);
      setError('Unable to refresh favorites. Please try again later.');
    } finally {
      // Add minimum delay for better UX
      setTimeout(() => setIsRefreshing(false), 800);
    }
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

  // Function to refresh car list based on current favorites
  const refreshFavoritesList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Current favorites:', favorites);
      
      if (!favorites || favorites.length === 0) {
        console.log('No favorites found, showing empty state');
        setLocalCarData([]);
        return;
      }
      
      // Convert all favorites IDs to strings for consistent comparison
      const favoriteIds = favorites.map(fav => {
        // If the favorite already contains car data, we can use it directly
        if (typeof fav === 'object' && fav !== null) {
          // Check if this favorite object actually contains car data (not just an ID)
          if (fav.make || fav.model || fav.title || fav.price) {
            // We have car data stored in favorites! Use it directly
            console.log('Using stored car data for:', fav._id || fav.id);
            return { 
              id: String(fav._id || fav.id), 
              carData: fav 
            };
          }
          return { 
            id: String(fav._id || fav.id || fav), 
            carData: null 
          };
        }
        return { 
          id: String(fav), 
          carData: null 
        };
      });
      
      console.log('Normalized favorite IDs:', favoriteIds.map(f => f.id));
      
      let resolvedCars = [];

      // First, add any cars that already have data in the favorites
      const carsWithData = favoriteIds.filter(fav => fav.carData);
      if (carsWithData.length > 0) {
        console.log(`Using ${carsWithData.length} cars with embedded data`);
        resolvedCars = carsWithData.map(fav => ({
          ...fav.carData,
          source: 'stored',
          _id: fav.id, // Ensure consistent ID
          id: fav.id
        }));
      }
      
      // Get IDs of cars we still need to fetch
      const idsToFetch = favoriteIds
        .filter(fav => !fav.carData)
        .map(fav => fav.id);
      
      // Try to fetch the most up-to-date data from API first when online
      if (idsToFetch.length > 0 && backendAvailable && !usingLocalStorage) {
        try {
          console.log('Fetching vehicle data from API for IDs:', idsToFetch);
          // Fetch each vehicle individually (in parallel) to avoid missing any
          const fetchPromises = idsToFetch.map(async (id) => {
            try {
              // First try the primary endpoint
              const response = await fetch(`/api/cars/${id}`);
              if (response.ok) {
                const data = await response.json();
                if (data && data.success && data.car) {
                  console.log(`Successfully loaded car ID: ${id} from API`);
                  return { ...data.car, source: 'api' };
                }
              }
              
              // If first endpoint fails, try alternate endpoint
              try {
                const altResponse = await fetch(`/api/vehicles/${id}`);
                if (altResponse.ok) {
                  const altData = await altResponse.json();
                  if (altData && (altData.vehicle || altData.car)) {
                    const vehicle = altData.vehicle || altData.car;
                    console.log(`Successfully loaded vehicle ID: ${id} from alternate API`);
                    return { ...vehicle, source: 'api-alt' };
                  }
                }
              } catch (altErr) {
                console.log(`Alternate API call failed for ID: ${id}`);
              }
              
              // Both API calls failed for this ID
              return null;
            } catch (err) {
              console.error(`Error fetching car ID: ${id}`, err);
              return null;
            }
          });
          
          const results = await Promise.all(fetchPromises);
          // Filter out nulls (failed fetches)
          const apiCars = results.filter(car => car !== null);
          console.log(`API: Successfully loaded ${apiCars.length} of ${idsToFetch.length} cars`);
          
          // Add API cars to resolved cars
          resolvedCars = [...resolvedCars, ...apiCars];
        } catch (err) {
          console.error('Error fetching from API, falling back to sample data:', err);
          // Continue to fallback approach
        }
      }
      
      // Get remaining IDs that need to be resolved
      const resolvedIds = resolvedCars.map(car => String(car._id || car.id));
      const unresolvedIds = idsToFetch.filter(id => !resolvedIds.includes(id));
      
      // If we couldn't fetch all cars from API, use sample data as fallback
      if (unresolvedIds.length > 0) {
        console.log('Using sample car data for remaining vehicles:', unresolvedIds);
        
        // Try matching remaining cars from sample data
        for (const id of unresolvedIds) {
          let found = false;
          
          // Try to find the car in sample data
          for (const car of sampleCars) {
            // Skip undefined or null sample cars
            if (!car) continue;
            
            const carId = car.id || car._id;
            // Skip sample cars with no ID
            if (!carId) continue;
            
            const carIdStr = String(carId);
            
            // Simple matching strategy
            if (carIdStr === id || 
                (Number(id) === carId && !isNaN(Number(id))) ||
                (car.vin && car.vin === id)) {
              
              // Create a deep copy to avoid mutations
              const carCopy = JSON.parse(JSON.stringify(car));
              resolvedCars.push({
                ...carCopy,
                source: 'sample'
              });
              found = true;
              console.log(`Found car ID: ${id} in sample data`);
            break;
            }
          }
          
          // If not found in any data source, create a placeholder as last resort
          if (!found) {
            console.log(`Creating placeholder for ID: ${id} - no data found anywhere`);
            resolvedCars.push(createPlaceholder(id));
          }
        }
      }
      
      console.log(`Final resolved cars: ${resolvedCars.length}`);
      
      // Sort cars to maintain consistent order
      resolvedCars.sort((a, b) => {
        // Show non-placeholders first
        if (a.isPlaceholder && !b.isPlaceholder) return 1;
        if (!a.isPlaceholder && b.isPlaceholder) return -1;
        return 0;
      });
      
      setLocalCarData(resolvedCars);
      
    } catch (err) {
      console.error('Error loading favorite cars:', err);
      setError('Failed to load favorite cars. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [favorites, isLoading, backendAvailable, usingLocalStorage]);

  // Load cars when favorites change
  useEffect(() => {
    if (!isLoading) {
      refreshFavoritesList();
    }
  }, [favorites, isLoading, refreshFavoritesList]);

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
              {loading ? (
                <span className="flex items-center">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Loading your favorites...
                </span>
              ) : (
                <>
                {displayCars.length} {displayCars.length === 1 ? 'vehicle' : 'vehicles'} saved
                {!backendAvailable && " (Offline Mode)"}
                </>
              )}
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
            <p className="flex items-center font-medium">
              <AlertTriangle size={18} className="mr-2" />
              {error}
            </p>
          </div>
        )}

        {!loading && displayCars.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-xl shadow-sm mx-auto max-w-lg">
            <div className="w-20 h-20 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <Heart size={32} className="text-orange-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Favorites Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our inventory and save your favorite vehicles here for easy comparison.
              {error && <span className="block mt-2 text-red-600 font-medium">{error}</span>}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inventory"
                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-sm"
            >
              Browse Vehicles <ChevronRight size={18} className="ml-1" />
            </Link>
              {error && (
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  {isRefreshing ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-b-2 border-gray-800 rounded-full animate-spin mr-2"></div>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={18} className="mr-2" />
                      Try Again
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && displayCars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCars.map((car) => (
              car.isPlaceholder ? (
                <PlaceholderCarCard
                key={car.id || car._id}
                  car={car}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                  onRemove={() => handleRemove(car.id || car._id)}
                  isRemoving={removingId === (car.id || car._id)}
                        />
                      ) : (
                <div key={car.id || car._id} className="relative">
                  <div className="relative">
                    <CarCard car={car} />
                    <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4 flex items-center space-x-2 z-20 bg-white">
                  <button
                    onClick={() => handleRemove(car.id || car._id)}
                    disabled={removingId === (car.id || car._id)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    {removingId === (car.id || car._id) ? (
                          <div className="w-4 h-4 border-t-2 border-b-2 border-orange-500 rounded-full animate-spin"></div>
                    ) : (
                          <X size={16} />
                    )}
                  </button>
                      <Link
                        href={`/cars/${car._id || car.id}`}
                        className="flex-1 flex items-center justify-center py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-medium rounded-lg transition-colors"
                      >
                        View Details
                        <ChevronRight size={16} className="ml-1 mt-0.5" />
                  </Link>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
} 
 