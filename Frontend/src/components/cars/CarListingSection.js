// src/components/cars/CarListingSection.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera } from "lucide-react";
import apiService from "@/utils/api";

// Body Type Tab Component
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

// Car Card Component
function CarCard({ car }) {
  // Handle missing image by providing a default
  const mainImage = car.images && car.images.length > 0
    ? car.images.find(img => img.isMain)?.url || car.images[0].url
    : "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Car Image with Badges */}
      <div className="relative h-[150px] xs:h-[160px] sm:h-[180px] bg-gray-100 overflow-hidden">
        <img
          src={mainImage.startsWith('http') ? mainImage : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${mainImage}`}
          alt={car.title}
          className="w-full h-full object-cover"
        />

        {/* Top badges in a row */}
        <div className="absolute top-2 xs:top-3 left-0 right-0 flex justify-between px-2 xs:px-3">
          {/* Featured Badge */}
          {car.isFeatured && (
            <div className="bg-orange-500 text-white text-[10px] xs:text-xs font-medium px-2 xs:px-3 py-0.5 xs:py-1 rounded-full">
              Featured
            </div>
          )}

          {/* Photo Count Badge */}
          <div className="flex items-center gap-1 bg-black/60 text-white text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
            <Camera size={10} className="xs:hidden" />
            <Camera size={14} className="hidden xs:block" />
            <span>{car.images?.length || 0}</span>
          </div>
        </div>

        {/* Year Badge */}
        <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-[10px] xs:text-xs font-medium px-2 xs:px-4 py-1 rounded-tl-lg">
          {car.year}
        </div>
      </div>

      {/* Car Details */}
      <div className="p-3 xs:p-4 space-y-2 xs:space-y-3">
        {/* Category */}
        <div className="text-orange-500 text-xs xs:text-sm font-medium">
          {car.category}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm xs:text-base sm:text-lg min-h-[2.5em] line-clamp-2">
          {car.title}
        </h3>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs xs:text-sm text-gray-500">
          {/* Mileage */}
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
              <path d="M12 12l3 2" />
            </svg>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {typeof car.mileage === 'number' ? `${car.mileage.toLocaleString()} kms` : car.mileage}
            </span>
          </div>

          {/* Fuel */}
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15" />
              <path d="M14 15h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-1" />
            </svg>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {car.fuel}
            </span>
          </div>

          {/* Transmission */}
          <div className="flex items-center gap-1 col-span-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M14.5 9l-5 5" />
            </svg>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {car.transmission}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-orange-500 font-bold text-base xs:text-lg sm:text-xl">
          ${typeof car.price === 'number' ? car.price.toLocaleString() : car.price}
        </div>
      </div>

      {/* View Car Button */}
      <div className="px-3 xs:px-4 py-2 xs:py-3 border-t border-gray-100 flex justify-center">
        <Link
          href={`/cars/${car._id}`}
          className="text-xs xs:text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 px-3 xs:px-5 py-1.5 xs:py-2 rounded-full transition-colors"
        >
          View car
        </Link>
      </div>
    </div>
  );
}

export default function CarListingSection({ id }) {
  const [activeTab, setActiveTab] = useState("All");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Body type tabs
  const bodyTypes = ["All", "SUV", "Hatchback", "Sedan", "MUV", "Luxury"];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use featured cars API for the home page, or filtered cars for other pages
        const query = activeTab !== "All" ? { category: activeTab } : {};
        
        // On home page, get featured cars
        let response;
        if (id === "featured-cars") {
          response = await apiService.cars.getFeatured(6);
        } else {
          response = await apiService.cars.getAll({ 
            ...query,
            limit: 6,
            page: 1
          });
        }
        
        setCars(response.data || []);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars. Please try again later.');
        
        // Use fallback data for development
        if (process.env.NODE_ENV === 'development') {
          setCars([
            {
              _id: 1,
              title: "2017 BMW X1 xDrive 20d xline",
              category: "Sedan",
              year: "2024",
              price: "73,000",
              mileage: "72,491 kms",
              fuel: "Diesel",
              transmission: "Automatic",
              images: [{ url: "https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?q=80&w=800&auto=format&fit=crop" }],
              isFeatured: true
            },
            // More fallback cars...
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, [activeTab, id]);

  // Filter handling
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section id={id} className="py-14 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Cars
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our selection of premium vehicles - from elegant sedans to
            powerful SUVs, we have the perfect car waiting for you
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex min-w-max justify-center">
            {bodyTypes.map((type) => (
              <BodyTypeTab
                key={type}
                type={type}
                isActive={activeTab === type}
                onClick={() => handleTabClick(type)}
              />
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => handleTabClick(activeTab)} 
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Car Listings Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-10">
              <Link
                href="/inventory"
                className="inline-block px-6 py-3 rounded-full border-2 border-orange-500 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition-colors"
              >
                View All Vehicles
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
