// src/app/inventory/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  Filter,
  ChevronRight,
  AlertCircle,
  Car,
  Sliders,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  Clock,
  ArrowUpDown,
  ChevronUp,
  MapPin,
  Check,
  Tag,
  DollarSign,
  Calendar,
  Fuel,
  Settings,
  Gauge,
  Heart,
  ArrowRight,
  Loader2
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CarCard from "@/components/inventory/CarCard";
import SidebarFilters from "@/components/inventory/SidebarFilters";
import MobileFilters from "@/components/inventory/MobileFilters";
import { filterOptions } from "./data";

// Sample cars data for development - replace with API call in production
const sampleCars = [
  {
    id: 1,
    title: "2021 BMW X1 xDrive 20d xline",
    category: "SUV",
    year: "2021",
    price: "45,900",
    mileage: "32,491 km",
    fuel: "Diesel",
    transmission: "Automatic",
    photoCount: "8",
    featured: true,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "2022 Audi Q5 Sportback",
    category: "SUV",
    year: "2022",
    price: "59,800",
    mileage: "12,345 km",
    fuel: "Hybrid",
    transmission: "Automatic",
    photoCount: "12",
    featured: false,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "2020 Mercedes-Benz C300 4MATIC",
    category: "Sedan",
    year: "2020",
    price: "42,500",
    mileage: "28,650 km",
    fuel: "Petrol",
    transmission: "Automatic",
    photoCount: "10",
    featured: true,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "2023 Tesla Model Y Long Range",
    category: "SUV",
    year: "2023",
    price: "62,990",
    mileage: "8,210 km",
    fuel: "Electric",
    transmission: "Automatic",
    photoCount: "14",
    featured: true,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "2021 Porsche 911 Carrera S",
    category: "Coupe",
    year: "2021",
    price: "129,900",
    mileage: "15,320 km",
    fuel: "Petrol",
    transmission: "Semi-Automatic",
    photoCount: "18",
    featured: false,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "2022 Land Rover Range Rover Sport",
    category: "SUV",
    year: "2022",
    price: "95,750",
    mileage: "21,800 km",
    fuel: "Diesel",
    transmission: "Automatic",
    photoCount: "15",
    featured: true,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
  }
];

export default function InventoryPage() {
  const searchParams = useSearchParams();
  
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
  
  // Layout state
  const [viewMode, setViewMode] = useState("grid");
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sort state
  const [sortBy, setSortBy] = useState("newest");
  
  // Mobile filters visibility state
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  
  // Featured cars
  const [featuredCars, setFeaturedCars] = useState([]);

  // Check for URL parameters to set initial filters
  useEffect(() => {
    // Get parameters from URL
    const urlCategory = searchParams.get('category');
    const urlFuel = searchParams.get('fuel');
    
    // Set filters based on URL parameters if they exist
    const newFilters = { ...filters };
    let needsUpdate = false;
    
    if (urlCategory) {
      // Handle the case where URL has "/inventory/suv" style URLs
      const urlPath = window.location.pathname;
      const pathSegments = urlPath.split('/').filter(Boolean);
      
      if (pathSegments.length > 1) {
        const pathCategory = pathSegments[1].toLowerCase();
        
        // Convert URL path segment to a category value
        switch (pathCategory) {
          case 'suv':
            newFilters.category = 'suv';
            needsUpdate = true;
            break;
          case 'sedan':
            newFilters.category = 'sedan';
            needsUpdate = true;
            break;
          case 'luxury':
            newFilters.category = 'luxury';
            needsUpdate = true;
            break;
          case 'electric':
            newFilters.category = 'electric';
            needsUpdate = true;
            break;
          case 'hybrid':
            newFilters.category = 'hybrid';
            needsUpdate = true;
            break;
        }
      } else if (urlCategory) {
        // Handle query parameters like ?category=suv
        newFilters.category = urlCategory;
        needsUpdate = true;
      }
    }
    
    if (urlFuel) {
      newFilters.fuel = urlFuel;
      needsUpdate = true;
    }
    
    // Update filters if needed
    if (needsUpdate) {
      setFilters(newFilters);
    }
  }, [searchParams]);

  // Fetch cars data
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters based on filters
        const queryParams = new URLSearchParams();
        
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        if (filters.minYear) queryParams.append('minYear', filters.minYear);
        if (filters.maxYear) queryParams.append('maxYear', filters.maxYear);
        if (filters.fuel) queryParams.append('fuel', filters.fuel);
        if (filters.transmission) queryParams.append('transmission', filters.transmission);
        if (searchTerm) queryParams.append('search', searchTerm);
        
        // Set sort parameter
        switch (sortBy) {
          case 'newest':
            queryParams.append('sort', 'year_desc');
            break;
          case 'oldest':
            queryParams.append('sort', 'year_asc');
            break;
          case 'priceAsc':
            queryParams.append('sort', 'price_asc');
            break;
          case 'priceDesc':
            queryParams.append('sort', 'price_desc');
            break;
          default:
            queryParams.append('sort', 'year_desc');
        }
        
        // Fetch data from API
        console.log('Fetching cars from API with params:', queryParams.toString());
        
        // Use API route instead of direct fetch
        const response = await fetch(`/api/cars?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching cars: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API response:', result);
        
        if (result && result.data && Array.isArray(result.data)) {
          setCars(result.data);
        } else {
          // Fallback to sample data if API returns no results
          console.log('No cars found in API response, using sample data');
          setCars(sampleCars);
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load vehicles. Please try again later.');
        
        // Fallback to sample data on error
        setCars(sampleCars);
      } finally {
        setLoading(false);
        setFeaturedCars([]); // Clear featured cars since we've removed the section
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
  
  // Toggle view mode (grid or list)
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    return Object.values(filters).filter(val => val !== "").length;
  };
  
  const activeFilterCount = getActiveFilterCount();

  return (
    <>
      {/* Ensure Navbar is at the top */}
      <Navbar />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Section with Search */}
        <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12 lg:py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Find Your Perfect Drive
              </h1>
              <p className="text-gray-300 md:text-lg mb-8 max-w-2xl mx-auto">
                Browse our extensive collection of premium vehicles tailored to your needs and preferences.
              </p>
              
              {/* Main Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto group">
                <input
                  type="text"
                  name="search"
                  placeholder="Search by make, model, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-4 px-5 pr-12 rounded-full text-gray-800 placeholder-gray-500 bg-white/95 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-3 rounded-full group-hover:bg-orange-600 transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
              
              {/* Quick Category Links */}
              <div className="hidden md:flex items-center justify-center gap-3 mt-8">
                <Link href="/inventory?category=suv" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm transition-colors">
                  SUVs
                </Link>
                <Link href="/inventory?category=sedan" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm transition-colors">
                  Sedans
                </Link>
                <Link href="/inventory?category=luxury" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm transition-colors">
                  Luxury
                </Link>
                <Link href="/inventory?category=electric" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm transition-colors">
                  Electric
                </Link>
                <Link href="/inventory?category=hybrid" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm transition-colors">
                  Hybrid
                </Link>
              </div>
            </div>
          </div>
        </section>
        
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
        
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters - Desktop */}
              <div className="hidden lg:block w-72 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-[130px]">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Sliders size={18} className="mr-2 text-orange-500" />
                        Filters
                      </h3>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={handleResetFilters}
                          className="text-xs bg-orange-50 text-orange-600 hover:bg-orange-100 px-2.5 py-1 rounded-full font-medium transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    {activeFilterCount > 0 && (
                      <div className="mt-2 text-sm text-gray-500">
                        {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} applied
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <SidebarFilters
                      filterOptions={filterOptions}
                      filters={filters}
                      updateFilter={handleFilterChange}
                      resetFilters={handleResetFilters}
                    />
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1">
                {/* Mobile Filter Button */}
                <div className="flex items-center justify-between bg-white lg:hidden mb-4 p-3 rounded-lg shadow-sm">
                  <button
                    onClick={toggleMobileFilters}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <Filter size={18} />
                    <span className="font-medium">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="ml-1.5 bg-orange-100 text-orange-600 text-xs px-1.5 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleViewMode('grid')}
                      className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-100 text-orange-500' : 'text-gray-500'}`}
                    >
                      <Grid3X3 size={18} />
                    </button>
                    <button
                      onClick={() => toggleViewMode('list')}
                      className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-100 text-orange-500' : 'text-gray-500'}`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Sorting & Results Info */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-5 flex flex-wrap justify-between items-center gap-4">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Car size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium text-gray-900">{cars.length}</span>{" "}
                    vehicles found
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* Desktop View Mode Toggles */}
                    <div className="hidden lg:flex items-center bg-gray-100 rounded-md p-1">
                      <button
                        onClick={() => toggleViewMode('grid')}
                        className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-500'}`}
                      >
                        <Grid3X3 size={18} />
                      </button>
                      <button
                        onClick={() => toggleViewMode('list')}
                        className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-500'}`}
                      >
                        <List size={18} />
                      </button>
                    </div>
                    
                    {/* Sort Options */}
                    <div className="relative">
                      <select
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-2 pl-3 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={sortBy}
                        onChange={handleSortChange}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
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

                {/* Mobile Filters Panel */}
                {mobileFiltersVisible && (
                  <MobileFilters
                    filterOptions={filterOptions}
                    filters={filters}
                    updateFilter={handleFilterChange}
                    resetFilters={handleResetFilters}
                    closeFilters={toggleMobileFilters}
                  />
                )}

                {/* Loading State */}
                {loading ? (
                  <div className="flex items-center justify-center py-16 bg-white rounded-xl shadow-sm">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 mx-auto text-orange-500 animate-spin mb-4" />
                      <p className="text-gray-600 font-medium">Loading inventory...</p>
                      <p className="text-gray-500 text-sm mt-1">Finding the perfect ride for you</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
                    <div className="flex items-start">
                      <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
                      <div>
                        <h3 className="font-medium text-red-800">Error Loading Inventory</h3>
                        <p className="text-red-700 text-sm mt-1">{error}</p>
                        <button 
                          onClick={() => window.location.reload()}
                          className="mt-3 text-sm bg-white px-3 py-1.5 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                ) : cars.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <X className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                    <p className="text-gray-500 mb-6">We couldn't find any vehicles matching your criteria.</p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-orange-100 text-orange-600 rounded-md font-medium hover:bg-orange-200 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  /* Car Grid or List View */
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" 
                    : "space-y-4"
                  }>
                    {cars.map(car => (
                      <CarCard 
                        key={car.id} 
                        car={car} 
                        listView={viewMode === 'list'} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
