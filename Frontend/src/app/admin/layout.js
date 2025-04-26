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
        } md:translate-x-0 z-30 transition duration-300 ease-in-out flex flex-col w-64 md:w-72 bg-white border-r border-gray-200 shadow-xl`}
      >
        <div className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-orange-500">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-lg md:text-xl font-bold text-white">MyRide Admin</span>
          </Link>
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-1 rounded-md text-white hover:bg-orange-400 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow py-4 md:py-6">
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main</p>
          </div>
          <nav className="space-y-1 px-3 mb-6">
            {navItems.slice(0, 2).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 text-sm font-medium rounded-xl transition-all ${
                  item.active 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <span className={`mr-2.5 md:mr-3 ${item.active ? 'text-white' : 'text-gray-500'}`}>
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
                className={`flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 text-sm font-medium rounded-xl transition-all ${
                  item.active 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <span className={`mr-2.5 md:mr-3 ${item.active ? 'text-white' : 'text-gray-500'}`}>
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
          
          <div className="px-4 py-2 mt-6 md:mt-8 mx-3 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100">
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
        
        <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 md:h-11 md:w-11 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white uppercase font-bold shadow-sm">
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
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-72">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex-1 flex items-center">
            {!isSidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="mr-4 p-1.5 rounded-lg text-gray-600 hover:text-orange-500 transition-colors md:hidden flex items-center justify-center"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-800 bg-gray-50"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications dropdown */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)} 
                className="ml-2 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-orange-500 transition-colors relative flex items-center justify-center"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {newInquiryCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
              
              {/* Notifications panel */}
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-96 rounded-xl shadow-lg z-30">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                      <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {newInquiryCount > 0 ? (
                        <div className="py-2 px-4">
                          <div className="flex items-start py-3">
                            <div className="flex-shrink-0 bg-orange-100 rounded-full p-2">
                              <MessageSquare className="h-4 w-4 text-orange-600" />
                            </div>
                            <div className="ml-3">
                              <p className="text-xs font-medium text-gray-900">New inquiry received</p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                You have {newInquiryCount} new inquiries awaiting response.
                              </p>
                              <Link 
                                href="/admin/inquiries" 
                                className="text-xs text-orange-600 hover:text-orange-700 mt-1 inline-block"
                              >
                                View inquiries
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 px-4 text-center">
                          <p className="text-sm text-gray-500">No new notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-gray-50 border-t border-gray-200">
                      <Link 
                        href="/admin/notifications" 
                        className="block text-xs text-center text-gray-600 hover:text-gray-900 font-medium p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* User dropdown */}
            <div className="relative inline-block">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-lg py-1.5 px-2.5 border border-transparent hover:border-gray-200 transition-all"
                aria-label="User menu"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white uppercase font-bold shadow-sm text-xs">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <span className="hidden md:block text-xs text-gray-700 font-medium">{user.firstName}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg z-30">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link 
                        href="/admin/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                      >
                        <User className="h-4 w-4 mr-3 text-gray-500" />
                        Profile
                      </Link>
                      <Link 
                        href="/admin/settings" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                      >
                        <Settings className="h-4 w-4 mr-3 text-gray-500" />
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-red-500" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}