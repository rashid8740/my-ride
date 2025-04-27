"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import apiService from '@/utils/api';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  Car,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpDown,
  Download,
  X,
  Trash2,
  Reply,
  User,
  ArrowRight,
  Eye,
  Loader2,
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    new: {
      color: 'bg-blue-100 text-blue-800',
      icon: <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>,
      label: 'New'
    },
    inProgress: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="h-3 w-3 mr-1.5" />,
      label: 'In Progress'
    },
    resolved: {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="h-3 w-3 mr-1.5" />,
      label: 'Resolved'
    }
  };

  const config = statusConfig[status] || statusConfig.new;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Mobile card component for inquiries
const InquiryCard = ({ inquiry, onView, onDelete }) => {
  // Format date
  const formattedDate = new Date(inquiry.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Get vehicle info from either car reference or vehicleInfo field
  const vehicleInfo = inquiry.car ? 
    `${inquiry.car.year} ${inquiry.car.make} ${inquiry.car.model}` : 
    (inquiry.vehicleInfo || 'Not specified');
  
  // Get a truncated message preview
  const messagePreview = inquiry.message ? 
    (inquiry.message.length > 100 ? inquiry.message.substring(0, 100) + '...' : inquiry.message) : 
    'No message';

  return (
    <div className="block sm:hidden bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
          <div className="text-xs text-gray-500 flex items-center mt-1">
            <Mail className="h-3 w-3 mr-1 text-gray-400" />
            {inquiry.email}
          </div>
        </div>
        <StatusBadge status={inquiry.status} />
      </div>
      
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1 flex items-center">
          <Car className="h-3 w-3 mr-1 text-gray-400" />
          {vehicleInfo}
        </div>
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
          {messagePreview}
        </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
        <div className="text-xs text-gray-500 flex items-center">
          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
          {formattedDate}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(inquiry)}
            className="bg-orange-50 text-orange-600 hover:bg-orange-100 p-2 rounded-lg text-sm"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(inquiry)}
            className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg text-sm"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const InquiryRow = ({ inquiry, onView, onDelete }) => {
  // Format date
  const formattedDate = new Date(inquiry.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Get vehicle info from either car reference or vehicleInfo field
  const vehicleInfo = inquiry.car ? 
    `${inquiry.car.year} ${inquiry.car.make} ${inquiry.car.model}` : 
    (inquiry.vehicleInfo || 'Not specified');
  
  // Get a truncated message preview
  const messagePreview = inquiry.message ? 
    (inquiry.message.length > 50 ? inquiry.message.substring(0, 50) + '...' : inquiry.message) : 
    'No message';
  
  return (
    <tr className="hidden sm:table-row hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-2">
            <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
            <div className="text-sm text-gray-500">{inquiry.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{vehicleInfo}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{messagePreview}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={inquiry.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formattedDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={() => onView(inquiry)}
          className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1.5 rounded-full transition-colors"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onDelete(inquiry)}
          className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1.5 rounded-full transition-colors ml-2"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
};

export default function AdminInquiries() {
  const { user } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    vehicle: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [availableVehicles, setAvailableVehicles] = useState([]);

  useEffect(() => {
    fetchInquiries();
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [inquiries, filters, sortBy, sortOrder]);

  const fetchInquiries = async () => {
    try {
      console.log('🔍 [Admin/Inquiries] Starting to fetch inquiries');
      setIsLoading(true);
      setError(null);

      const response = await apiService.contact.getAll();
      console.log('✅ [Admin/Inquiries] Received inquiries data:', response);
      console.log(`✅ [Admin/Inquiries] Total inquiries fetched: ${response.data?.length || 0}`);
      
      if (response.data && response.data.length === 0) {
        console.warn('⚠️ [Admin/Inquiries] No inquiries found in the database');
      }
      
      setInquiries(response.data);
      setFilteredInquiries(response.data);
    } catch (err) {
      console.error('❌ [Admin/Inquiries] Error fetching inquiries:', err);
      console.error('❌ [Admin/Inquiries] Error details:', {
        message: err.message,
        stack: err.stack
      });
      setError('Failed to load inquiries. Please try again later.');
    } finally {
      setIsLoading(false);
      console.log('🔍 [Admin/Inquiries] Finished inquiry fetch attempt');
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await apiService.cars.getAll();
      const vehicleOptions = response.data.map(car => 
        `${car.year} ${car.make} ${car.model}`
      );
      setAvailableVehicles([...new Set(vehicleOptions)]);
    } catch (err) {
      console.error('Error fetching vehicles for filter:', err);
    }
  };

  const applyFiltersAndSort = () => {
    console.log('🔍 [Admin/Inquiries] Applying filters and sort to inquiries');
    console.log('🔍 [Admin/Inquiries] Current filters:', filters);
    console.log('🔍 [Admin/Inquiries] Sort by:', sortBy, 'Order:', sortOrder);
    
    let result = [...inquiries];
    console.log(`🔍 [Admin/Inquiries] Starting with ${result.length} inquiries`);

    // Apply status filter
    if (filters.status) {
      result = result.filter(inquiry => inquiry.status === filters.status);
    }

    // Apply vehicle filter
    if (filters.vehicle) {
      result = result.filter(inquiry => 
        (inquiry.vehicleInfo && inquiry.vehicleInfo.includes(filters.vehicle)) ||
        (inquiry.car && `${inquiry.car.year} ${inquiry.car.make} ${inquiry.car.model}`.includes(filters.vehicle))
      );
    }

    // Apply date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(inquiry => new Date(inquiry.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      result = result.filter(inquiry => new Date(inquiry.createdAt) <= toDate);
    }

    // Apply search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(inquiry => 
        (inquiry.name && inquiry.name.toLowerCase().includes(searchLower)) ||
        (inquiry.email && inquiry.email.toLowerCase().includes(searchLower)) ||
        (inquiry.phone && inquiry.phone.includes(searchLower)) ||
        (inquiry.message && inquiry.message.toLowerCase().includes(searchLower)) ||
        (inquiry.vehicleInfo && inquiry.vehicleInfo.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredInquiries(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      vehicle: '',
      search: '',
      dateFrom: '',
      dateTo: ''
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

  const handleViewInquiry = (inquiry) => {
    router.push(`/admin/inquiries/${inquiry._id}`);
  };

  const handleDeleteClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedInquiry) return;
    
    try {
      await apiService.contact.delete(selectedInquiry._id);
      setInquiries(inquiries.filter(inq => inq._id !== selectedInquiry._id));
      setDeleteModalOpen(false);
      setSelectedInquiry(null);
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      setError('Failed to delete inquiry. Please try again later.');
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedInquiry(null);
  };

  const getInquiryStats = () => {
    const total = inquiries.length;
    const newCount = inquiries.filter(inq => inq.status === 'new').length;
    const inProgressCount = inquiries.filter(inq => inq.status === 'inProgress').length;
    const resolvedCount = inquiries.filter(inq => inq.status === 'resolved').length;
    
    return { total, newCount, inProgressCount, resolvedCount };
  };

  const stats = getInquiryStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Inquiries</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and respond to customer messages</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center ${
              showFilters 
                ? 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-1.5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{inquiries.length}</p>
            </div>
            <div className="rounded-lg p-2 bg-blue-500">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New Inquiries</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {inquiries.filter(i => i.status === 'new').length}
              </p>
            </div>
            <div className="rounded-lg p-2 bg-green-500">
              <Mail className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {inquiries.filter(i => i.status === 'inProgress').length}
              </p>
            </div>
            <div className="rounded-lg p-2 bg-yellow-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Inquiries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="inProgress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle
              </label>
              <select
                id="vehicle"
                name="vehicle"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                value={filters.vehicle}
                onChange={handleFilterChange}
              >
                <option value="">All Vehicles</option>
                {availableVehicles.map(vehicle => (
                  <option key={vehicle} value={vehicle}>{vehicle}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            placeholder="Search by name, email, or message content"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Inquiries List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            <p className="mt-4 text-sm text-gray-600">Loading inquiries...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchInquiries}
                className="mt-2 text-sm font-medium text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile view - card layout */}
          <div className="sm:hidden">
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map(inquiry => (
                <InquiryCard 
                  key={inquiry._id} 
                  inquiry={inquiry}
                  onView={handleViewInquiry}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 rounded-full p-3">
                    <MessageSquare className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-gray-900 font-medium">No inquiries found</h3>
                <p className="text-gray-500 text-sm mt-1">There are no customer inquiries matching your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-gray-100 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Desktop view - table layout */}
          <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button 
                      className="flex items-center" 
                      onClick={() => toggleSort('name')}
                    >
                      Customer 
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button 
                      className="flex items-center" 
                      onClick={() => toggleSort('vehicleInfo')}
                    >
                      Vehicle
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Message
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button 
                      className="flex items-center" 
                      onClick={() => toggleSort('status')}
                    >
                      Status
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button 
                      className="flex items-center" 
                      onClick={() => toggleSort('createdAt')}
                    >
                      Date
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map(inquiry => (
                    <InquiryRow 
                      key={inquiry._id} 
                      inquiry={inquiry}
                      onView={handleViewInquiry}
                      onDelete={handleDeleteClick}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 rounded-full p-3 mb-3">
                          <MessageSquare className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-medium">No inquiries found</h3>
                        <p className="text-gray-500 text-sm mt-1">There are no customer inquiries matching your filters</p>
                        <button
                          onClick={clearFilters}
                          className="mt-4 px-4 py-2 bg-gray-100 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <div className="bg-red-50 rounded-full p-3">
                <AlertCircle className="h-10 w-10" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Inquiry</h2>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete this inquiry from <span className="font-semibold">{selectedInquiry?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 rounded-lg text-white font-medium text-sm hover:bg-red-600 transition-colors"
              >
                Delete Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}