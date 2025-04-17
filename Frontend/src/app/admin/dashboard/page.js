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
  Reply
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
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
          : [];
          
        // Extract the recent users (last 5)
        const recentUsers = usersResponse.data
          ? usersResponse.data
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, <span className="font-semibold text-gray-800">{user?.firstName}</span>. Here's your business overview.</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap sm:flex-nowrap gap-3">
            <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 flex items-center">
              <Calendar className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <button className="px-4 py-2 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors shadow-sm flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
        
        {/* Today's Highlights */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-md mb-8 overflow-hidden">
          <div className="p-6 text-white">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Today's Highlights</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center mb-3">
                  <Users className="h-4 w-4 text-white/80 mr-2" />
                  <p className="text-xs font-medium text-white/80">New Users</p>
              </div>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-xs text-white/70 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+3 from yesterday</span>
                </p>
            </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center mb-3">
                  <MessageSquare className="h-4 w-4 text-white/80 mr-2" />
                  <p className="text-xs font-medium text-white/80">New Inquiries</p>
          </div>
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-xs text-white/70 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+2 from yesterday</span>
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center mb-3">
                  <DollarSign className="h-4 w-4 text-white/80 mr-2" />
                  <p className="text-xs font-medium text-white/80">Today's Sales</p>
                </div>
                <p className="text-2xl font-bold text-white">KSh 580K</p>
                <p className="text-xs text-white/70 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+120K from yesterday</span>
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center mb-3">
                  <Car className="h-4 w-4 text-white/80 mr-2" />
                  <p className="text-xs font-medium text-white/80">Test Drives</p>
                </div>
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-xs text-white/70 mt-1 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>-1 from yesterday</span>
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-white/10 to-white/5 px-6 py-3 border-t border-white/20">
            <p className="text-xs text-white/80">
              Last updated: <span className="font-medium">Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          change="+12% from last month"
          icon={<Users className="h-5 w-5" />} 
          color="blue"
          onClick="/admin/users"
        />
        <StatCard 
          title="Vehicles in Stock" 
          value={stats.totalCars} 
          change="-3% from last month"
          trend="down"
          icon={<Car className="h-5 w-5" />} 
          color="green"
          onClick="/admin/inventory"
        />
        <StatCard 
          title="Active Inquiries" 
          value={stats.totalInquiries} 
          change="+18% from last month"
          icon={<MessageSquare className="h-5 w-5" />} 
          color="yellow"
          onClick="/admin/inquiries"
        />
        <StatCard 
          title="Revenue" 
          value={`KSh ${currentSales.toLocaleString()}`} 
          change="+8% from last month"
          icon={<DollarSign className="h-5 w-5" />} 
          color="orange"
          onClick="/admin/finance"
        />
      </div>
      
      {/* Sales Goal */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Monthly Sales Goal</h2>
            <p className="text-sm text-gray-500">Progress toward this month's target</p>
          </div>
          <div className="mt-3 md:mt-0">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800 shadow-sm">
              <Tag className="h-3.5 w-3.5 mr-1.5" />
              Q2 Goal
            </span>
          </div>
        </div>
        
        <div className="mb-4 bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Current sales</div>
              <div className="text-3xl font-bold text-gray-900">KSh {currentSales.toLocaleString()}</div>
            </div>
            <div className="mt-4 md:mt-0 md:text-right">
              <div className="text-sm text-gray-500 mb-1">Target</div>
              <div className="text-xl font-semibold text-gray-700">KSh {salesGoal.toLocaleString()}</div>
            </div>
        </div>
        
          <div className="mt-4">
            <div className="flex justify-between mb-1.5">
              <div className="text-xs font-medium text-gray-500">Progress</div>
              <div className="text-xs font-semibold text-orange-600">{Math.round(salesPercentage)}%</div>
            </div>
        <ProgressBar value={currentSales} max={salesGoal} color="orange" />
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {stats.salesByMonth.map((month, index) => (
            <div key={month.month} className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-sm font-medium text-gray-700 mb-1">{month.month}</div>
              <div className="text-lg font-semibold text-gray-900">KSh {month.amount.toLocaleString()}</div>
              <div className="mt-2 bg-gray-200 h-1 w-full rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full" 
                  style={{
                    width: `${(month.amount / Math.max(...stats.salesByMonth.map(m => m.amount))) * 100}%`,
                    opacity: 0.6 + (index / stats.salesByMonth.length) * 0.4
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Activity and Recent Items */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="xl:col-span-1 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center">
              <span>View all</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>
            <div className="space-y-5 relative">
              <div className="pl-8 relative">
                <div className="absolute left-0 p-1.5 rounded-full bg-green-500 shadow-sm z-10">
                  <Users className="h-3 w-3 text-white" />
                </div>
                <div className="rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">New User Registration</p>
                      <p className="text-xs text-gray-600 mt-0.5">James Wilson created an account</p>
                    </div>
                    <span className="text-[10px] font-medium bg-green-50 text-green-700 px-1.5 py-0.5 rounded">new</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                    <p className="text-xs text-gray-400">10 minutes ago</p>
                    <button className="text-xs font-medium text-blue-500 hover:text-blue-600">View Profile</button>
                  </div>
                </div>
              </div>
              
              <div className="pl-8 relative">
                <div className="absolute left-0 p-1.5 rounded-full bg-blue-500 shadow-sm z-10">
                  <MessageSquare className="h-3 w-3 text-white" />
                </div>
                <div className="rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">New Inquiry Received</p>
                      <p className="text-xs text-gray-600 mt-0.5">Sarah Johnson is interested in BMW X5</p>
                    </div>
                    <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">info</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                    <p className="text-xs text-gray-400">1 hour ago</p>
                    <button className="text-xs font-medium text-blue-500 hover:text-blue-600">View Inquiry</button>
                  </div>
                </div>
              </div>
              
              <div className="pl-8 relative">
                <div className="absolute left-0 p-1.5 rounded-full bg-green-500 shadow-sm z-10">
                  <Car className="h-3 w-3 text-white" />
                </div>
                <div className="rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Vehicle Sold</p>
                      <p className="text-xs text-gray-600 mt-0.5">Audi A4 2022 has been sold for KSh 3.85M</p>
                    </div>
                    <span className="text-[10px] font-medium bg-green-50 text-green-700 px-1.5 py-0.5 rounded">success</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                    <p className="text-xs text-gray-400">3 hours ago</p>
                    <button className="text-xs font-medium text-blue-500 hover:text-blue-600">View Details</button>
                  </div>
                </div>
              </div>
              
              <div className="pl-8 relative">
                <div className="absolute left-0 p-1.5 rounded-full bg-yellow-500 shadow-sm z-10">
                  <AlertTriangle className="h-3 w-3 text-white" />
                </div>
                <div className="rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Low Stock Alert</p>
                      <p className="text-xs text-gray-600 mt-0.5">Honda Civic 2023 - Only 1 unit left</p>
                    </div>
                    <span className="text-[10px] font-medium bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded">warning</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                    <p className="text-xs text-gray-400">1 day ago</p>
                    <button className="text-xs font-medium text-blue-500 hover:text-blue-600">Update Stock</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Inquiries */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
              {newInquiriesCount > 0 && (
                <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {newInquiriesCount} new
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => fetchDashboardData(true)}
                className="flex items-center text-sm font-medium text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <Link href="/admin/inquiries" className="text-sm text-gray-500 hover:text-gray-600 font-medium flex items-center hover:underline">
              <span>View all</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Customer</th>
                  <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Vehicle</th>
                  <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Status</th>
                  <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Date</th>
                  <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right w-1/6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentInquiries.length > 0 ? (
                  stats.recentInquiries.map((inquiry) => renderInquiryRow(inquiry))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-3 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-3 rounded-full bg-gray-100 mb-3">
                          <MessageSquare className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">No recent inquiries</p>
                        <p className="text-xs text-gray-400">New inquiries will appear here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Low Stock Vehicles */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Low Stock Vehicles</h2>
          <Link href="/admin/inventory" className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center">
            <span>View inventory</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.lowStockCars.length > 0 ? (
                stats.lowStockCars.map((car) => (
                  <tr key={car._id} className="hover:bg-gray-50 transition-colors">
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
                      <div className={`text-sm font-medium ${car.stock === 0 ? 'text-red-600' : car.stock < 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {car.stock} {car.stock === 1 ? 'unit' : 'units'}
                      </div>
                      {car.stock < 2 && (
                        <div className="text-xs text-orange-500 font-medium mt-1">
                          Reorder needed
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        KSh {car.price.toLocaleString()}
                      </div>
                      {car.msrp && car.msrp > car.price && (
                        <div className="text-xs text-gray-500 line-through">
                          MSRP: KSh {car.msrp.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        car.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : car.status === 'sold' 
                          ? 'bg-gray-100 text-gray-800' 
                          : car.status === 'reserved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link 
                        href={`/admin/inventory/edit/${car._id}`}
                        className="text-sm font-medium text-orange-500 hover:text-orange-600 mr-4"
                      >
                        Edit
                      </Link>
                      <Link 
                        href={`/admin/inventory/update-stock/${car._id}`}
                        className="text-sm font-medium text-blue-500 hover:text-blue-600"
                      >
                        Update Stock
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No low stock vehicles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Reply Modal */}
      {replyModalOpen && replyInquiry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Reply to Inquiry</h3>
                <button 
                  onClick={() => {
                    setReplyModalOpen(false);
                    setReplyInquiry(null);
                    setReplyMessage('');
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {replyInquiry.name} <span className="text-gray-500 font-normal">({replyInquiry.email})</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(replyInquiry.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1 text-blue-700">Original Message:</div>
                  <p>{replyInquiry.message}</p>
                </div>
                <div className="mt-3 text-sm">
                  <div className="font-medium text-gray-700">Interested in: <span className="text-blue-600">{replyInquiry.vehicle || 'Not specified'}</span></div>
                </div>
              </div>
              
              <div>
                <label htmlFor="reply-message" className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                <textarea 
                  id="reply-message"
                  rows={6}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Type your response here..."
                ></textarea>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => {
                  setReplyModalOpen(false);
                  setReplyInquiry(null);
                  setReplyMessage('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg mr-3"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyMessage.trim() || sendingReply}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center ${
                  replyMessage.trim() && !sendingReply
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'bg-orange-300 cursor-not-allowed'
                }`}
              >
                {sendingReply ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Reply'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 