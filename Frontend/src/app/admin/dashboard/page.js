"use client";
import { useState, useEffect } from 'react';
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
  ChevronRight
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
      case "green": return "from-green-500 to-green-600";
      case "yellow": return "from-yellow-500 to-yellow-600";
      case "orange": return "from-orange-500 to-orange-600";
      case "blue": return "from-blue-500 to-blue-600";
      case "purple": return "from-purple-500 to-purple-600";
      default: return "from-orange-500 to-orange-600";
    }
  };
  
  return (
    <div onClick={onClick} className={`bg-white rounded-xl shadow-sm overflow-hidden transition transform hover:shadow-md ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''}`}>
      <div className="p-6">
        <div className="flex items-center">
          <div className={`rounded-full p-3 bg-gradient-to-br ${getBgColor()} text-white mr-4`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {change && (
                <div className={`ml-2 flex items-center text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {change}
                </div>
              )}
            </div>
            {subtext && <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>}
          </div>
        </div>
      </div>
      {onClick && (
        <div className="bg-gray-50 px-6 py-2 border-t border-gray-100">
          <Link href={typeof onClick === 'string' ? onClick : '#'} className="flex items-center justify-between text-xs font-medium text-orange-500 hover:text-orange-600">
            <span>View details</span>
            <ChevronRight className="h-3 w-3" />
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
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${getBarColor()}`} 
        style={{ width: `${percentage}%` }}
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching dashboard data...');
        // Add retry logic for dashboard stats
        let attempts = 0;
        const maxAttempts = 3;
        let dashboardData;
        
        while (attempts < maxAttempts) {
          try {
            console.log(`Attempt ${attempts + 1} to fetch dashboard stats`);
            dashboardData = await apiService.dashboard.getStats();
            console.log('Dashboard data received:', dashboardData);
            break; // Successfully got data, exit loop
          } catch (statsError) {
            console.error(`Attempt ${attempts + 1} failed:`, statsError);
            attempts++;
            
            if (attempts >= maxAttempts) {
              console.log('Max attempts reached, falling back to alternative data sources');
              throw statsError; // Will be caught by outer try/catch
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        // If dashboard data is successfully fetched
        if (dashboardData && dashboardData.data) {
          console.log('Using dashboard data:', dashboardData.data);
          setStats({
            ...stats,
            totalUsers: dashboardData.data.totalUsers || 0,
            totalCars: dashboardData.data.totalCars || 0,
            totalInquiries: dashboardData.data.totalInquiries || 0,
            recentInquiries: dashboardData.data.recentInquiries || [],
            recentUsers: dashboardData.data.recentUsers || [],
            lowStockCars: dashboardData.data.lowStockCars || []
          });
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
            
          setStats({
            ...stats,
            totalUsers: usersResponse.data?.length || 0,
            totalCars: carsResponse.data?.length || 0,
            totalInquiries: inquiriesResponse.data?.length || 0,
            recentInquiries,
            recentUsers,
            lowStockCars
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later. Error: ' + (err.message || 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate percentage of goal
  const salesPercentage = (currentSales / salesGoal) * 100;

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.firstName}. Here's what's happening today.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </button>
            <button className="px-4 py-2 bg-orange-500 rounded-lg text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        
        {/* Dashboard Alerts */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldCheck className="h-5 w-5 text-orange-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Pro tip</h3>
              <div className="mt-1 text-sm text-orange-700">
                <p>Complete your dealership profile to attract more customers. Your profile is 70% complete. <a href="#" className="font-medium underline hover:text-orange-800">Complete now</a></p>
              </div>
            </div>
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
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Monthly Sales Goal</h2>
            <p className="text-sm text-gray-500">Progress toward this month's target</p>
          </div>
          <div className="mt-2 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              <Tag className="h-3.5 w-3.5 mr-1" />
              Q2 Goal
            </span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-2">
          <div className="text-3xl font-bold text-gray-900">KSh {currentSales.toLocaleString()} <span className="text-sm font-normal text-gray-500">of KSh {salesGoal.toLocaleString()}</span></div>
          <div className="mt-2 md:mt-0 text-sm text-gray-500">{Math.round(salesPercentage)}% to goal</div>
        </div>
        
        <ProgressBar value={currentSales} max={salesGoal} color="orange" />
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.salesByMonth.map((month, index) => (
            <div key={month.month} className="flex items-center">
              <div className="w-2 h-8 bg-orange-500 rounded-sm mr-2" style={{
                opacity: 0.4 + (index / stats.salesByMonth.length) * 0.6
              }}></div>
              <div>
                <div className="text-sm font-medium text-gray-700">{month.month}</div>
                <div className="text-xs text-gray-500">KSh {month.amount.toLocaleString()}</div>
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
          
          <div className="space-y-0">
            <ActivityItem 
              icon={<Users className="h-4 w-4" />}
              title="New User Registered"
              description="James Wilson created an account"
              time="10 minutes ago"
              type="success"
            />
            <ActivityItem 
              icon={<MessageSquare className="h-4 w-4" />}
              title="New Inquiry"
              description="Sarah Johnson is interested in BMW X5"
              time="1 hour ago"
              type="info"
            />
            <ActivityItem 
              icon={<Car className="h-4 w-4" />}
              title="Vehicle Sold"
              description="Audi A4 2022 has been sold for KSh 38,500"
              time="3 hours ago"
              type="success"
            />
            <ActivityItem 
              icon={<Clock className="h-4 w-4" />}
              title="Test Drive Scheduled"
              description="Michael Brown - Tesla Model Y at 2:00 PM"
              time="5 hours ago"
              type="neutral"
            />
            <ActivityItem 
              icon={<AlertTriangle className="h-4 w-4" />}
              title="Low Stock Alert"
              description="Honda Civic 2023 - Only 1 unit left"
              time="1 day ago"
              type="warning"
            />
          </div>
        </div>
        
        {/* Recent Inquiries */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center">
              <span>View all</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentInquiries.length > 0 ? (
                  stats.recentInquiries.map((inquiry) => (
                    <tr key={inquiry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center uppercase text-gray-600 font-medium">
                            {inquiry.name?.[0]}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                            <div className="text-xs text-gray-500">{inquiry.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{inquiry.vehicle || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inquiry.status === 'new' 
                            ? 'bg-blue-100 text-blue-800' 
                            : inquiry.status === 'inProgress' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {inquiry.status === 'new' 
                            ? <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1"></span>
                            : inquiry.status === 'inProgress'
                            ? <Clock className="h-3 w-3 mr-1" />
                            : <Check className="h-3 w-3 mr-1" />
                          }
                          {inquiry.status === 'new' 
                            ? 'New' 
                            : inquiry.status === 'inProgress' 
                            ? 'In Progress' 
                            : 'Resolved'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/inquiries/${inquiry._id}`} className="text-sm text-orange-500 hover:text-orange-600 font-medium">View</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No recent inquiries
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
    </div>
  );
} 