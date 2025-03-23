// src/components/layout/Navbar.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  User,
  Car,
  Menu,
  X,
  ChevronDown,
  Phone,
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
  const pathname = usePathname();

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

              <NavItem href="/about" label="About Us" />
              <NavItem href="/blog" label="Blog" />
              <NavItem href="/contact" label="Contact" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center">
            {/* Search & Favorites */}
            <div className="flex items-center">
              <button
                className="relative w-10 h-10 flex items-center justify-center text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                className="relative w-10 h-10 flex items-center justify-center text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
                aria-label="Favorites"
              >
                <Heart size={20} />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* Login (visible on medium screens and up) */}
            <div className="hidden md:flex items-center ml-2">
              <Link
                href="/login"
                className={`text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-full px-3 py-2 flex items-center transition-colors ${
                  pathname === "/login" ? "bg-orange-50 text-orange-500" : ""
                }`}
              >
                <User size={18} className="mr-1.5" />
                <span className="text-sm font-medium whitespace-nowrap">
                  Login / Register
                </span>
              </Link>
            </div>

            {/* Add Listing Button (visible on medium screens and up) */}
            <div className="hidden md:block ml-2">
              <Link
                href="/add-listing"
                className={`${
                  pathname === "/add-listing"
                    ? "bg-orange-600"
                    : "bg-orange-500 hover:bg-orange-600"
                } text-white px-4 py-2 rounded-full flex items-center transition-colors shadow-sm`}
              >
                <Car size={16} className="mr-1.5" />
                <span className="text-sm font-medium">Sell Your Car</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden ml-4 text-gray-700 hover:bg-gray-100 p-2 rounded-md focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu - Fixed position with animation */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-transform duration-300 transform ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "64px" }} // Match the height of the navbar
      >
        <div className="h-full w-full bg-white shadow-xl overflow-y-auto">
          <div className="px-4 py-6 space-y-1 divide-y divide-gray-200">
            {/* Navigation Links */}
            <div className="py-2 space-y-1">
              <MobileNavItem href="/" label="Home" onClick={closeMobileMenu} />
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
                label="About Us"
                onClick={closeMobileMenu}
              />
              <MobileNavItem
                href="/blog"
                label="Blog"
                onClick={closeMobileMenu}
              />
              <MobileNavItem
                href="/contact"
                label="Contact"
                onClick={closeMobileMenu}
              />
            </div>

            {/* Actions */}
            <div className="py-4 space-y-3">
              <MobileNavItem
                href="/login"
                label="Login / Register"
                icon={<User size={18} />}
                onClick={closeMobileMenu}
              />
              <MobileNavItem
                href="/add-listing"
                label="Sell Your Car"
                icon={<Car size={18} />}
                onClick={closeMobileMenu}
              />

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Phone size={14} className="mr-2 text-orange-500" />
                  <span>+1-800-AUTO-CAR</span>
                </div>
                <div className="text-sm text-gray-500">
                  Business Hours: Mon-Fri 9am - 7pm
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop - only visible when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          style={{ top: "64px" }}
          onClick={closeMobileMenu}
        ></div>
      )}
    </header>
  );
}
