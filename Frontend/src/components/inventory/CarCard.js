// src/components/inventory/CarCard.jsx
import Link from "next/link";
import { Camera } from "lucide-react";

export default function CarCard({ car }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Car Image with Badges */}
      <div className="relative h-40 sm:h-48 bg-gray-100 overflow-hidden">
        <img
          src={car.image}
          alt={car.title}
          className="w-full h-full object-cover"
        />

        {/* Top badges */}
        <div className="absolute top-2 left-0 right-0 flex justify-between px-2 sm:px-3">
          {car.featured && (
            <div className="bg-orange-500 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
              Featured
            </div>
          )}

          {/* Photo Count Badge */}
          <div className="flex items-center gap-1 bg-black/60 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            <Camera size={12} className="sm:hidden" />
            <Camera size={14} className="hidden sm:block" />
            <span>{car.photoCount}</span>
          </div>
        </div>

        {/* Year Badge */}
        <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-tl-lg">
          {car.year}
        </div>
      </div>

      {/* Car Details */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Category */}
        <div className="text-orange-500 text-xs sm:text-sm font-medium">
          {car.category}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm sm:text-lg min-h-[2.5em] line-clamp-2">
          {car.title}
        </h3>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
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

          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
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

          <div className="flex items-center gap-1 col-span-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
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
        <div className="text-orange-500 font-bold text-base sm:text-xl">
          ${car.price}
        </div>
      </div>

      {/* View Car Button */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-100 flex justify-center">
        <Link
          href={`/cars/${car.id}`}
          className="text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
