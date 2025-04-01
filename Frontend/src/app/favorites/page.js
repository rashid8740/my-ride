"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { useFavorites } from "@/utils/FavoritesContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { X, Car, Heart, AlertCircle } from "lucide-react";

export default function FavoritesPage() {
  const { isAuthenticated, user } = useAuth();
  const { favorites, isLoading, error, removeFromFavorites } = useFavorites();
  const [removingId, setRemovingId] = useState(null);

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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle size={48} className="mx-auto mb-4 text-orange-500" />
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please log in to view your favorites</p>
          <Link
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-md inline-block"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600 mb-8">
            Manage your collection of favorite vehicles
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your favorites...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
                <div>
                  <h3 className="font-medium text-red-800">
                    Error Loading Favorites
                  </h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-gray-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Favorites Yet
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                You haven't added any vehicles to your favorites list. Browse our
                inventory and add some favorites.
              </p>
              <Link
                href="/inventory"
                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                <Car size={18} className="mr-2" />
                Browse Inventory
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((car) => (
                <div
                  key={car._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Car Image */}
                  <Link href={`/cars/${car._id}`}>
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={car.images[0]?.url || "/images/car-placeholder.jpg"}
                        alt={car.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      {car.status === "Sold" && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-medium">
                          SOLD
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Car Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/cars/${car._id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-500 transition-colors">
                            {car.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">{car.year} • {car.mileage.toLocaleString()} mi</p>
                      </div>
                      <button
                        onClick={() => handleRemove(car._id)}
                        disabled={removingId === car._id}
                        className={`text-gray-400 hover:text-red-500 transition-colors focus:outline-none ${
                          removingId === car._id ? "opacity-50 cursor-wait" : ""
                        }`}
                        aria-label="Remove from favorites"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="mt-2 mb-3">
                      <span className="text-xl font-bold text-orange-500">
                        ${car.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                      <div className="flex items-center">
                        <span className="mr-1">• </span>
                        {car.transmission}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">• </span>
                        {car.fuel}
                      </div>
                    </div>

                    <Link
                      href={`/cars/${car._id}`}
                      className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-md transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
} 
 
 