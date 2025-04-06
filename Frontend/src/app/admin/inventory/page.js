"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import apiService from '@/utils/api';
import { 
  Car, 
  Plus, 
  Filter, 
  Search, 
  ChevronDown, 
  Settings, 
  Eye, 
  Edit, 
  Trash2, 
  AlertCircle, 
  Check, 
  X, 
  Download,
  ArrowUpDown,
  Loader2,
  ShoppingCart,
  Tag,
  Wallet,
  FileText,
  MoreHorizontal,
  Sliders,
  CalendarDays,
  Clock,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// Enhanced Car List Item with hover effects and better visuals
const CarListItem = ({ car, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);
  
  // Helper function to get the first image URL safely
  const getFirstImageUrl = (car) => {
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
    
    return null;
  };
  
  const imageUrl = getFirstImageUrl(car);
  
  const statusColors = {
    available: 'bg-green-100 text-green-800 border-green-200',
    reserved: 'bg-blue-100 text-blue-800 border-blue-200',
    sold: 'bg-gray-100 text-gray-800 border-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  const statusIcons = {
    available: <Tag className="h-3 w-3 mr-1" />,
    reserved: <Clock className="h-3 w-3 mr-1" />,
    sold: <ShoppingCart className="h-3 w-3 mr-1" />,
    pending: <RefreshCw className="h-3 w-3 mr-1" />
  };

  return (
    <tr 
      className="hover:bg-orange-50 transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-16 w-24 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden border border-gray-200">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={car.make + ' ' + car.model}
                className="h-16 w-24 object-cover"
              />
            ) : (
              <div className="h-16 w-24 flex items-center justify-center">
                <Car size={20} className="text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-base font-medium text-gray-900">
              {car.year} {car.make} {car.model}
            </div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <FileText className="h-3 w-3 mr-1 text-gray-400" />
              VIN: {car.vin?.slice(-6) || 'N/A'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-base font-semibold text-gray-900">
          KSh {typeof car.price === 'number' 
            ? car.price.toLocaleString() 
            : (car.price || '0')}
        </div>
        {car.msrp && car.msrp > car.price && (
          <div className="text-xs text-gray-500 line-through mt-1 flex items-center">
            <Wallet className="h-3 w-3 mr-1 text-gray-400" />
            MSRP: KSh {typeof car.msrp === 'number' ? car.msrp.toLocaleString() : car.msrp}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium ${car.stock === 0 ? 'text-red-600' : car.stock < 3 ? 'text-yellow-600' : 'text-green-600'} flex items-center`}>
          <Tag className="h-4 w-4 mr-1" />
          {car.stock} {car.stock === 1 ? 'unit' : 'units'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[car.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
          {statusIcons[car.status]}
          {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className={`flex items-center justify-end transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
          <button 
            onClick={() => onView(car)} 
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded-full transition-colors"
            title="View vehicle details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onEdit(car)} 
            className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 p-1.5 rounded-full transition-colors ml-1"
            title="Edit vehicle"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(car)} 
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors ml-1"
            title="Delete vehicle"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Filter component for better organization
const InventoryFilters = ({ filters, availableMakes, handleFilterChange, clearFilters, showFilters }) => {
  if (!showFilters) return null;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Sliders className="h-5 w-5 text-orange-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filter Inventory</h2>
        </div>
        <button 
          onClick={clearFilters}
          className="text-sm text-orange-500 hover:text-orange-600 font-medium hover:bg-orange-50 px-3 py-1 rounded-md transition-colors flex items-center"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">Make</label>
          <div className="relative">
            <select
              id="make"
              name="make"
              value={filters.make}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 pl-3 pr-10 py-2 text-gray-700 appearance-none"
            >
              <option value="">All Makes</option>
              {availableMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <div className="relative">
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 pl-3 pr-10 py-2 text-gray-700 appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">KSh</span>
            </div>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="0"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 pl-12 pr-3 py-2"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">KSh</span>
            </div>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="Any"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 pl-12 pr-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats cards with improved visuals
const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
    <div className="flex items-start">
      <div className={`rounded-lg p-2 ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="ml-3">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className="flex items-end mt-1">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500 ml-2 mb-1">{subtitle}</div>
        </div>
      </div>
    </div>
  </div>
);

export default function AdminInventory() {
  const { user } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    make: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [availableMakes, setAvailableMakes] = useState([]);

  // Fetch vehicles when component mounts or when user navigates back to page
  useEffect(() => {
    // Set up a navigation event listener to force refresh when returning to this page
    const handleRouteChange = (url) => {
      if (url === '/admin/inventory') {
        console.log('Returned to inventory page, refreshing data...');
        fetchVehicles();
      }
    };
    
    // Listen for route changes
    const pushState = window.history.pushState;
    window.history.pushState = function() {
      const result = pushState.apply(this, arguments);
      handleRouteChange(window.location.pathname);
      return result;
    };
    
    // Initially fetch vehicles
    fetchVehicles();
    
    // Clean up
    return () => {
      window.history.pushState = pushState;
    };
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching vehicles from API...");
      
      // Try to get data from the backend first
      let vehicleData = [];
      
      try {
        const response = await fetch('/api/cars');
        const result = await response.json();
        
        console.log("API response:", result);
        
        if (result && result.data && Array.isArray(result.data)) {
          vehicleData = result.data;
          console.log(`Fetched ${vehicleData.length} vehicles from API`);
        }
      } catch (apiError) {
        console.error("Error fetching from API:", apiError);
        // Fall back to sample data for demo purposes if API fails
        vehicleData = [];
      }
      
      // If no vehicles were found from the API, use sample data
      if (vehicleData.length === 0) {
        console.log("No vehicles found in API, using sample data");
        // This is where you would add sample data for demonstration
        // vehicleData = sampleCars;
      }
      
      console.log(`Processing ${vehicleData.length} vehicles`);
      
      // Map through the data and ensure images are processed properly
      const processedVehicles = vehicleData.map(car => {
        // Create a copy of the car
        const processedCar = { ...car };
        
        // Process images if they exist
        if (car.images && Array.isArray(car.images)) {
          // Check if images are already in the correct format
          const hasUrlProperty = car.images.length > 0 && typeof car.images[0] === 'object' && car.images[0].url;
          
          if (!hasUrlProperty) {
            // Convert string URLs to objects with url property
            processedCar.images = car.images.map(img => {
              if (typeof img === 'string') return { url: img };
              return img;
            });
          }
        } else {
          // Initialize empty images array if none exists
          processedCar.images = [];
        }
        
        // If no stock property exists, default to 1
        if (!processedCar.stock && processedCar.stock !== 0) {
          processedCar.stock = 1;
        }
        
        // If no status property exists, default to 'available'
        if (!processedCar.status) {
          processedCar.status = 'available';
        }
        
        return processedCar;
      });
      
      setVehicles(processedVehicles);
      
      // Extract unique makes for filter dropdown
      const makes = [...new Set(processedVehicles.map(car => car.make).filter(Boolean))];
      setAvailableMakes(makes.sort());
    } catch (err) {
      console.error('Error processing vehicles:', err);
      setError('Failed to load vehicles. Please try again later.');
      toast.error('Could not load inventory data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCar = (car) => {
    console.log("Viewing car details for:", car);
    // Use the correct property for the ID depending on whether it's from the API or sample data
    const carId = car._id || car.id;
    router.push(`/cars/${carId}`);
  };

  const handleEditCar = (car) => {
    router.push(`/admin/inventory/edit/${car._id}`);
  };

  const handleDeleteClick = (car) => {
    setSelectedCar(car);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCar) return;
    
    try {
      await apiService.cars.deleteCar(selectedCar._id);
      setVehicles(vehicles.filter(v => v._id !== selectedCar._id));
      setDeleteModalOpen(false);
      setSelectedCar(null);
      toast.success('Vehicle deleted successfully');
    } catch (err) {
      console.error('Error deleting car:', err);
      setError('Failed to delete vehicle. Please try again later.');
      toast.error('Failed to delete vehicle');
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedCar(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      make: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      search: '',
    });
    toast.success('Filters cleared');
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Apply filters and sorting to vehicles
  const filteredVehicles = vehicles.filter(car => {
    if (filters.make && car.make !== filters.make) return false;
    if (filters.status && car.status !== filters.status) return false;
    
    // Handle price filtering for both string and number types
    const carPrice = typeof car.price === 'number' 
      ? car.price 
      : parseInt(car.price?.toString().replace(/[^\d]/g, '') || '0');
      
    if (filters.minPrice && carPrice < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && carPrice > parseInt(filters.maxPrice)) return false;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        car.make?.toLowerCase().includes(searchLower) ||
        car.model?.toLowerCase().includes(searchLower) ||
        car.vin?.toLowerCase().includes(searchLower) ||
        car.year?.toString().includes(searchLower)
      );
    }
    return true;
  }).sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'price' || sortBy === 'year' || sortBy === 'stock') {
      // Convert to number, handle string prices with commas
      aValue = typeof aValue === 'number' ? aValue : parseFloat(aValue?.toString().replace(/[^\d.-]/g, '') || '0');
      bValue = typeof bValue === 'number' ? bValue : parseFloat(bValue?.toString().replace(/[^\d.-]/g, '') || '0');
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue?.toLowerCase() || '';
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getInventoryStats = () => {
    const total = vehicles.length;
    const available = vehicles.filter(car => car.status === 'available').length;
    const reserved = vehicles.filter(car => car.status === 'reserved').length;
    const sold = vehicles.filter(car => car.status === 'sold').length;
    
    return { total, available, reserved, sold };
  };

  const stats = getInventoryStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
          <p className="mt-4 text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Car className="h-6 w-6 mr-2 text-orange-500" />
              Vehicle Inventory
            </h1>
            <p className="text-gray-500 mt-1">Manage your dealership's vehicle inventory</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                showFilters 
                  ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <Link
              href="/admin/inventory/add"
              className="px-4 py-2 bg-orange-500 rounded-lg text-sm font-medium text-white hover:bg-orange-600 flex items-center justify-center shadow-sm hover:shadow transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Vehicles" 
            value={stats.total} 
            subtitle="units in inventory" 
            icon={Car} 
            color="bg-indigo-500" 
          />
          <StatCard 
            title="Available" 
            value={stats.available} 
            subtitle="ready for sale" 
            icon={Tag} 
            color="bg-green-500" 
          />
          <StatCard 
            title="Reserved" 
            value={stats.reserved} 
            subtitle="pending purchase" 
            icon={Clock} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Sold" 
            value={stats.sold} 
            subtitle="in last 30 days" 
            icon={ShoppingCart} 
            color="bg-gray-500" 
          />
        </div>

        <InventoryFilters 
          filters={filters} 
          availableMakes={availableMakes} 
          handleFilterChange={handleFilterChange} 
          clearFilters={clearFilters}
          showFilters={showFilters}
        />

        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm"
            placeholder="Search inventory by make, model, VIN, or year..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Inventory table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="bg-orange-100 text-orange-600 rounded-full px-2 py-0.5 text-xs mr-2">
                {filteredVehicles.length}
              </span>
              {filteredVehicles.length === 1 ? 'Vehicle' : 'Vehicles'} Found
            </h2>
            <button className="text-sm text-gray-600 flex items-center px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('make')} className="flex items-center group">
                      Vehicle
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400 group-hover:text-orange-500" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('price')} className="flex items-center group">
                      Price
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400 group-hover:text-orange-500" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('stock')} className="flex items-center group">
                      Stock
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400 group-hover:text-orange-500" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('status')} className="flex items-center group">
                      Status
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400 group-hover:text-orange-500" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map(car => (
                    <CarListItem 
                      key={car._id} 
                      car={car} 
                      onView={handleViewCar}
                      onEdit={handleEditCar} 
                      onDelete={handleDeleteClick} 
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 bg-gray-50">
                      <div className="flex flex-col items-center">
                        <Car className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-500 font-medium">No vehicles found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
                        
                        <button 
                          onClick={clearFilters}
                          className="mt-4 px-4 py-2 text-sm bg-orange-50 text-orange-600 rounded-md font-medium hover:bg-orange-100 transition-colors"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <div className="bg-red-50 rounded-full p-3">
                <AlertCircle className="h-10 w-10" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Vehicle</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete the {selectedCar?.year} {selectedCar?.make} {selectedCar?.model}? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 rounded-lg text-sm font-medium text-white hover:bg-red-600 flex items-center transition-colors shadow-sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 