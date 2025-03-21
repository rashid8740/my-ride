// src/components/cars/CarListingSection.jsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { Camera } from "lucide-react";

// Body Type Tab Component - exact match to the reference
function BodyTypeTab({ type, isActive, onClick }) {
  return (
    <button
      className={`py-3 px-5 font-medium text-sm transition-colors relative ${
        isActive
          ? "text-black border-b-2 border-orange-500 font-semibold"
          : "text-gray-600 hover:text-gray-800"
      }`}
      onClick={onClick}
    >
      {type}
    </button>
  );
}

// Car Card Component - streamlined version to match reference image
function CarCard({ car }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Car Image with Badges */}
      <div className="relative h-[150px] xs:h-[160px] sm:h-[180px] bg-gray-100 overflow-hidden">
        <img
          src={car.image}
          alt={car.title}
          className="w-full h-full object-cover"
        />

        {/* Top badges in a row - optimized spacing */}
        <div className="absolute top-2 xs:top-3 left-0 right-0 flex justify-between px-2 xs:px-3">
          {/* Featured Badge */}
          <div className="bg-orange-500 text-white text-[10px] xs:text-xs font-medium px-2 xs:px-3 py-0.5 xs:py-1 rounded-full">
            Featured
          </div>

          {/* Photo Count Badge */}
          <div className="flex items-center gap-1 bg-black/60 text-white text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
            <Camera size={10} className="xs:hidden" />
            <Camera size={14} className="hidden xs:block" />
            <span>{car.photoCount}</span>
          </div>
        </div>

        {/* Year Badge */}
        <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-[10px] xs:text-xs font-medium px-2 xs:px-4 py-1 rounded-tl-lg">
          {car.year}
        </div>
      </div>

      {/* Car Details - Simplified Layout with better text handling */}
      <div className="p-3 xs:p-4 space-y-2 xs:space-y-3">
        {/* Category */}
        <div className="text-orange-500 text-xs xs:text-sm font-medium">
          {car.category}
        </div>

        {/* Title - maintaining line clamp but increasing height slightly */}
        <h3 className="font-semibold text-gray-900 text-sm xs:text-base sm:text-lg min-h-[2.5em] line-clamp-2">
          {car.title}
        </h3>

        {/* Specs - Restructured in 2-column grid with transmission below */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs xs:text-sm text-gray-500">
          {/* Mileage */}
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
              <path d="M12 12l3 2" />
            </svg>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {car.mileage}
            </span>
          </div>

          {/* Fuel */}
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15" />
              <path d="M14 15h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-1" />
            </svg>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {car.fuel}
            </span>
          </div>

          {/* Transmission - Full width below other specs */}
          <div className="flex items-center gap-1 col-span-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M14.5 9l-5 5" />
            </svg>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {car.transmission}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-orange-500 font-bold text-base xs:text-lg sm:text-xl">
          ${car.price}
        </div>
      </div>

      {/* View Car Button - Centered */}
      <div className="px-3 xs:px-4 py-2 xs:py-3 border-t border-gray-100 flex justify-center">
        <Link
          href={`/cars/${car.id}`}
          className="text-xs xs:text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 px-3 xs:px-5 py-1.5 xs:py-2 rounded-full transition-colors"
        >
          View car
        </Link>
      </div>
    </div>
  );
}

export default function CarListingSection({ id }) {
  const [activeTab, setActiveTab] = useState("SUV");

  // Body type tabs
  const bodyTypes = ["SUV", "Hatchback", "Sedan", "MUV", "Luxury"];

  // Mock data for car listings
  const carListings = [
    {
      id: 1,
      title: "2017 BMW X1 xDrive 20d xline",
      category: "Sedan",
      year: "2024",
      price: "73,000",
      mileage: "72,491 kms",
      fuel: "Diesel",
      transmission: "Automatic",
      photoCount: "6",
      image:
        "https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?q=80&w=800&auto=format&fit=crop",
      seller: {
        name: "Cooper, Kristin",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    },
    {
      id: 2,
      title: "2017 BMW X1 xDrive 20d xline",
      category: "Sedan",
      year: "2024",
      price: "73,000",
      mileage: "72,491 kms",
      fuel: "Diesel",
      transmission: "Automatic",
      photoCount: "6",
      image:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
      seller: {
        name: "Cooper, Kristin",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    },
    {
      id: 3,
      title: "2017 BMW X1 xDrive 20d xline",
      category: "Sedan",
      year: "2024",
      price: "73,000",
      mileage: "72,491 kms",
      fuel: "Diesel",
      transmission: "Automatic",
      photoCount: "6",
      image:
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop",
      seller: {
        name: "Flores, Juanita",
        avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      },
    },
    {
      id: 4,
      title: "2017 BMW X1 xDrive 20d xline",
      category: "Sedan",
      year: "2024",
      price: "73,000",
      mileage: "72,491 kms",
      fuel: "Diesel",
      transmission: "Automatic",
      photoCount: "6",
      image:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
      seller: {
        name: "Henry, Arthur",
        avatar: "https://randomuser.me/api/portraits/men/14.jpg",
      },
    },
    {
      id: 5,
      title: "2017 BMW X1 xDrive 20d xline",
      category: "Sedan",
      year: "2024",
      price: "73,000",
      mileage: "72,491 kms",
      fuel: "Diesel",
      transmission: "Automatic",
      photoCount: "6",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
      seller: {
        name: "Nguyen, Shane",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      },
    },
    {
      id: 6,
      title: "2017 BMW X1 xDrive 20d xline",
      category: "Sedan",
      year: "2024",
      price: "73,000",
      mileage: "72,491 kms",
      fuel: "Diesel",
      transmission: "Automatic",
      photoCount: "6",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
      seller: {
        name: "Nguyen, Shane",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      },
    },
    {
      id: 7,
      title: "2017 BMW X1 xDrive 20d xline",
      category: "Sedan",
      year: "2024",
      price: "73,000",
      mileage: "72,491 kms",
      fuel: "Diesel",
      transmission: "Automatic",
      photoCount: "6",
      image:
        "https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?q=80&w=800&auto=format&fit=crop",
      seller: {
        name: "Miles, Esther",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      },
    },
    {
      id: 8,
      title: "2017 BMW X1 xDrive 20d xline",
      category: "Sedan",
      year: "2024",
      price: "73,000",
      mileage: "72,491 kms",
      fuel: "Diesel",
      transmission: "Automatic",
      photoCount: "6",
      image:
        "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop",
      seller: {
        name: "Black, Marvin",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      },
    },
  ];

  return (
    <div
      id={id}
      className="w-full bg-white py-8 sm:py-10 pt-24 sm:pt-32 relative"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          Featured Vehicles
        </h2>

        {/* Tabs Section - Scrollable on mobile */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-6 sm:mb-8">
          {bodyTypes.map((type) => (
            <BodyTypeTab
              key={type}
              type={type}
              isActive={activeTab === type}
              onClick={() => setActiveTab(type)}
            />
          ))}
        </div>

        {/* Car Cards Grid - 2 columns with optimized spacing */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
          {carListings.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>

      {/* Add custom styles for hiding scrollbars while maintaining functionality */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Add xs breakpoint for extra small screens */
        @media (min-width: 480px) {
          .xs\\:hidden {
            display: none;
          }
          .xs\\:block {
            display: block;
          }
          .xs\\:h-\\[160px\\] {
            height: 160px;
          }
          .xs\\:p-3 {
            padding: 0.75rem;
          }
          .xs\\:p-4 {
            padding: 1rem;
          }
          .xs\\:px-3 {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          .xs\\:px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .xs\\:px-5 {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
          .xs\\:py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
          .xs\\:py-3 {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
          .xs\\:text-xs {
            font-size: 0.75rem;
            line-height: 1rem;
          }
          .xs\\:text-sm {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
          .xs\\:text-base {
            font-size: 1rem;
            line-height: 1.5rem;
          }
          .xs\\:text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
          .xs\\:space-y-3 > :not([hidden]) ~ :not([hidden]) {
            --tw-space-y-reverse: 0;
            margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
            margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
          }
          .xs\\:gap-3 {
            gap: 0.75rem;
          }
          .xs\\:gap-4 {
            gap: 1rem;
          }
          .xs\\:top-3 {
            top: 0.75rem;
          }
          .xs\\:h-4 {
            height: 1rem;
          }
          .xs\\:w-4 {
            width: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
