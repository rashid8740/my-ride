// src/components/layout/Navbar.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Heart, User, Car, Menu } from "lucide-react";

// Navigation Item Component
function NavItem({ href, label, isActive = false, hasDropdown = false }) {
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
        {label}{" "}
        {hasDropdown && (
          <svg
            className="h-4 w-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </Link>
    </div>
  );
}

// Mobile Navigation Item Component
function MobileNavItem({ href, label, isActive = false, icon = null }) {
  // Handle smooth scrolling for anchor links
  const handleClick = (e) => {
    const href = e.currentTarget.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        // Close mobile menu after clicking
        const event = new CustomEvent("closeMobileMenu");
        document.dispatchEvent(event);
      }
    }
  };

  return (
    <Link
      href={href}
      className={`block py-2 text-base font-medium ${
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

  return (
    <header className="fixed w-full top-0 left-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-8 lg:px-16">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-block">
              <div className="flex items-center">
                <Image
                  src="/images/logo-2.png"
                  alt="AutoDecar"
                  width={180}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Main Navigation - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex items-center space-x-1">
            <NavItem href="/" label="Home" isActive hasDropdown />
            <NavItem href="/listing" label="Listing Car" hasDropdown />
            <NavItem href="/page" label="Page" hasDropdown />
            <NavItem href="/blog" label="Blog" hasDropdown />
            <NavItem href="/contact" label="Contact" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
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
              className="lg:hidden text-gray-700 focus:outline-none"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <Menu size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute w-full bg-white z-50 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1 divide-y divide-gray-200">
            <div className="py-2">
              <MobileNavItem href="/" label="Home" isActive />
              <MobileNavItem href="/listing" label="Listing Car" />
              <MobileNavItem href="/page" label="Page" />
              <MobileNavItem href="/blog" label="Blog" />
              <MobileNavItem href="/contact" label="Contact" />
            </div>

            <div className="py-2">
              <MobileNavItem
                href="/login"
                label="Login / Register"
                icon={<User size={18} />}
              />
              <MobileNavItem
                href="/add-listing"
                label="Add listing"
                icon={<Car size={18} />}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
