"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/utils/AuthContext';
import { 
  Users, 
  Car, 
  MessageSquare,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Check,
  Clock,
  ShieldCheck,
  Tag,
  ArrowUpRight,
  ChevronRight,
  User,
  Eye,
  Reply,
  Bell
} from 'lucide-react';
import apiService from '@/utils/api';
import Link from 'next/link';

// Activity Item Component
const ActivityItem = ({ icon, title, description, time, type = "neutral" }) => {
  const getIconBackground = () => {
    switch(type) {
      case "success": return "bg-green-100 text-green-600";
      case "warning": return "bg-yellow-100 text-yellow-600";
      case "error": return "bg-red-100 text-red-600";
      case "info": return "bg-blue-100 text-blue-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };
  
  return (
    <div className="flex items-start pb-4 mb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
      <div className={`flex-shrink-0 p-2 rounded-full ${getIconBackground()}`}>
        {icon}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon, color, subtext, trend = "up", onClick }) => {
  const getBgColor = () => {
    switch(color) {
      case "green": return "from-green-50 to-green-100 border-green-200";
      case "yellow": return "from-yellow-50 to-yellow-100 border-yellow-200";
      case "orange": return "from-orange-50 to-orange-100 border-orange-200";
      case "blue": return "from-blue-50 to-blue-100 border-blue-200";
      case "purple": return "from-purple-50 to-purple-100 border-purple-200";
      default: return "from-orange-50 to-orange-100 border-orange-200";
    }
  };

  const getIconColor = () => {
    switch(color) {
      case "green": return "bg-green-500 text-white";
      case "yellow": return "bg-yellow-500 text-white";
      case "orange": return "bg-orange-500 text-white";
      case "blue": return "bg-blue-500 text-white";
      case "purple": return "bg-purple-500 text-white";
      default: return "bg-orange-500 text-white";
    }
  };
  
  const getTrendColor = () => {
    return trend === "up" ? "text-green-600 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100";
  };
  
  return (
    <div 
      onClick={onClick} 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${getIconColor()} shadow-sm`}>
            {icon}
          </div>
              {change && (
            <div className={`px-2 py-1 text-xs font-medium rounded-full border ${getTrendColor()} flex items-center`}>
                  {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {change}
                </div>
              )}
            </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{value}</p>
            {subtext && <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>}
        </div>
      </div>
      {onClick && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          <Link href={typeof onClick === 'string' ? onClick : '#'} className="flex items-center justify-between text-xs font-medium text-gray-600 hover:text-orange-600 transition-colors">
            <span>View details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ value, max, color = "orange" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const getBarColor = () => {
    switch(color) {
      case "green": return "bg-green-500";
      case "yellow": return "bg-yellow-500";
      case "blue": return "bg-blue-500";
      case "red": return "bg-red-500";
      case "orange": return "bg-orange-500";
      default: return "bg-orange-500";
    }
  };
  
  return (
    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${getBarColor()} rounded-full`} 
        style={{ 
          width: `${percentage}%`,
          transition: 'width 1s ease-in-out'
        }}
      ></div>
    </div>
  );
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalInquiries: 0,
    totalRevenue: 0,
    recentInquiries: [],
    recentUsers: [],
    lowStockCars: [],
    salesByMonth: [
      { month: 'Jan', amount: 12000 },
      { month: 'Feb', amount: 18000 },
      { month: 'Mar', amount: 15000 },
      { month: 'Apr', amount: 22000 },
      { month: 'May', amount: 28000 },
      { month: 'Jun', amount: 32000 }
    ]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesGoal, setSalesGoal] = useState(150000);
  const [currentSales, setCurrentSales] = useState(128590);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyInquiry, setReplyInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const [showRefreshAlert, setShowRefreshAlert] = useState(false);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
    }
    
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to fetch dashboard data with useCallback
  const fetchDashboardData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);
      
      console.log('🔍 [Admin/Dashboard] Fetching dashboard data...');
      // Add retry logic for dashboard stats
      let attempts = 0;
      const maxAttempts = 3;
      let dashboardData;
      
      while (attempts < maxAttempts) {
        try {
          console.log(`🔍 [Admin/Dashboard] Attempt ${attempts + 1} to fetch dashboard stats`);
          dashboardData = await apiService.dashboard.getStats();
          console.log('✅ [Admin/Dashboard] Dashboard data received:', dashboardData);
          break; // Successfully got data, exit loop
        } catch (statsError) {
          console.error(`❌ [Admin/Dashboard] Attempt ${attempts + 1} failed:`, statsError);
          attempts++;
          
          if (attempts >= maxAttempts) {
            console.log('❌ [Admin/Dashboard] Max attempts reached, falling back to alternative data sources');
            throw statsError; // Will be caught by outer try/catch
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // If dashboard data is successfully fetched
      if (dashboardData && dashboardData.data) {
        console.log('✅ [Admin/Dashboard] Using dashboard data:', dashboardData.data);
        
        // Check specifically for inquiries
        if (dashboardData.data.recentInquiries) {
          console.log(`✅ [Admin/Dashboard] Recent inquiries count: ${dashboardData.data.recentInquiries.length}`);
        } else {
          console.warn('⚠️ [Admin/Dashboard] No recent inquiries found in dashboard data');
        }
      
        // Check for new inquiries
        const currentInquiriesCount = stats.recentInquiries.length;
        const newInquiriesCount = dashboardData.data.recentInquiries?.length || 0;
        
        if (newInquiriesCount > currentInquiriesCount && currentInquiriesCount > 0) {
          // We have new inquiries
          setNewInquiriesCount(newInquiriesCount - currentInquiriesCount);
          setShowRefreshAlert(true);
          
          // Auto-hide the alert after 5 seconds
          setTimeout(() => {
            setShowRefreshAlert(false);
          }, 5000);
        }
        
        setStats((prevStats) => ({
          ...prevStats,
            totalUsers: dashboardData.data.totalUsers || 0,
            totalCars: dashboardData.data.totalCars || 0,
            totalInquiries: dashboardData.data.totalInquiries || 0,
            recentInquiries: dashboardData.data.recentInquiries || [],
            recentUsers: dashboardData.data.recentUsers || [],
            lowStockCars: dashboardData.data.lowStockCars || []
        }));
        
        setLastRefreshTime(Date.now());
        setNewInquiriesCount(0);
      } else {
        // Fall back to fetching from multiple endpoints
        console.log('Falling back to fetching from multiple endpoints');
        const [usersResponse, carsResponse, inquiriesResponse] = await Promise.all([
          apiService.users.getAll().catch(err => {
            console.error('Failed to fetch users:', err);
            return { data: [] };
          }),
          apiService.cars.getAll().catch(err => {
            console.error('Failed to fetch cars:', err);
            return { data: [] };
          }),
          apiService.contact.getAll().catch(err => {
            console.error('Failed to fetch inquiries:', err);
            return { data: [] };
          })
        ]);
        
        // Extract the recent inquiries (last 5)
        const recentInquiries = inquiriesResponse.data
          ? inquiriesResponse.data
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
          : [];
          
        // Extract the recent users (last 5)
        const recentUsers = usersResponse.data
          ? usersResponse.data
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
          : [];
          
        // Extract cars with low stock (less than 3 units)
        const lowStockCars = carsResponse.data
          ? carsResponse.data
              .filter(car => car.stock < 3)
              .slice(0, 5)
          : [];
          
        setStats((prevStats) => ({
          ...prevStats,
            totalUsers: usersResponse.data?.length || 0,
            totalCars: carsResponse.data?.length || 0,
            totalInquiries: inquiriesResponse.data?.length || 0,
            recentInquiries,
            recentUsers,
            lowStockCars
        }));

        setLastRefreshTime(Date.now());
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later. Error: ' + (err.message || 'Unknown error'));
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [stats.recentInquiries.length]);
    
  // Set up auto-refresh every 60 seconds
  useEffect(() => {
    // Initial fetch
    fetchDashboardData();
    
    // Set up interval for auto-refresh
    const refreshInterval = setInterval(() => {
      // Silent refresh (don't show loading state)
      fetchDashboardData(false);
    }, 60000); // Every 60 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [fetchDashboardData]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-l-4 border-orange-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-white"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="h-4 w-4 text-orange-500 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-600">Loading dashboard data...</p>
        <div className="mt-3 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full animate-pulse-width"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border border-red-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load dashboard data</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate percentage of goal
  const salesPercentage = (currentSales / salesGoal) * 100;

  // Function to update inquiry status
  const updateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      setIsLoading(true);
      
      // Call the API to update the status
      await apiService.contact.updateStatus(inquiryId, { status: newStatus });
      
      // Update the local state to reflect the change
      setStats(prevStats => ({
        ...prevStats,
        recentInquiries: prevStats.recentInquiries.map(inquiry => 
          inquiry._id === inquiryId 
            ? { ...inquiry, status: newStatus } 
            : inquiry
        )
      }));
      
      setSelectedInquiry(null);
      setStatusDropdownOpen(false);
    } catch (err) {
      console.error('Error updating inquiry status:', err);
      // Show error notification or feedback here
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle sending reply to an inquiry
  const handleSendReply = async () => {
    if (!replyInquiry || !replyMessage.trim()) return;
    
    try {
      setSendingReply(true);
      
      // Call API to send reply
      await apiService.contact.reply(replyInquiry._id, { 
        message: replyMessage,
        adminName: `${user.firstName} ${user.lastName}` 
      });
      
      // Update inquiry status to in progress
      await updateInquiryStatus(replyInquiry._id, 'inProgress');
      
      // Clear form and close modal
      setReplyMessage('');
      setReplyInquiry(null);
      setReplyModalOpen(false);
      
      // You could add a success notification here
    } catch (err) {
      console.error('Error sending reply:', err);
      // Add error notification here
    } finally {
      setSendingReply(false);
    }
  };

  // Function to view inquiry details
  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
  };

  // Function to handle reply click
  const handleReplyClick = (inquiry) => {
    setReplyInquiry(inquiry);
    setReplyModalOpen(true);
  };

  // Function to render each inquiry row
  const renderInquiryRow = (inquiry) => {
    // Format date
    const formattedDate = new Date(inquiry.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Get vehicle information - either from car reference or vehicleInfo field
    const vehicleInfo = inquiry.car
      ? `${inquiry.car.year} ${inquiry.car.make} ${inquiry.car.model}`
      : (inquiry.vehicleInfo || 'No vehicle specified');

    // Get appropriate badge color based on status
    let statusColor = 'bg-blue-100 text-blue-800';
    if (inquiry.status === 'inProgress') {
      statusColor = 'bg-yellow-100 text-yellow-800';
    } else if (inquiry.status === 'resolved') {
      statusColor = 'bg-green-100 text-green-800';
    }

    return (
      <tr key={inquiry._id} className="hover:bg-gray-50">
        <td className="px-3 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-orange-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-semibold text-gray-900">{inquiry.name}</div>
              <div className="text-xs text-gray-600">{inquiry.email}</div>
            </div>
          </div>
        </td>
        <td className="px-3 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-800 truncate max-w-[120px]">{vehicleInfo}</div>
        </td>
        <td className="px-3 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${statusColor}`}>
            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
          </span>
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">
          {formattedDate}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-right text-xs font-medium">
          <button
            onClick={() => handleViewInquiry(inquiry)}
            className="text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-lg transition-colors mr-1"
          >
            View
          </button>
          <button
            onClick={() => handleReplyClick(inquiry)}
            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
          >
            Reply
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.firstName || 'Admin'}. Here's what's happening today.</p>
        </div>
        
      {/* New inquiry notification */}
      {showRefreshAlert && (
        <div className="mb-6 bg-white border border-orange-200 rounded-xl p-4 shadow-sm animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-full p-2 mr-3">
                <Bell className="h-5 w-5 text-orange-500" />
            </div>
              <div>
                <h3 className="font-medium text-gray-900">New inquiries available!</h3>
                <p className="text-sm text-gray-600">There are {newInquiriesCount} new customer inquiries awaiting your response.</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="ml-4 px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Refresh
            </button>
          </div>
              </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers || 0}
          change="+12.5%"
          icon={<Users className="h-5 w-5" />} 
          color="orange"
          subtext="vs. previous month"
          onClick="/admin/users"
        />
        <StatCard 
          title="Vehicles"
          value={stats.totalCars || 0}
          change="+8.1%"
          icon={<Car className="h-5 w-5" />} 
          color="blue"
          subtext="total inventory"
          onClick="/admin/inventory"
        />
        <StatCard 
          title="Inquiries"
          value={stats.totalInquiries || 0}
          change="+24.3%"
          icon={<MessageSquare className="h-5 w-5" />} 
          color="green"
          subtext="awaiting response"
          onClick="/admin/inquiries"
        />
        <StatCard 
          title="Revenue" 
          value={`KSh ${(stats.totalRevenue || 0).toLocaleString()}`}
          change="+5.4%"
          icon={<DollarSign className="h-5 w-5" />} 
          color="purple"
          subtext="total earnings"
          onClick="/admin/sales"
        />
      </div>
      
      {/* Two column layout for larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <div>
                <h2 className="text-lg font-bold text-gray-900">Sales Progress</h2>
                <p className="text-sm text-gray-600 mt-1">Monthly target vs. actual sales</p>
          </div>
              <div className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg text-sm font-medium">
                {Math.round((currentSales / salesGoal) * 100)}% of goal
          </div>
        </div>
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Current Sales</div>
                <div className="text-sm font-medium text-gray-900">
                  KSh {currentSales.toLocaleString()}
            </div>
            </div>
              <ProgressBar 
                value={currentSales} 
                max={salesGoal} 
              />
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-gray-500">0</div>
                <div className="text-xs text-gray-500">Target: KSh {salesGoal.toLocaleString()}</div>
        </div>
          </div>
        </div>
        
          {/* Recent Inquiries */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
                <p className="text-sm text-gray-600 mt-1">Latest customer messages</p>
              </div>
              <Link href="/admin/inquiries" className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Subject
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentInquiries && stats.recentInquiries.length > 0 ? (
                    stats.recentInquiries.slice(0, 5).map((inquiry) => renderInquiryRow(inquiry))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 md:px-6 py-4 text-center text-sm text-gray-500">
                        {isLoading ? (
                          <div className="flex justify-center">
                            <div className="loader animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-500"></div>
        </div>
                        ) : (
                          "No inquiries found"
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
      </div>
          </div>
          
          {/* Low Stock Vehicles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
                    <div>
                <h2 className="text-lg font-bold text-gray-900">Inventory Status</h2>
                <p className="text-sm text-gray-600 mt-1">Vehicles requiring attention</p>
                    </div>
              <Link href="/admin/inventory" className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center">
                View inventory
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
                  </div>
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Low Stock Alert</h3>
                    <p className="text-sm text-gray-600 mt-1">3 vehicles with only 1 unit left</p>
                    <button className="mt-2 text-xs font-medium text-yellow-600 hover:text-yellow-700">
                      View vehicles
                    </button>
                </div>
              </div>
                </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex">
                  <div className="p-2 bg-red-100 rounded-lg mr-4">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                    <div>
                    <h3 className="font-medium text-gray-900">Expiring Offers</h3>
                    <p className="text-sm text-gray-600 mt-1">5 promotional offers ending soon</p>
                    <button className="mt-2 text-xs font-medium text-red-600 hover:text-red-700">
                      Review offers
                    </button>
                    </div>
                  </div>
                  </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <Tag className="h-6 w-6 text-green-600" />
                </div>
                    <div>
                    <h3 className="font-medium text-gray-900">Popular Vehicles</h3>
                    <p className="text-sm text-gray-600 mt-1">2 vehicles with high inquiry rates</p>
                    <button className="mt-2 text-xs font-medium text-green-600 hover:text-green-700">
                      View analytics
                    </button>
                    </div>
                  </div>
                  </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                    <div>
                    <h3 className="font-medium text-gray-900">Maintenance Due</h3>
                    <p className="text-sm text-gray-600 mt-1">4 vehicles requiring service</p>
                    <button className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700">
                      Schedule service
                    </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar - 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-600 mt-1">Latest actions in the system</p>
            </div>
            <div className="p-4 md:p-6">
              <ActivityItem 
                icon={<User className="h-4 w-4" />}
                title="New user registered"
                description="John Doe created a new account"
                time="2 hours ago"
                type="success"
              />
              <ActivityItem 
                icon={<Eye className="h-4 w-4" />}
                title="New inquiry about BMW X5"
                description="Sarah Johnson requested more details"
                time="5 hours ago"
                type="info"
              />
              <ActivityItem 
                icon={<Car className="h-4 w-4" />}
                title="Inventory updated"
                description="3 new vehicles added to inventory"
                time="Yesterday"
                type="neutral"
              />
              <ActivityItem 
                icon={<Check className="h-4 w-4" />}
                title="Test drive completed"
                description="Michael Smith completed a test drive"
                time="2 days ago"
                type="success"
              />
              <ActivityItem 
                icon={<Reply className="h-4 w-4" />}
                title="Inquiry response sent"
                description="Response sent to Emily Wilson"
                time="3 days ago"
                type="neutral"
              />
            </div>
          </div>
          
          {/* New User Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">New Users</h2>
              <p className="text-sm text-gray-600 mt-1">Recent account registrations</p>
                        </div>
            <div className="p-4 md:p-6 space-y-4">
              {stats.recentUsers && stats.recentUsers.length > 0 ? (
                stats.recentUsers.slice(0, 3).map((user, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white uppercase font-bold text-sm shadow-sm">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
                ))
              ) : (
                <div className="py-4 text-center text-sm text-gray-500">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <div className="loader animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-500"></div>
                            </div>
                  ) : (
                    "No recent users"
                          )}
                        </div>
              )}
                      </div>
                        </div>
          
          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-600 mt-1">Common admin tasks</p>
            </div>
            <div className="p-2">
                      <Link 
                href="/admin/inventory/add" 
                className="flex items-center p-2 hover:bg-orange-50 rounded-lg text-gray-700 hover:text-orange-600 transition-colors"
              >
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <Car className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Add New Vehicle</p>
                  <p className="text-xs text-gray-500">Create a new inventory listing</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
                      </Link>
              
                      <Link 
                href="/admin/users/add" 
                className="flex items-center p-2 hover:bg-orange-50 rounded-lg text-gray-700 hover:text-orange-600 transition-colors"
              >
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <User className="h-4 w-4 text-orange-600" />
        </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Add New User</p>
                  <p className="text-xs text-gray-500">Create user or dealer account</p>
      </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </Link>
              
              <Link 
                href="/admin/reports" 
                className="flex items-center p-2 hover:bg-orange-50 rounded-lg text-gray-700 hover:text-orange-600 transition-colors"
              >
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Generate Report</p>
                  <p className="text-xs text-gray-500">Create sales or inventory report</p>
            </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </Link>
                  </div>
                    </div>
                    </div>
                  </div>
      
      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Reply to Inquiry</h2>
              <p className="text-sm text-gray-600 mt-1">
                Responding to {replyInquiry?.name} about {replyInquiry?.subject}
              </p>
                </div>
            <div className="p-6">
              <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800">{replyInquiry?.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Received on {new Date(replyInquiry?.createdAt).toLocaleDateString()}
                </p>
                </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Response
                </label>
                <textarea 
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent h-32"
                  placeholder="Type your reply here..."
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setReplyModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={sendingReply || !replyMessage.trim()}
                className={`px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors ${
                  (sendingReply || !replyMessage.trim()) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {sendingReply ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 