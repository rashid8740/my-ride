// src/app/inventory/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Sliders,
  Filter,
  ChevronRight,
  AlertCircle,
  Car,
  SlidersHorizontal
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import CarCard from "@/components/inventory/CarCard";
import SidebarFilters from "@/components/inventory/SidebarFilters";
import MobileFilters from "@/components/inventory/MobileFilters";
import { filterOptions, cars } from "./data";
import apiService from "@/utils/api";

export default function InventoryPage() {
  // State for cars data
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    fuel: "",
    transmission: ""
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sort state
  const [sortBy, setSortBy] = useState("newest");
  
  // Mobile filters visibility state
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);

  // Fetch cars data
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        
        // Build query parameters from filters
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.minYear) params.minYear = filters.minYear;
        if (filters.maxYear) params.maxYear = filters.maxYear;
        if (filters.fuel) params.fuel = filters.fuel;
        if (filters.transmission) params.transmission = filters.transmission;
        if (searchTerm) params.search = searchTerm;
        
        // Add sort parameter
        params.sort = sortBy;
        
        const response = await apiService.cars.getAll(params);
        
        if (response.status === 'success' && response.data) {
          setCars(response.data);
        } else {
          throw new Error(response.message || 'Failed to load inventory');
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError(error.message || 'Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, [filters, searchTerm, sortBy]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle search input
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search.value;
    setSearchTerm(searchInput);
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Handle filter reset
  const handleResetFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      fuel: "",
      transmission: ""
    });
    setSearchTerm("");
  };
  
  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setMobileFiltersVisible(!mobileFiltersVisible);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header - Proper spacing to clear navbar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-34 md:pt-40 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our Inventory
            </h1>
            <p className="text-gray-300 max-w-2xl text-sm md:text-base mb-8">
              Browse our extensive collection of premium vehicles. Use the
              filters to find your perfect match or search for specific makes
              and models.
            </p>

            {/* Search Bar */}
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Search by make, model, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-4 pr-12 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500">
              Home
            </Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">Inventory</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <SidebarFilters
              filterOptions={filterOptions}
              filters={filters}
              updateFilter={handleFilterChange}
              priceRange={[filters.minPrice, filters.maxPrice]}
              setPriceRange={(range) => setFilters({ ...filters, minPrice: range[0], maxPrice: range[1] })}
              resetFilters={handleResetFilters}
              activeFilterCount={Object.values(filters).flat().length}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={toggleMobileFilters}
                className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 text-gray-700"
              >
                <Filter size={18} />
                <span className="font-medium">Filters</span>
              </button>
            </div>

            {/* Sorting & View Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-5 flex flex-wrap justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{cars.length}</span>{" "}
                vehicles found
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Sort Options */}
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-2 pl-3 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="mileage-asc">Mileage: Low to High</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Car Grid */}
            <div
              className={`grid ${
                mobileFiltersVisible ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
              } gap-3 sm:gap-5`}
            >
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading inventory...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
                  <div className="flex items-start">
                    <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
                    <div>
                      <h3 className="font-medium text-red-800">Error Loading Inventory</h3>
                      <p className="text-red-700 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              ) : cars.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="text-gray-400" size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">No Vehicles Found</h2>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    We couldn't find any vehicles matching your criteria. Try adjusting your filters
                    or search term.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-md transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                cars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-1">
                <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-2 border rounded-md ${
                      page === 1
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersVisible && (
        <MobileFilters
          mobileFiltersOpen={mobileFiltersVisible}
          setMobileFiltersOpen={toggleMobileFilters}
          filterOptions={filterOptions}
          filters={filters}
          updateFilter={handleFilterChange}
          priceRange={[filters.minPrice, filters.maxPrice]}
          setPriceRange={(range) => setFilters({ ...filters, minPrice: range[0], maxPrice: range[1] })}
          resetFilters={handleResetFilters}
          activeFilterCount={Object.values(filters).flat().length}
          carsLength={cars.length}
        />
      )}

      <Footer />
    </div>
  );
}
