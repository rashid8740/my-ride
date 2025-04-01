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
  Loader2
} from 'lucide-react';
import Link from 'next/link';

const CarListItem = ({ car, onEdit, onDelete, onView }) => {
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-blue-100 text-blue-800',
    sold: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-12 w-16 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[0].url}
                alt={car.make + ' ' + car.model}
                className="h-12 w-16 object-cover"
              />
            ) : (
              <div className="h-12 w-16 flex items-center justify-center">
                <Car size={20} className="text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {car.year} {car.make} {car.model}
            </div>
            <div className="text-xs text-gray-500">
              VIN: {car.vin?.slice(-6) || 'N/A'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">${car.price.toLocaleString()}</div>
        {car.msrp && car.msrp > car.price && (
          <div className="text-xs text-gray-500 line-through">
            MSRP: ${car.msrp.toLocaleString()}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium ${car.stock === 0 ? 'text-red-600' : car.stock < 3 ? 'text-yellow-600' : 'text-green-600'}`}>
          {car.stock} {car.stock === 1 ? 'unit' : 'units'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[car.status] || 'bg-gray-100 text-gray-800'}`}>
          {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button onClick={() => onView(car)} className="text-blue-500 hover:text-blue-700 text-sm font-medium mr-3">
          <span className="sr-only">View</span>
          <Eye className="h-4 w-4" />
        </button>
        <button onClick={() => onEdit(car)} className="text-orange-500 hover:text-orange-700 text-sm font-medium mr-3">
          <span className="sr-only">Edit</span>
          <Edit className="h-4 w-4" />
        </button>
        <button onClick={() => onDelete(car)} className="text-red-500 hover:text-red-700 text-sm font-medium">
          <span className="sr-only">Delete</span>
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
};

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

  // Fetch vehicles when component mounts
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.cars.getAll();
      setVehicles(response.data);
      
      // Extract unique makes for filter dropdown
      const makes = [...new Set(response.data.map(car => car.make))];
      setAvailableMakes(makes);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCar = (car) => {
    router.push(`/cars/${car._id}`);
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
    } catch (err) {
      console.error('Error deleting car:', err);
      setError('Failed to delete vehicle. Please try again later.');
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
    if (filters.minPrice && car.price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && car.price > parseInt(filters.maxPrice)) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        car.make.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.vin?.toLowerCase().includes(searchLower) ||
        car.year.toString().includes(searchLower)
      );
    }
    return true;
  }).sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'price' || sortBy === 'year' || sortBy === 'stock') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
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
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h1>
            <p className="text-gray-500">Manage your dealership's vehicle inventory</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <Link
              href="/admin/inventory/add"
              className="px-4 py-2 bg-orange-500 rounded-lg text-sm font-medium text-white hover:bg-orange-600 flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm font-medium text-gray-500">Total Vehicles</div>
            <div className="mt-1 flex items-end">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500 ml-2 mb-1">units in inventory</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm font-medium text-gray-500">Available</div>
            <div className="mt-1 flex items-end">
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-xs text-gray-500 ml-2 mb-1">ready for sale</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm font-medium text-gray-500">Reserved</div>
            <div className="mt-1 flex items-end">
              <div className="text-2xl font-bold text-blue-600">{stats.reserved}</div>
              <div className="text-xs text-gray-500 ml-2 mb-1">pending purchase</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm font-medium text-gray-500">Sold</div>
            <div className="mt-1 flex items-end">
              <div className="text-2xl font-bold text-gray-600">{stats.sold}</div>
              <div className="text-xs text-gray-500 ml-2 mb-1">in last 30 days</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`bg-white rounded-xl shadow-sm p-4 mb-6 ${showFilters ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Filter Inventory</h2>
            <button 
              onClick={clearFilters}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <select
                id="make"
                name="make"
                value={filters.make}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">All Makes</option>
                {availableMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="Min $"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="Max $"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Search inventory by make, model, VIN, or year..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {filteredVehicles.length} {filteredVehicles.length === 1 ? 'Vehicle' : 'Vehicles'} Found
            </h2>
            <button className="text-sm text-gray-600 flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('make')} className="flex items-center">
                      Vehicle
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('price')} className="flex items-center">
                      Price
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('stock')} className="flex items-center">
                      Stock
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('status')} className="flex items-center">
                      Status
                      <ArrowUpDown className="ml-1 h-3 w-3" />
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
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No vehicles found matching your criteria
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
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete Vehicle</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete the {selectedCar?.year} {selectedCar?.make} {selectedCar?.model}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 rounded-lg text-sm font-medium text-white hover:bg-red-600 flex items-center"
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