"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/utils/AuthContext';
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
  User
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
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
      name: 'Users', 
      path: '/admin/users', 
      icon: <Users className="h-5 w-5" />,
      active: isActivePath('/admin/users')
    },
    { 
      name: 'Inventory', 
      path: '/admin/inventory', 
      icon: <Car className="h-5 w-5" />,
      active: isActivePath('/admin/inventory')
    },
    { 
      name: 'Inquiries', 
      path: '/admin/inquiries', 
      icon: <MessageSquare className="h-5 w-5" />,
      active: isActivePath('/admin/inquiries')
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings className="h-5 w-5" />,
      active: isActivePath('/admin/settings')
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md text-gray-700 hover:text-orange-500 transition-colors"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
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
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow py-6 px-4">
          <div className="mb-8">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h3>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500 pr-3' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className={`mr-3 ${item.active ? 'text-orange-500' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="px-3 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Insights</h3>
          </div>
          <nav className="space-y-1 mb-8">
            <Link
              href="/admin/analytics"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActivePath('/admin/analytics') 
                  ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500 pr-3' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className={`mr-3 ${isActivePath('/admin/analytics') ? 'text-orange-500' : 'text-gray-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M18.4 15.2c-.4.4-.8.8-1.2 1.2L13 10l-5 5-3-3" />
                  <path d="M18.4 9.2c1.1 1.1 1.2 2.2 1.2 3.2" />
                  <path d="M16.5 7.5c.7.7 1.1 1.5 1.3 2.3" />
                  <path d="M13 7c1.3 0 2.6.5 3.5 1.5" />
                </svg>
              </span>
              Analytics
            </Link>
            <Link
              href="/admin/reports"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActivePath('/admin/reports') 
                  ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500 pr-3' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className={`mr-3 ${isActivePath('/admin/reports') ? 'text-orange-500' : 'text-gray-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </span>
              Reports
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white uppercase font-bold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-1 rounded-md text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-colors"
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
        <header className="z-10 bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6">
          <div className="flex-1 flex items-center">
            <div className="relative flex-1 max-w-xl mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500"></span>
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium text-gray-800">New user registered</p>
                      <p className="text-xs text-gray-500 mt-1">John Doe created an account</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium text-gray-800">New inquiry received</p>
                      <p className="text-xs text-gray-500 mt-1">Jane Smith is interested in BMW X5</p>
                      <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
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
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-orange-500 transition-colors focus:outline-none"
              >
                <span className="font-medium hidden md:block">{user.firstName}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <Link 
                      href="/admin/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Your Profile
                    </Link>
                    <Link 
                      href="/admin/settings" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2 text-gray-500" />
                      Settings
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
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">© 2024 MyRide. All rights reserved.</p>
            <div className="text-sm text-gray-500">
              <span>Admin Panel v1.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}