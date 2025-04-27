"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiService from '@/utils/api';
import { useAuth } from '@/utils/AuthContext';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle,
  ArrowUpDown,
  UserPlus,
  Download,
  X,
  Loader2,
  LogIn,
  RefreshCw
} from 'lucide-react';

// Simple API wrapper with token handling
const API = {
  async getUsers() {
    try {
      // Check if the user is already authenticated via the auth context
      const token = localStorage.getItem('token');
      console.log('Current token available:', token ? 'Yes' : 'No');
      
      // Use the correct users property (not user)
      console.log('Fetching users using apiService.users.getAll()');
      
      try {
        const result = await apiService.users.getAll();
        console.log('Users API response:', result);
        
        if (result && result.status === 'success' && Array.isArray(result.data)) {
          console.log(`Successfully fetched ${result.data.length} users`);
          return { success: true, users: result.data, count: result.data.length };
        } else {
          console.error('Invalid response format:', result);
          return { 
            success: false, 
            error: 'Failed to load users. The server returned an unexpected response format.' 
          };
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        
        // Provide more descriptive error messages based on error type
        if (error.message && error.message.includes('Network Error')) {
          return { 
            success: false, 
            error: 'Network error: Unable to connect to the server. Please check your internet connection.' 
          };
        } else if (error.message && error.message.includes('404')) {
          return { 
            success: false, 
            error: 'The users API endpoint could not be found. Please contact the administrator.' 
          };
        } else if (error.message && error.message.includes('401')) {
          return { 
            success: false, 
            error: 'Authentication required. Please log in again.' 
          };
        }
        
        return { 
          success: false, 
          error: `Failed to load users: ${error.message}` 
        };
      }
    } catch (error) {
      console.error('Error in getUsers:', error);
      return { success: false, error: 'Error loading users: ' + error.message };
    }
  }
};

export default function UsersPage() {
  const router = useRouter();
  const { login, isAuthenticated, isAdmin, user } = useAuth();
  // State for users data and UI state
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    newUsers: 0
  });

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      setError("You must be logged in to access this page");
      console.error("Not authenticated - Need to login first");
    } else if (!isAdmin) {
      setError("You need admin privileges to access this page");
      console.error("Not an admin user - Access denied");
    } else {
      // User is authenticated and is admin, proceed to load users
      loadUsers();
    }
  }, [isAuthenticated, isAdmin]);

  // Load users function
  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    // Detailed auth log for debugging
    console.log('=== Auth Status Debug ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('isAdmin:', isAdmin);
    console.log('User object:', user);
    console.log('Token exists:', !!localStorage.getItem('token'));
    if (localStorage.getItem('token')) {
      console.log('Token preview:', localStorage.getItem('token').substring(0, 15) + '...');
    }
    console.log('=====================');
    
    // Try up to 2 times to load users
    let attempts = 0;
    const maxAttempts = 2;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts} of ${maxAttempts} to load users`);
      
      try {
        const result = await API.getUsers();
        console.log('API response:', result);
        
        if (result.success) {
          setUsers(result.users);
          calculateStats(result.users);
          setIsLoading(false);
          return; // Exit on success
        } else if (attempts < maxAttempts) {
          // Wait before retrying
          console.log(`Retrying in 1 second... (Error: ${result.error})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          // Final failure
          setError(result.error || 'Failed to load users after multiple attempts');
          setUsers([]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error in loadUsers:', error);
        if (attempts < maxAttempts) {
          console.log('Retrying after error...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          setError(`Critical error: ${error.message}`);
          setIsLoading(false);
        }
      }
    }
  };
  
  // Calculate user statistics
  const calculateStats = (userData) => {
    setStatsData({
      totalUsers: userData.length,
      activeUsers: userData.filter(user => user.role === 'user' || user.role === 'customer').length,
      adminUsers: userData.filter(user => user.role === 'admin').length,
      newUsers: userData.filter(user => {
        const createdAt = new Date(user.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdAt >= thirtyDaysAgo;
      }).length
    });
  };

  // Handle search and filters
  useEffect(() => {
    let result = [...users];
    
    // Apply role filter
    if (filters.role !== 'all') {
      result = result.filter(user => user.role === filters.role);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        (user.firstName?.toLowerCase().includes(term)) || 
        (user.lastName?.toLowerCase().includes(term)) || 
        (user.email?.toLowerCase().includes(term)) ||
        (user.phone?.includes(term))
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        
        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredUsers(result);
  }, [users, filters, searchTerm, sortConfig]);

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Component for role badges
  const UserRoleBadge = ({ role }) => {
    const getRoleBadgeStyles = (role) => {
      switch (role) {
        case 'admin':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'manager':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'dealer':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'customer':
        case 'user':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeStyles(role)}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handler for showing delete confirmation
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Handler for confirming user deletion
  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      await apiService.users.delete(userToDelete._id);
      setUsers(users.filter(user => user._id !== userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for clearing filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      role: 'all',
    });
    setSortConfig({
      key: 'createdAt',
      direction: 'desc'
    });
  };

  // Navigate to add user page
  const handleAddUser = () => {
    router.push('/admin/users/add');
  };

  // Navigate to edit user page
  const handleEditUser = (userId) => {
    router.push(`/admin/users/edit/${userId}`);
  };

  // Handler for user avatar
  const UserAvatar = ({ user }) => {
    const getInitials = () => {
      if (user?.firstName && user?.lastName) {
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
      }
      if (user?.firstName) {
        return user.firstName[0].toUpperCase();
      }
      if (user?.email) {
        return user.email[0].toUpperCase();
      }
      return '?';
    };

    return (
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
          {getInitials()}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-gray-500">{user._id?.substring(0, 8) || user.id}</p>
        </div>
      </div>
    );
  };

  // Mobile user card component
  const UserCard = ({ user }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 sm:hidden">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-semibold text-sm">
            {user.firstName ? user.firstName[0] : ''}
            {user.lastName ? user.lastName[0] : ''}
          </div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
            <div className="text-xs text-gray-500 flex items-center mt-0.5">
              <Mail className="h-3 w-3 mr-1 text-gray-400" />
              {user.email}
            </div>
          </div>
          <UserRoleBadge role={user.role} />
        </div>
        
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Joined {formatDate(user.createdAt)}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditUser(user._id)}
              className="p-1.5 bg-gray-50 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteClick(user)}
              className="p-1.5 bg-gray-50 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  };

  // If there's an error, display the error panel prominently
  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="mr-2 h-6 w-6 text-orange-500" />
            Users Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and monitor all users in the system.</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-6">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-red-700 text-center mb-2">Error Loading Users</h2>
          <p className="text-center text-red-600 mb-6">{error}</p>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-red-100">
              <h3 className="font-medium text-gray-900 mb-2">Troubleshooting Steps:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Check your internet connection</li>
                <li>Verify that the backend server is running</li>
                <li>Confirm you have admin privileges</li>
                <li>Try logging out and logging back in</li>
              </ul>
            </div>
            
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={loadUsers}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <RefreshCw className="h-5 w-5 mr-2" />}
                Try Again
              </button>
              
              <Link
                href="/login"
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transition-colors flex items-center"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Re-authenticate
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-orange-500 rounded-lg text-white text-sm font-medium flex items-center hover:bg-orange-600 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{statsData.totalUsers}</p>
            </div>
            <div className="rounded-lg p-2 bg-blue-500">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{statsData.activeUsers}</p>
            </div>
            <div className="rounded-lg p-2 bg-green-500">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Admin Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{statsData.adminUsers}</p>
            </div>
            <div className="rounded-lg p-2 bg-purple-500">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{statsData.newUsers}</p>
            </div>
            <div className="rounded-lg p-2 bg-orange-500">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <select
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="dealer">Dealer</option>
              <option value="user">User</option>
              <option value="customer">Customer</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <button 
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:bg-gray-50 transition-colors"
            onClick={clearFilters}
          >
            <RefreshCw className="h-4 w-4 mr-1.5 text-gray-400" />
            Reset
          </button>
        </div>
      </div>

      {/* User listing */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            <p className="mt-4 text-gray-600 text-sm">Loading users...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                className="mt-2 text-sm text-red-700 font-medium underline"
                onClick={loadUsers}
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <UserCard key={user._id} user={user} />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-gray-100 p-3">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-gray-900 font-medium">No users found</h3>
                <p className="text-gray-500 text-sm mt-1">Try changing your search or filter criteria</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Desktop view - table layout */}
          <div className="hidden sm:block bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('firstName')}
                    >
                      User 
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('email')}
                    >
                      Contact 
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('role')}
                    >
                      Role 
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('createdAt')}
                    >
                      Joined 
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-semibold text-sm">
                            {user.firstName ? user.firstName[0] : ''}
                            {user.lastName ? user.lastName[0] : ''}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                            {user.username && (
                              <div className="text-sm text-gray-500">@{user.username}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Phone className="h-4 w-4 mr-1.5 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <UserRoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleEditUser(user._id)}
                            className="text-gray-500 hover:text-orange-600 p-1.5 rounded-full hover:bg-orange-50 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="ml-2 text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-gray-100 p-3 mb-3">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-medium">No users found</h3>
                        <p className="text-gray-500 text-sm mt-1">Try changing your search or filter criteria</p>
                        <button
                          onClick={clearFilters}
                          className="mt-4 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors"
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
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <div className="bg-red-50 rounded-full p-3">
                <AlertCircle className="h-10 w-10" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Delete User</h2>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{userToDelete?.firstName} {userToDelete?.lastName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 rounded-lg text-white font-medium text-sm hover:bg-red-600 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}