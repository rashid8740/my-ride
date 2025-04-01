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
      setIsLoading(true);
      setError(null);

      const response = await apiService.contact.getAll();
      setInquiries(response.data);
      setFilteredInquiries(response.data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      setError('Failed to load inquiries. Please try again later.');
    } finally {
      setIsLoading(false);
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
    let result = [...inquiries];

    // Apply status filter
    if (filters.status) {
      result = result.filter(inquiry => inquiry.status === filters.status);
    }

    // Apply vehicle filter
    if (filters.vehicle) {
      result = result.filter(inquiry => 
        inquiry.vehicle && inquiry.vehicle.includes(filters.vehicle)
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
        (inquiry.vehicle && inquiry.vehicle.toLowerCase().includes(searchLower))
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
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Inquiries</h1>
            <p className="text-gray-500">Manage and respond to customer questions and requests</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm font-medium text-gray-500">Total Inquiries</div>
            <div className="mt-1 flex items-end">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500 ml-2 mb-1">total messages</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm font-medium text-gray-500">New</div>
            <div className="mt-1 flex items-end">
              <div className="text-2xl font-bold text-blue-600">{stats.newCount}</div>
              <div className="text-xs text-gray-500 ml-2 mb-1">awaiting response</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm font-medium text-gray-500">In Progress</div>
            <div className="mt-1 flex items-end">
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgressCount}</div>
              <div className="text-xs text-gray-500 ml-2 mb-1">being addressed</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm font-medium text-gray-500">Resolved</div>
            <div className="mt-1 flex items-end">
              <div className="text-2xl font-bold text-green-600">{stats.resolvedCount}</div>
              <div className="text-xs text-gray-500 ml-2 mb-1">successfully completed</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {stats.newCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">Attention Required</h3>
                <div className="mt-1 text-sm text-orange-700">
                  <p>You have {stats.newCount} new inquiries that need your attention. Please respond to them promptly.</p>
                </div>
                <div className="mt-2">
                  <button 
                    onClick={() => setFilters({...filters, status: 'new'})}
                    className="text-sm font-medium text-orange-800 hover:text-orange-900 flex items-center"
                  >
                    View new inquiries
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`bg-white rounded-xl shadow-sm p-4 mb-6 ${showFilters ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Filter Inquiries</h2>
            <button 
              onClick={clearFilters}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="inProgress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
              <select
                id="vehicle"
                name="vehicle"
                value={filters.vehicle}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">All Vehicles</option>
                {availableVehicles.map(vehicle => (
                  <option key={vehicle} value={vehicle}>{vehicle}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
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
            placeholder="Search by name, email, phone, or message content..."
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

        {/* Inquiries table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {filteredInquiries.length} {filteredInquiries.length === 1 ? 'Inquiry' : 'Inquiries'} Found
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
                    <button onClick={() => toggleSort('name')} className="flex items-center">
                      Customer
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('vehicle')} className="flex items-center">
                      Vehicle
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('message')} className="flex items-center">
                      Message
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('status')} className="flex items-center">
                      Status
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort('createdAt')} className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map(inquiry => (
                    <tr key={inquiry._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {inquiry.name}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {inquiry.email}
                              </span>
                              {inquiry.phone && (
                                <span className="flex items-center mt-1 sm:mt-0">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {inquiry.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          {inquiry.vehicle ? (
                            <>
                              <Car className="h-4 w-4 text-gray-500 mr-2" />
                              {inquiry.vehicle}
                            </>
                          ) : (
                            <span className="text-gray-500">Not specified</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {inquiry.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={inquiry.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleViewInquiry(inquiry)}
                          className="text-blue-500 hover:text-blue-700 inline-flex items-center text-sm font-medium mr-3"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </button>
                        {inquiry.status !== 'resolved' && (
                          <button
                            onClick={() => router.push(`/admin/inquiries/reply/${inquiry._id}`)}
                            className="text-orange-500 hover:text-orange-700 inline-flex items-center text-sm font-medium mr-3"
                          >
                            <Reply className="h-4 w-4" />
                            <span className="sr-only">Reply</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(inquiry)}
                          className="text-red-500 hover:text-red-700 inline-flex items-center text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No inquiries found matching your criteria
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
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete Inquiry</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this inquiry from {selectedInquiry?.name}? This action cannot be undone.
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