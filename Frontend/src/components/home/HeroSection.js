// src/components/home/HeroSection.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";

// Modern slider with pagination - adjusted for more compact display
const ModernSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1920&auto=format&fit=crop",
      title: "Find Your Perfect Drive",
      subtitle: "Discover the best deals on premium vehicles",
      car: {
        model: "2023 Audi RS e-tron GT",
        price: "$104,900",
        type: "Electric",
      },
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?q=80&w=800&auto=format&fit=crop",
      title: "Luxury Redefined",
      subtitle: "Experience performance without compromise",
      car: {
        model: "2023 BMW M4 Competition",
        price: "$79,900",
        type: "Sport",
      },
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1920&auto=format&fit=crop",
      title: "Exceptional Selection",
      subtitle: "Curated vehicles for discerning drivers",
      car: {
        model: "2023 Mercedes EQS 580",
        price: "$125,950",
        type: "Electric",
      },
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentSlide, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="h-full relative overflow-hidden">
      {/* Slides */}
      <div className="h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>

            {/* Slide Content - Adjusted positioning for better filter visibility */}
            <div className="absolute left-0 top-0 h-full z-20 flex flex-col justify-center px-4 sm:px-8 md:px-16 w-full md:w-3/4 lg:w-1/2">
              <div className="max-w-lg mb-16 sm:mb-24 md:mb-32">
                <h2 className="text-base sm:text-lg md:text-xl text-orange-500 font-medium mb-2">
                  {slide.subtitle}
                </h2>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4 md:mb-6 leading-tight">
                  {slide.title}
                </h1>

                <div className="flex flex-col sm:flex-row flex-wrap items-start gap-4 md:gap-5 mb-8 md:mb-16">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 md:p-5 inline-block w-full sm:w-auto">
                    <div className="text-white font-medium text-base sm:text-lg md:text-xl mb-2 md:mb-3">
                      {slide.car.model}
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="text-orange-400 font-bold text-lg sm:text-xl md:text-2xl">
                        {slide.car.price}
                      </span>
                      <div className="bg-orange-500 text-white text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                        {slide.car.type}
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/inventory"
                    className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-3.5 rounded-md transition-colors shadow-lg font-semibold text-base sm:text-lg self-start sm:self-center"
                  >
                    View Inventory
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      /* Navigation Controls - Responsive positioning with better visibility on
      mobile */
      <div className="absolute bottom-16 sm:bottom-24 md:bottom-32 right-4 sm:right-8 md:right-16 z-30 flex space-x-2 sm:space-x-4">
        <button
          onClick={prevSlide}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-black transition-colors"
        >
          <ChevronLeft size={16} className="sm:hidden" />
          <ChevronLeft size={20} className="hidden sm:block md:hidden" />
          <ChevronLeft size={24} className="hidden md:block" />
        </button>
        <button
          onClick={nextSlide}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-black transition-colors"
        >
          <ChevronRight size={16} className="sm:hidden" />
          <ChevronRight size={20} className="hidden sm:block md:hidden" />
          <ChevronRight size={24} className="hidden md:block" />
        </button>
      </div>
      {/* Pagination - Adjusted positioning */}
      <div className="absolute bottom-16 sm:bottom-24 md:bottom-32 left-4 sm:left-8 md:left-16 z-30 flex items-center space-x-1 sm:space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-orange-500"
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Quick Search Component - Made responsive
const QuickSearch = () => {
  const [activeType, setActiveType] = useState("All");
  const vehicleTypes = ["All", "New", "Used", "Certified"];

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden absolute bottom-0 left-0 right-0 transform translate-y-1/2 mx-auto max-w-5xl">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Find Your Perfect Car
        </h2>
      </div>

      {/* Vehicle Types - Scrollable on small screens */}
      <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar">
        {vehicleTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3 sm:px-6 py-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeType === type
                ? "text-orange-500 border-b-2 border-orange-500 -mb-px"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {type} Vehicles
          </button>
        ))}
      </div>

      {/* Search Options - Responsive grid with improved visibility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4 sm:p-6 gap-3 sm:gap-4 bg-white">
        <div className="space-y-1">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            Make & Model
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
            <option>Any Make</option>
            <option>Tesla</option>
            <option>BMW</option>
            <option>Audi</option>
            <option>Mercedes-Benz</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            Price Range
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
            <option>Any Price</option>
            <option>Under $30,000</option>
            <option>$30,000 - $50,000</option>
            <option>$50,000 - $70,000</option>
            <option>$70,000+</option>
          </select>
        </div>

        <div className="space-y-1 sm:col-span-2 md:col-span-1">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            Body Type
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
            <option>Any Type</option>
            <option>SUV</option>
            <option>Sedan</option>
            <option>Coupe</option>
            <option>Truck</option>
          </select>
        </div>
      </div>

      {/* Additional Options & Search Button - Responsive layout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
        <button className="flex items-center text-xs sm:text-sm text-gray-600 hover:text-orange-500 transition-colors">
          <Plus size={16} className="mr-1" />
          More Options
        </button>

        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-md font-medium flex items-center transition-colors w-full sm:w-auto justify-center">
          <Search size={16} className="mr-2" />
          Search Cars
        </button>
      </div>
    </div>
  );
};

export default function HeroSection({ id }) {
  return (
    <section
      id={id}
      className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] mt-16 sm:mt-20"
    >
      {/* Main Slider Section */}
      <ModernSlider />
    </section>
  );
}
