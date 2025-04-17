// src/components/layout/Footer.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// Social Media Link Component
const SocialLink = ({ href, icon, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-sm"
    >
      {icon}
    </a>
  );
};

// Footer Link Component
const FooterLink = ({ href, children }) => {
  return (
    <li className="mb-2.5">
      <Link
        href={href}
        className="text-gray-300 hover:text-white transition-colors inline-block py-0.5"
      >
        {children}
      </Link>
    </li>
  );
};

// Footer Heading Component - With Mobile Collapsible Functionality
const FooterHeading = ({ children, isOpen, toggleOpen }) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-6 relative pb-1 sm:pb-2 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-8 sm:before:w-12 before:h-1 before:bg-orange-500">
        {children}
      </h3>
      <button
        onClick={toggleOpen}
        className="block sm:hidden text-gray-300 p-1"
        aria-label={isOpen ? "Close section" : "Open section"}
      >
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
    </div>
  );
};

// Collapsible Section Component
const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700/30 pb-6 mb-6 sm:pb-0 sm:border-b-0 lg:mb-0">
      <FooterHeading isOpen={isOpen} toggleOpen={() => setIsOpen(!isOpen)}>
        {title}
      </FooterHeading>
      <div className={`${isOpen ? "block" : "hidden"} sm:block`}>
        {children}
      </div>
    </div>
  );
};

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the newsletter subscription
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2 mb-6 sm:mb-0 border-b border-gray-700/30 pb-6 lg:border-0 lg:pb-0">
            <div className="mb-4 sm:mb-6">
              <Image
                src="/images/logo-2.png"
                alt="MyRide"
                width={180}
                height={40}
                className="h-8 sm:h-10 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-5 max-w-md text-sm sm:text-base leading-relaxed">
              MyRide is your premier destination for quality vehicles in Kenya. Our
              mission is to provide an exceptional car buying experience with
              transparency, integrity, and unmatched customer service.
            </p>

            {/* Contact Info - With improved styling */}
            <div className="space-y-4 mb-5">
              <div className="flex items-start">
                <div className="bg-gray-700 rounded-full p-2 mr-3 flex-shrink-0">
                  <Phone className="text-orange-400 h-4 w-4" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">
                    Phone
                  </p>
                  <a
                    href="tel:+254700123456"
                    className="text-white hover:text-orange-400 transition-colors text-sm sm:text-base"
                  >
                    +254 700 123 456
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-700 rounded-full p-2 mr-3 flex-shrink-0">
                  <Mail className="text-orange-400 h-4 w-4" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">
                    Email
                  </p>
                  <a
                    href="mailto:info@myride.co.ke"
                    className="text-white hover:text-orange-400 transition-colors text-sm sm:text-base"
                  >
                    info@myride.co.ke
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-700 rounded-full p-2 mr-3 flex-shrink-0">
                  <MapPin className="text-orange-400 h-4 w-4" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">
                    Location
                  </p>
                  <address className="text-white not-italic text-sm sm:text-base">
                    Ngong Road, Nairobi, Kenya
                  </address>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6 flex space-x-4">
              <SocialLink
                href="https://facebook.com"
                icon={<Facebook size={18} />}
                label="Facebook"
              />
              <SocialLink
                href="https://twitter.com"
                icon={<Twitter size={18} />}
                label="Twitter"
              />
              <SocialLink
                href="https://instagram.com"
                icon={<Instagram size={18} />}
                label="Instagram"
              />
              <SocialLink
                href="https://youtube.com"
                icon={<Youtube size={18} />}
                label="YouTube"
              />
            </div>
          </div>

          {/* Quick Links - Collapsible on Mobile */}
          <CollapsibleSection title="Quick Links">
            <ul className="grid grid-cols-2 sm:block text-sm sm:text-base gap-x-4">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/inventory">Inventory</FooterLink>
              <FooterLink href="/services">Services</FooterLink>
              <FooterLink href="/favorites">Favorites</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
            </ul>
          </CollapsibleSection>

          {/* Vehicle Categories - Collapsible on Mobile */}
          <CollapsibleSection title="Vehicle Categories">
            <ul className="grid grid-cols-2 sm:block text-sm sm:text-base gap-x-4">
              <FooterLink href="/inventory?category=SUV">SUVs</FooterLink>
              <FooterLink href="/inventory?category=Sedan">Sedans</FooterLink>
              <FooterLink href="/inventory?category=Luxury">Luxury</FooterLink>
              <FooterLink href="/inventory?category=Hatchback">Hatchback</FooterLink>
              <FooterLink href="/inventory?category=Truck">Trucks</FooterLink>
              <FooterLink href="/inventory?category=Coupe">Coupes</FooterLink>
            </ul>
          </CollapsibleSection>

          {/* Newsletter */}
          <CollapsibleSection title="Newsletter">
            <p className="text-gray-300 mb-3 text-sm sm:text-base">
              Subscribe to our newsletter for updates on new inventory and
              promotions.
            </p>

            <form onSubmit={handleSubmit} className="mt-3 sm:mt-4">
              <div className="flex mb-2 sm:mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="py-2 sm:py-3 px-3 sm:px-4 bg-white/10 text-white placeholder-gray-400 rounded-l-md flex-grow focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-r-md px-3 sm:px-4 transition-colors"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-400">
                By subscribing, you agree to our Privacy Policy.
              </p>
            </form>

            {/* Back to top button */}
            <div className="hidden sm:block">
              <button
                onClick={scrollToTop}
                className="mt-6 sm:mt-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 sm:p-3 transition-colors flex items-center justify-center group"
                aria-label="Scroll to top"
              >
                <ChevronUp
                  size={18}
                  className="group-hover:-translate-y-1 transition-transform"
                />
              </button>
            </div>
          </CollapsibleSection>
        </div>
      </div>

      {/* Bottom Bar - Simplified for Mobile */}
      <div className="bg-black/30 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-8 flex justify-center items-center">
          <div className="text-gray-400 text-xs sm:text-sm text-center">
            © {new Date().getFullYear()} MyRide. All rights reserved.
          </div>
        </div>
      </div>

      {/* Mobile Back to Top Button - Fixed */}
      <div className="sm:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={scrollToTop}
          className="bg-orange-500 text-white rounded-full p-3 shadow-lg"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      </div>
    </footer>
  );
}
