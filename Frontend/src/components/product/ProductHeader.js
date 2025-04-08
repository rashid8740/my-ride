// src/components/product/ProductHeader.js
"use client";
import { useState } from "react";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Camera,
  Clock,
  Tag,
} from "lucide-react";

export default function ProductHeader({ car }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Navigate through carousel slides
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === car.images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Share vehicle
  const shareVehicle = () => {
    if (navigator.share) {
      navigator
        .share({
          title: car.title,
          text: `Check out this ${car.year} ${car.make} ${car.model}!`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <section className="bg-white border-b border-gray-200 pb-6">
      <div className="container mx-auto px-4 md:px-8">
        {/* Status Banner */}
        <div className="bg-orange-500 text-white py-2 px-4 rounded-b-lg inline-flex items-center mb-4 shadow-sm">
          <Tag size={16} className="mr-2" />
          <span className="font-medium">{car.status}</span>
        </div>

        {/* Vehicle Title */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {car.title}
              </h1>
              <div className="flex flex-wrap items-center text-sm text-gray-600 gap-2">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                  Stock # {car.stockNumber}
                </span>
                <span className="flex items-center">
                  <Clock size={14} className="mr-1 text-gray-500" />
                  Listed 2 weeks ago
                </span>
                <span className="text-gray-500">VIN: {car.vin}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {car.discountedPrice && car.price > car.discountedPrice ? (
                <>
                  <span className="text-gray-500 line-through text-lg">
                    KSh {typeof car.price === 'number' 
                      ? car.price.toLocaleString() 
                      : parseFloat(car.price?.toString().replace(/[^\d.-]/g, '') || '0').toLocaleString()}
                  </span>
                  <span className="text-3xl md:text-4xl font-bold text-orange-600">
                    KSh {typeof car.discountedPrice === 'number' 
                      ? car.discountedPrice.toLocaleString() 
                      : parseFloat(car.discountedPrice?.toString().replace(/[^\d.-]/g, '') || '0').toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl md:text-4xl font-bold text-orange-600">
                  KSh {typeof car.price === 'number' 
                    ? car.price.toLocaleString() 
                    : parseFloat(car.price?.toString().replace(/[^\d.-]/g, '') || '0').toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Image Carousel */}
        <div className="relative overflow-hidden rounded-xl bg-gray-100 h-[300px] sm:h-[400px] md:h-[500px] mb-4">
          {/* Main Images */}
          {car.images.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}

          {/* Image count badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            <Camera size={14} />
            <span>
              {currentSlide + 1}/{car.images.length} Photos
            </span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={toggleFavorite}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isFavorite
                  ? "bg-orange-500 text-white"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white"
              }`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={shareVehicle}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white flex items-center justify-center transition-colors"
              aria-label="Share vehicle"
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white flex items-center justify-center transition-colors shadow-md"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white flex items-center justify-center transition-colors shadow-md"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="grid grid-cols-6 gap-2 mb-8">
          {car.images.slice(0, 6).map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentSlide(index)}
              className={`relative aspect-square rounded-md overflow-hidden transition-all ${
                currentSlide === index
                  ? "ring-2 ring-orange-500"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {currentSlide === index && (
                <div className="absolute inset-0 border-2 border-orange-500 rounded-md"></div>
              )}
            </button>
          ))}
          {car.images.length > 6 && (
            <button
              onClick={() => setCurrentSlide(6)}
              className="flex-shrink-0 aspect-square rounded-md overflow-hidden border bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
            >
              +{car.images.length - 6}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
