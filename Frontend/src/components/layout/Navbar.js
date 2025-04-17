// src/components/layout/Navbar.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/utils/AuthContext";
import { useFavorites } from "@/utils/FavoritesContext";
import {
  Search,
  Heart,
  User,
  Car,
  Menu,
  X,
  ChevronDown,
  Phone,
  LogOut,
  Trash2,
  LayoutDashboard,
} from "lucide-react";

// Navigation Item Component with dropdown capability
function NavItem({ href, label, children = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  // Handle smooth scrolling for anchor links
  const handleClick = (e) => {
    const href = e.currentTarget.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={href}
        className={`text-sm font-medium py-5 px-4 inline-flex items-center transition-colors ${
          isActive
            ? "text-orange-500 border-b-2 border-orange-500 font-semibold"
            : "text-gray-800 hover:text-orange-500 hover:border-b-2 hover:border-orange-500/20"
        }`}
        onClick={handleClick}
      >
        {label}
        {children && (
          <ChevronDown
            size={14}
            className="ml-1.5 text-gray-500 group-hover:text-orange-500"
          />
        )}
      </Link>

      {children && isOpen && (
        <div className="absolute left-0 mt-0 w-52 bg-white border border-gray-200 rounded-b-lg shadow-lg z-20 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}

// Dropdown Menu Item Component
function DropdownItem({ href, label }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-4 py-2.5 text-sm ${
        isActive
          ? "bg-orange-50 text-orange-500 font-medium"
          : "text-gray-800 hover:bg-gray-50 hover:text-orange-500"
      } transition-colors border-b border-gray-100 last:border-0`}
    >
      {label}
    </Link>
  );
}

// Mobile Navigation Item Component
function MobileNavItem({ href, label, icon = null, onClick, children = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive =
    href && (pathname === href || (href !== "/" && pathname?.startsWith(href)));

  // Handle smooth scrolling for anchor links
  const handleClick = (e) => {
    if (children) {
      e.preventDefault();
      setIsOpen(!isOpen);
      return;
    }

    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    // Close mobile menu after clicking (only if no children)
    if (onClick && !children) onClick();
  };

  return (
    <div>
      <Link
        href={href || "#"}
        className={`block py-3 text-base font-medium ${
          isActive ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
        } flex items-center justify-between transition-colors`}
        onClick={handleClick}
      >
        <div className="flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          {label}
        </div>
        {children && (
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </Link>

      {children && isOpen && (
        <div className="pl-5 border-l border-gray-100 ml-2 mt-1 mb-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { favorites } = useFavorites();
  
  // Calculate favorites count, ensuring it doesn't disappear
  const [favoritesCount, setFavoritesCount] = useState(0);
  
  // Update favorites count whenever favorites changes
  useEffect(() => {
    if (favorites && favorites.length > 0) {
      setFavoritesCount(favorites.length);
    }
  }, [favorites]);

  // Handle scroll event for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when viewport size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Close menu function
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed w-full top-0 left-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? "shadow-md" : "border-b border-gray-200"
      }`}
    >
      {/* Top Bar with contact info - desktop only */}
      <div className="hidden lg:block bg-gray-900 text-white">
        <div className="container mx-auto px-4 lg:px-8 h-10 flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <Phone size={14} className="mr-2 text-orange-400" />
              <span>+1-800-AUTO-CAR</span>
            </div>
            <span className="text-gray-400">|</span>
            <span>Open: Mon-Fri 9am - 7pm</span>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <Link
              href="/dealerships"
              className="text-gray-300 hover:text-white"
            >
              Dealerships
            </Link>
            <Link href="/careers" className="text-gray-300 hover:text-white">
              Careers
            </Link>
            <Link href="/help" className="text-gray-300 hover:text-white">
              Help Center
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between h-16 sm:h-20 lg:h-[70px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-block">
              <div className="flex items-center">
                <Image
                  src="/images/logo-2.png"
                  alt="AutoDecar"
                  width={180}
                  height={40}
                  className="h-8 sm:h-10 w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Main Navigation - Desktop */}
          <div className="hidden lg:flex items-center">
            <div className="flex">
              <NavItem href="/" label="Home" />

              <NavItem href="/inventory" label="Inventory">
                <DropdownItem href="/inventory/suv" label="SUVs" />
                <DropdownItem href="/inventory/sedan" label="Sedans" />
                <DropdownItem href="/inventory/luxury" label="Luxury" />
                <DropdownItem href="/inventory/electric" label="Electric" />
                <DropdownItem href="/inventory/hybrid" label="Hybrid" />
              </NavItem>

              <NavItem href="/services" label="Services">
                <DropdownItem href="/services/financing" label="Financing" />
                <DropdownItem href="/services/insurance" label="Insurance" />
                <DropdownItem
                  href="/services/maintenance"
                  label="Maintenance"
                />
              </NavItem>

              <NavItem href="/about" label="About" />
              <NavItem href="/contact" label="Contact" />
            </div>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/inventory"
              className="py-2 px-3 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"
              aria-label="Search inventory"
              >
                <Search size={20} />
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/favorites"
                  className="py-2 px-3 hover:bg-gray-100 rounded-md text-gray-700 transition-colors relative"
                  aria-label="Favorites"
                >
                  <Heart size={20} />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                      {favoritesCount > 99 ? "99+" : favoritesCount}
                    </span>
                  )}
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"
                  >
                    <User size={20} />
                    <span className="ml-2">{user?.firstName || 'Account'}</span>
                    <ChevronDown size={14} className="ml-1" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.fullName || `${user?.firstName} ${user?.lastName}`}</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                        {isAdmin && (
                          <p className="text-xs font-bold text-orange-600 mt-2 bg-orange-100 inline-block px-2.5 py-1 rounded-md shadow-sm border border-orange-200">Admin User</p>
                        )}
                      </div>
                      <Link
                        href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-500 flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} className="mr-2 text-gray-500" />
                        Dashboard
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-500 flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Heart size={16} className="mr-2 text-gray-500" />
                        My Favorites
                      </Link>
                      <Link
                        href="/test-drives"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-500 flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Car size={16} className="mr-2 text-gray-500" />
                        Test Drives
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="py-2 px-4 text-sm font-medium rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                  Login / Register
              </Link>
            )}
            </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300">
          <div className="container mx-auto px-4 py-3">
            <div className="space-y-1">
              <MobileNavItem
                href="/"
                label="Home"
                onClick={closeMobileMenu}
              />

              {/* Inventory dropdown */}
              <MobileNavItem href="/inventory" label="Inventory">
                <MobileNavItem
                  href="/inventory/suv"
                  label="SUVs"
                  onClick={closeMobileMenu}
                />
                <MobileNavItem
                  href="/inventory/sedan"
                  label="Sedans"
                  onClick={closeMobileMenu}
                />
                <MobileNavItem
                  href="/inventory/luxury"
                  label="Luxury"
                  onClick={closeMobileMenu}
                />
                <MobileNavItem
                  href="/inventory/electric"
                  label="Electric"
                  onClick={closeMobileMenu}
                />
                <MobileNavItem
                  href="/inventory/hybrid"
                  label="Hybrid"
                  onClick={closeMobileMenu}
                />
              </MobileNavItem>

              {/* Services dropdown */}
              <MobileNavItem href="/services" label="Services">
                <MobileNavItem
                  href="/services/financing"
                  label="Financing"
                  onClick={closeMobileMenu}
                />
                <MobileNavItem
                  href="/services/insurance"
                  label="Insurance"
                  onClick={closeMobileMenu}
                />
                <MobileNavItem
                  href="/services/maintenance"
                  label="Maintenance"
                  onClick={closeMobileMenu}
                />
              </MobileNavItem>

              <MobileNavItem
                href="/about"
                label="About"
                onClick={closeMobileMenu}
              />
              <MobileNavItem
                href="/contact"
                label="Contact"
                onClick={closeMobileMenu}
              />

              {/* Mobile-only actions */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-3 mb-3 bg-white rounded-md shadow-sm border border-gray-200">
                      <p className="text-base font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                        {isAdmin && <span className="ml-1 text-xs font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">(Admin)</span>}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{user?.email}</p>
                    </div>
                    <MobileNavItem
                      href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                      label={isAdmin ? "Admin Dashboard" : "Dashboard"}
                      icon={<LayoutDashboard size={18} />}
                      onClick={closeMobileMenu}
                    />
                    <MobileNavItem
                      href="/favorites"
                      label={`My Favorites${favoritesCount > 0 ? ` (${favoritesCount})` : ''}`}
                      icon={<Heart size={18} />}
                      onClick={closeMobileMenu}
                    />
                    <MobileNavItem
                      href="/test-drives"
                      label="Test Drives"
                      icon={<Car size={18} />}
                      onClick={closeMobileMenu}
                    />
                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="w-full text-left flex items-center py-3 text-base font-medium text-red-600"
                    >
                      <LogOut size={18} className="mr-3" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full py-3 px-4 text-center font-medium rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
