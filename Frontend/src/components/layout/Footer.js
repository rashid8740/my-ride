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
} from "lucide-react";

// Social Media Link Component
const SocialLink = ({ href, icon, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
    >
      {icon}
    </a>
  );
};

// Footer Link Component
const FooterLink = ({ href, children }) => {
  return (
    <li className="mb-2">
      <Link
        href={href}
        className="text-gray-300 hover:text-white transition-colors inline-block py-1"
      >
        {children}
      </Link>
    </li>
  );
};

// Footer Heading Component
const FooterHeading = ({ children }) => {
  return (
    <h3 className="text-white font-bold text-lg mb-6 relative pb-2 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-12 before:h-1 before:bg-orange-500">
      {children}
    </h3>
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
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                src="/images/logo-white.png"
                alt="AutoDecar"
                width={180}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              AutoDecar is your premier destination for quality vehicles. Our
              mission is to provide an exceptional car buying experience with
              transparency, integrity, and unmatched customer service.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <a
                    href="tel:+1-800-AUTO-CAR"
                    className="text-white hover:text-orange-400 transition-colors"
                  >
                    +1-800-AUTO-CAR
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <a
                    href="mailto:info@autodecar.com"
                    className="text-white hover:text-orange-400 transition-colors"
                  >
                    info@autodecar.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <address className="text-white not-italic">
                    1234 Auto Drive, Suite 100
                    <br />
                    Miami, FL 33101
                  </address>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 flex space-x-3">
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

          {/* Quick Links */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul>
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/cars">Inventory</FooterLink>
              <FooterLink href="/financing">Financing</FooterLink>
              <FooterLink href="/sell-your-car">Sell Your Car</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
            </ul>
          </div>

          {/* Vehicle Categories */}
          <div>
            <FooterHeading>Vehicle Categories</FooterHeading>
            <ul>
              <FooterLink href="/cars/suv">SUVs</FooterLink>
              <FooterLink href="/cars/sedan">Sedans</FooterLink>
              <FooterLink href="/cars/luxury">Luxury</FooterLink>
              <FooterLink href="/cars/electric">Electric Vehicles</FooterLink>
              <FooterLink href="/cars/hybrid">Hybrid</FooterLink>
              <FooterLink href="/cars/truck">Trucks</FooterLink>
              <FooterLink href="/cars/convertible">Convertibles</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <FooterHeading>Newsletter</FooterHeading>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter to receive updates on new inventory,
              promotions, and automotive tips.
            </p>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="py-3 px-4 bg-white/10 text-white placeholder-gray-400 rounded-l-md flex-grow focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-r-md px-4 transition-colors"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-400">
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates from our company.
              </p>
            </form>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="mt-8 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors flex items-center justify-center group"
              aria-label="Scroll to top"
            >
              <ChevronUp
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/30 py-6">
        <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} AutoDecar. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/cookie-policy"
              className="hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href="/sitemap"
              className="hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
