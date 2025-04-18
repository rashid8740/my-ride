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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
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
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="mr-2 h-6 w-6 text-orange-500" />
              Users Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and monitor all users in the system.</p>
          </div>
          {isAuthenticated && (
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Logged in as:</span>
              <span className="font-medium text-sm text-gray-900">{user?.firstName} {user?.lastName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statsData.totalUsers}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            All registered users in the system
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statsData.activeUsers}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Standard user accounts
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admin Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statsData.adminUsers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Users with admin privileges
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statsData.newUsers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Users registered in the last 30 days
          </div>
        </div>
      </div>

      {/* Filters and actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 mb-4">
          <h2 className="text-lg font-medium text-gray-900">Users List</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleAddUser}
              className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Add User</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
              <Download className="h-4 w-4 mr-1" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or phone"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
              }}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              autoComplete="off"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <button
              onClick={clearFilters}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-10">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
              <span className="mt-2 text-gray-500">Loading users...</span>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10">
            <Users className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-gray-500">Try changing your filters or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center font-medium focus:outline-none"
                      onClick={() => handleSort('firstName')}
                    >
                      User
                      {sortConfig.key === 'firstName' && (
                        <span className="ml-1">
                          <ArrowUpDown className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center font-medium focus:outline-none"
                      onClick={() => handleSort('role')}
                    >
                      Role
                      {sortConfig.key === 'role' && (
                        <span className="ml-1">
                          <ArrowUpDown className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center font-medium focus:outline-none"
                      onClick={() => handleSort('createdAt')}
                    >
                      Joined
                      {sortConfig.key === 'createdAt' && (
                        <span className="ml-1">
                          <ArrowUpDown className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <UserAvatar user={user} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Phone className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <UserRoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                          title="Edit user"
                          onClick={() => handleEditUser(user._id || user.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                          title="Delete user"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <AlertCircle className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center">Delete User</h3>
            <p className="text-gray-600 my-4 text-center">
              Are you sure you want to delete <span className="font-semibold">{userToDelete?.firstName} {userToDelete?.lastName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}