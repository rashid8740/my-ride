// src/components/layout/Navbar.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, Heart, User, Car, Menu, X } from "lucide-react";

// Navigation Item Component
function NavItem({ href, label, isActive = false }) {
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
    <div className="relative group">
      <Link
        href={href}
        className={`text-sm font-medium py-3 px-3 inline-flex items-center transition-colors ${
          isActive
            ? "text-orange-500 font-semibold"
            : "text-gray-800 hover:text-orange-500"
        }`}
        onClick={handleClick}
      >
        {label}
      </Link>
    </div>
  );
}

// Mobile Navigation Item Component
function MobileNavItem({
  href,
  label,
  isActive = false,
  icon = null,
  onClick,
}) {
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
    // Close mobile menu after clicking
    if (onClick) onClick();
  };

  return (
    <Link
      href={href}
      className={`block py-3 text-base font-medium ${
        isActive ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
      } flex items-center transition-colors`}
      onClick={handleClick}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {label}
    </Link>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      className={`fixed w-full top-0 left-0 z-50 bg-white shadow-sm border-b border-gray-200 transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-16">
        <nav className="flex items-center justify-between h-16 sm:h-20">
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

          {/* Main Navigation - Centered on desktop only */}
          <div className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <NavItem href="/" label="Home" isActive />
              <NavItem href="/inventory" label="Inventory" />
              <NavItem href="/about" label="About" />
              <NavItem href="/contact" label="Contact" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center">
            {/* Search & Favorites (visible on all screens) */}
            <div className="flex items-center space-x-4 mr-4">
              <button
                className="text-gray-700 hover:text-orange-500 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                className="text-gray-700 hover:text-orange-500 transition-colors"
                aria-label="Favorites"
              >
                <Heart size={20} />
              </button>
            </div>

            {/* Login (visible on medium screens and up) */}
            <div className="hidden md:flex items-center">
              <Link
                href="/login"
                className="text-gray-700 hover:text-orange-500 flex items-center transition-colors"
              >
                <User size={20} className="mr-1" />
                <span className="text-sm font-medium whitespace-nowrap">
                  Login / Register
                </span>
              </Link>
            </div>

            {/* Add Listing Button (visible on medium screens and up) */}
            <div className="hidden md:block border-l border-gray-300 pl-4 ml-2">
              <Link
                href="/add-listing"
                className="bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-full flex items-center transition-colors"
              >
                <Car size={16} className="mr-2" />
                <span className="text-sm font-medium">Add listing</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden ml-4 text-gray-700 focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
          <div className="px-4 py-6 space-y-6 divide-y divide-gray-200">
            {/* Navigation Links */}
            <div className="py-2">
              <MobileNavItem
                href="/"
                label="Home"
                isActive
                onClick={closeMobileMenu}
              />
              <MobileNavItem
                href="/inventory"
                label="Inventory"
                onClick={closeMobileMenu}
              />
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
            </div>

            {/* Actions */}
            <div className="py-2">
              <MobileNavItem
                href="/login"
                label="Login / Register"
                icon={<User size={18} />}
                onClick={closeMobileMenu}
              />
              <MobileNavItem
                href="/add-listing"
                label="Add listing"
                icon={<Car size={18} />}
                onClick={closeMobileMenu}
              />
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