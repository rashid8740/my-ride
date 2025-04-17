"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/utils/AuthContext';
import apiService from '@/utils/api';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  User,
  Heart
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [newInquiryCount, setNewInquiryCount] = useState(0);
  const [inquiryLoading, setInquiryLoading] = useState(true);
  
  // Fetch the new inquiry count
  useEffect(() => {
    const fetchInquiryCount = async () => {
      try {
        setInquiryLoading(true);
        const response = await apiService.contact.getAll();
        const newInquiries = response.data.filter(inq => inq.status === 'new');
        setNewInquiryCount(newInquiries.length);
      } catch (err) {
        console.error('Error fetching inquiry count:', err);
      } finally {
        setInquiryLoading(false);
      }
    };
    
    // Only fetch if the user is authenticated and an admin
    if (user && isAdmin && !isLoading) {
      fetchInquiryCount();
    }
  }, [user, isAdmin, isLoading]);

  // Check if user is logged in and has admin role
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/login?redirect=/admin/dashboard&message=You must be an admin to access this page');
    }
  }, [user, isAdmin, isLoading, router]);
  
  // If still loading or not authenticated, show loading state
  if (isLoading || !user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="flex flex-col items-center">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Check if a path is active (exact match or subpath)
  const isActivePath = (path) => {
    if (path === '/admin/dashboard') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Nav items for sidebar
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: isActivePath('/admin/dashboard')
    },
    { 
      name: 'Inventory', 
      path: '/admin/inventory', 
      icon: <Car className="h-5 w-5" />,
      active: isActivePath('/admin/inventory')
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: <Users className="h-5 w-5" />,
      active: isActivePath('/admin/users')
    },
    { 
      name: 'Inquiries', 
      path: '/admin/inquiries', 
      icon: <MessageSquare className="h-5 w-5" />,
      active: isActivePath('/admin/inquiries')
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white shadow-md text-gray-700 hover:text-orange-500 transition-colors"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm z-20 md:hidden" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-30 transition duration-300 ease-in-out flex flex-col w-72 bg-white border-r border-gray-200 shadow-xl`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-orange-500">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-white">MyRide Admin</span>
          </Link>
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-1 rounded-md text-white hover:bg-orange-400 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow py-6">
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main</p>
          </div>
          <nav className="space-y-1 px-3 mb-6">
            {navItems.slice(0, 2).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  item.active 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <span className={`mr-3 ${item.active ? 'text-white' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </div>
                {item.name === 'Inventory' && (
                  <span className="bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customers</p>
          </div>
          <nav className="space-y-1 px-3">
            {navItems.slice(2).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  item.active 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <span className={`mr-3 ${item.active ? 'text-white' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </div>
                {item.name === 'Inquiries' && newInquiryCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                    {inquiryLoading ? 
                      <span className="h-2 w-2 bg-red-600 rounded-full animate-pulse"></span> 
                      : newInquiryCount
                    }
                  </span>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="px-4 py-2 mt-8 mx-3 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100">
            <h3 className="text-sm font-medium text-orange-800 mb-2">Need Help?</h3>
            <p className="text-xs text-gray-600 mb-3">Access tutorials and documentation to get the most out of your admin dashboard.</p>
            <Link href="/admin/help" className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center">
              View help center
              <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white uppercase font-bold shadow-sm">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-orange-500 transition-all"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
        {/* Top header */}
        <header className="z-10 bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-4 md:px-6">
          <div className="flex-1 flex items-center">
            <div className="relative flex-1 max-w-xl mr-2 md:mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50 text-gray-900"
              />
            </div>
            
            <div className="hidden md:flex space-x-2">
              <Link 
                href="/admin/inventory/add"
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                <Car className="h-4 w-4 mr-1.5" />
                Add Vehicle
              </Link>
              <Link 
                href="/admin/users/add"
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <User className="h-4 w-4 mr-1.5" />
                Add User
              </Link>
            </div>
            
            {/* Mobile quick actions */}
            <div className="flex md:hidden">
              <Link 
                href="/admin/inventory/add"
                className="p-2 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors"
                aria-label="Add Vehicle"
              >
                <Car className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-all relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <div className="flex">
                        <div className="mr-3 mt-0.5">
                          <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                            <User className="h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">New user registered</p>
                          <p className="text-xs text-gray-500 mt-1">John Doe created an account</p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <div className="flex">
                        <div className="mr-3 mt-0.5">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">New inquiry received</p>
                          <p className="text-xs text-gray-500 mt-1">Jane Smith is interested in BMW X5</p>
                          <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-t border-gray-200 text-center">
                    <a href="#" className="text-xs text-orange-500 hover:text-orange-600 font-medium">View all notifications</a>
                  </div>
                </div>
              )}
            </div>
            
            {/* User dropdown */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 py-1.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-all focus:outline-none"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white uppercase font-bold text-xs shadow-sm">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <span className="font-medium hidden md:block">{user.firstName}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-sm font-semibold text-gray-800">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                  </div>
                  <div className="py-1">
                    <Link 
                      href="/favorites" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Heart className="h-4 w-4 mr-2 text-gray-500" />
                      My Favorites
                    </Link>
                    <Link 
                      href="/admin/test-drives" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Car className="h-4 w-4 mr-2 text-gray-500" />
                      Test Drives
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-3 px-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">© 2024 MyRide Kenya. All rights reserved.</p>
            <div className="text-xs text-gray-400 flex items-center">
              <span className="mr-1">Admin Dashboard</span>
              <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-[10px] font-medium">v1.2</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}