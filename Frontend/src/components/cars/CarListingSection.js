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
      <div className="relative h-[180px] bg-gray-100 overflow-hidden">
        <img
          src={car.image}
          alt={car.title}
          className="w-full h-full object-cover"
        />

        {/* Top badges in a row */}
        <div className="absolute top-3 left-0 right-0 flex justify-between px-3">
          {/* Featured Badge */}
          <div className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            Featured
          </div>

          {/* Photo Count Badge */}
          <div className="flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            <Camera size={14} />
            <span>{car.photoCount}</span>
          </div>
        </div>

        {/* Year Badge */}
        <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-xs font-medium px-4 py-1 rounded-tl-lg">
          {car.year}
        </div>
      </div>

      {/* Car Details - Simplified Layout */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="text-orange-500 text-sm font-medium">
          {car.category}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
          {car.title}
        </h3>

        {/* Specs Row */}
        <div className="flex items-center gap-5 text-sm text-gray-500">
          {/* Mileage */}
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
            <span>{car.mileage}</span>
          </div>

          {/* Fuel */}
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
            <span>{car.fuel}</span>
          </div>

          {/* Transmission */}
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
            <span>{car.transmission}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-orange-500 font-bold text-xl">${car.price}</div>
      </div>

      {/* View Car Button - Centered */}
      <div className="px-4 py-3 border-t border-gray-100 flex justify-center">
        <Link
          href={`/cars/${car.id}`}
          className="text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 px-5 py-2 rounded-full transition-colors"
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
    <div id={id} className="w-full bg-white py-10 pt-32 relative">
      <div
        className="w-full"
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 30px" }}
      >
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Featured Vehicles
        </h2>

        {/* Tabs Section */}
        <div className="flex border-b border-gray-200 mb-8">
          {bodyTypes.map((type) => (
            <BodyTypeTab
              key={type}
              type={type}
              isActive={activeTab === type}
              onClick={() => setActiveTab(type)}
            />
          ))}
        </div>

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {carListings.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}
