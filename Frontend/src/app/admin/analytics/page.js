"use client";
import { useState, useEffect } from 'react';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Calendar, 
  TrendingUp, 
  Users, 
  Car, 
  MessageSquare,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Loader
} from 'lucide-react';
import apiService from '@/utils/api';

// Simple chart component implementations (in a real app, you'd use a library like Chart.js or Recharts)
const SimpleBarChart = ({ data, height = 200 }) => {
  if (!data || !data.length) return <div className="flex items-center justify-center h-full">No data available</div>;

  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between h-full" style={{ height }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        return (
          <div key={index} className="flex flex-col items-center w-full">
            <div className="relative w-full px-1">
              <div 
                className="bg-orange-500 rounded-t-sm w-full" 
                style={{ height: `${barHeight}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2 truncate">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const SimpleLineChart = ({ data, height = 200 }) => {
  if (!data || !data.length) return <div className="flex items-center justify-center h-full">No data available</div>;

  // Points for line drawing
  const points = [];
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  data.forEach((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    // Normalize between 10% and 90% height to ensure visibility
    const y = 90 - (((item.value - minValue) / (range || 1)) * 80);
    points.push([x, y]);
  });
  
  // Create SVG path
  let pathD = '';
  points.forEach((point, index) => {
    if (index === 0) {
      pathD += `M${point[0]},${point[1]}`;
    } else {
      pathD += ` L${point[0]},${point[1]}`;
    }
  });
  
  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={pathD}
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
        />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point[0]}
            cy={point[1]}
            r="1.5"
            fill="#f97316"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-gray-600 truncate px-1 text-center">{item.label}</div>
        ))}
      </div>
    </div>
  );
};

const SimplePieChart = ({ data, height = 200 }) => {
  if (!data || !data.length) return <div className="flex items-center justify-center h-full">No data available</div>;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  const segments = data.map((item, index) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return {
      ...item,
      startAngle,
      endAngle: currentAngle,
      color: getColorForIndex(index),
    };
  });
  
  function getColorForIndex(index) {
    const colors = ['#f97316', '#84cc16', '#3b82f6', '#a855f7', '#ec4899'];
    return colors[index % colors.length];
  }
  
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  
  function arcPath(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", x, y,
      "Z"
    ].join(" ");
  }
  
  return (
    <div className="w-full flex items-center justify-center" style={{ height }}>
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 150, height: 150 }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {segments.map((segment, index) => (
              <path 
                key={index}
                d={arcPath(50, 50, 40, segment.startAngle, segment.endAngle)}
                fill={segment.color}
              />
            ))}
          </svg>
        </div>
        <div className="flex flex-wrap justify-center mt-4 max-w-xs">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center mr-4 mb-2">
              <div className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: segment.color }}></div>
              <span className="text-xs text-gray-600">{segment.label} ({Math.round((segment.value / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [statsData, setStatsData] = useState({
    totalSales: 0,
    totalUsers: 0,
    totalInquiries: 0,
    completedSales: 0
  });
  
  const [chartData, setChartData] = useState({
    salesByMonth: [],
    usersByType: [],
    inquiriesByStatus: [],
    carsByMake: []
  });
  
  const [timeframe, setTimeframe] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);
  
  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, the timeframe would be passed to the API
      // const response = await apiService.dashboard.getAnalytics(timeframe);
      // For demo purposes, we'll use mock data
      
      // Give it a slight delay to simulate API call
      setTimeout(() => {
        // Mock data
        const mockSalesData = [
          { label: 'Jan', value: 42000 },
          { label: 'Feb', value: 53000 },
          { label: 'Mar', value: 76000 },
          { label: 'Apr', value: 70000 },
          { label: 'May', value: 59000 },
          { label: 'Jun', value: 86000 },
          { label: 'Jul', value: 95000 },
        ];
        
        const mockUserTypes = [
          { label: 'Standard', value: 120 },
          { label: 'Premium', value: 45 },
          { label: 'Admin', value: 7 },
        ];
        
        const mockInquiryStatus = [
          { label: 'New', value: 34 },
          { label: 'In Progress', value: 25 },
          { label: 'Completed', value: 48 },
          { label: 'Cancelled', value: 12 },
        ];
        
        const mockCarsByMake = [
          { label: 'Toyota', value: 28 },
          { label: 'Honda', value: 22 },
          { label: 'Ford', value: 19 },
          { label: 'BMW', value: 14 },
          { label: 'Mercedes', value: 11 },
          { label: 'Others', value: 25 },
        ];
        
        setChartData({
          salesByMonth: mockSalesData,
          usersByType: mockUserTypes,
          inquiriesByStatus: mockInquiryStatus,
          carsByMake: mockCarsByMake,
        });
        
        setStatsData({
          totalSales: 481000,
          totalUsers: 172,
          totalInquiries: 119,
          totalInventory: 89
        });
        
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data. Please try again later.");
      setIsLoading(false);
    }
  };
  
  const refreshData = () => {
    fetchAnalyticsData();
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart className="mr-2 h-6 w-6 text-orange-500" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Visualize and analyze key business metrics</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          
          <button
            onClick={refreshData}
            className="p-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            title="Refresh data"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${statsData.totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <div className="flex items-center text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>12% increase</span>
            </div>
            <span className="text-gray-500 ml-2">from last period</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statsData.totalUsers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <div className="flex items-center text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8% increase</span>
            </div>
            <span className="text-gray-500 ml-2">from last period</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inquiries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statsData.totalInquiries}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <div className="flex items-center text-red-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>3% decrease</span>
            </div>
            <span className="text-gray-500 ml-2">from last period</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statsData.totalInventory}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Car className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <div className="flex items-center text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>5% increase</span>
            </div>
            <span className="text-gray-500 ml-2">from last period</span>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-gray-500" />
              Sales Trend
            </h2>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              {error}
            </div>
          ) : (
            <div className="h-64">
              <SimpleLineChart data={chartData.salesByMonth} height={200} />
            </div>
          )}
        </div>
        
        {/* User Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="mr-2 h-5 w-5 text-gray-500" />
              User Distribution
            </h2>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              {error}
            </div>
          ) : (
            <div className="h-64">
              <SimplePieChart data={chartData.usersByType} height={250} />
            </div>
          )}
        </div>
        
        {/* Inquiry Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-gray-500" />
              Inquiry Status
            </h2>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              {error}
            </div>
          ) : (
            <div className="h-64">
              <SimpleBarChart data={chartData.inquiriesByStatus} height={200} />
            </div>
          )}
        </div>
        
        {/* Inventory by Make */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Car className="mr-2 h-5 w-5 text-gray-500" />
              Inventory by Make
            </h2>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              {error}
            </div>
          ) : (
            <div className="h-64">
              <SimpleBarChart data={chartData.carsByMake} height={200} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 