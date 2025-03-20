// src/components/home/HeroSection.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Plus,
} from "lucide-react";

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

            {/* Slide Content */}
            <div className="absolute left-0 top-0 h-full z-20 flex flex-col justify-center px-16 w-full md:w-2/3 lg:w-1/2">
              <div className="max-w-lg">
                <h2 className="text-xl text-orange-500 font-medium mb-2">
                  {slide.subtitle}
                </h2>
                <h1 className="text-5xl md:text-6xl text-white font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>

                <div className="flex flex-wrap items-start gap-5 mb-16">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-5 inline-block">
                    <div className="text-white font-medium text-xl mb-3">
                      {slide.car.model}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-orange-400 font-bold text-2xl">
                        {slide.car.price}
                      </span>
                      <div className="bg-orange-500 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                        {slide.car.type}
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/inventory"
                    className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-md transition-colors shadow-lg font-semibold text-lg self-center"
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

      {/* Navigation Controls */}
      <div className="absolute bottom-40 right-16 z-30 flex space-x-4">
        <button
          onClick={prevSlide}
          className="w-12 h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-black transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-black transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-40 left-16 z-30 flex items-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? "w-8 h-2 bg-orange-500"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Quick Search Component
const QuickSearch = () => {
  const [activeType, setActiveType] = useState("All");
  const vehicleTypes = ["All", "New", "Used", "Certified"];

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          Find Your Perfect Car
        </h2>
      </div>

      {/* Vehicle Types */}
      <div className="flex border-b border-gray-200">
        {vehicleTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeType === type
                ? "text-orange-500 border-b-2 border-orange-500 -mb-px"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {type} Vehicles
          </button>
        ))}
      </div>

      {/* Search Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 p-6 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Make & Model
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option>Any Make</option>
            <option>Tesla</option>
            <option>BMW</option>
            <option>Audi</option>
            <option>Mercedes-Benz</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Price Range
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option>Any Price</option>
            <option>Under $30,000</option>
            <option>$30,000 - $50,000</option>
            <option>$50,000 - $70,000</option>
            <option>$70,000+</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Body Type
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option>Any Type</option>
            <option>SUV</option>
            <option>Sedan</option>
            <option>Coupe</option>
            <option>Truck</option>
          </select>
        </div>
      </div>

      {/* Additional Options & Search Button */}
      <div className="flex items-center justify-between bg-gray-50 px-6 py-4">
        <button className="flex items-center text-sm text-gray-600 hover:text-orange-500 transition-colors">
          <Plus size={18} className="mr-1" />
          More Options
        </button>

        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-medium flex items-center transition-colors">
          <Search size={18} className="mr-2" />
          Search Cars
        </button>
      </div>
    </div>
  );
};

export default function HeroSection({ id }) {
  return (
    <section id={id} className="relative w-full h-[85vh] mt-20">
      {/* Main Slider Section */}
      <ModernSlider />

      {/* Quick Search Box - with better vertical positioning */}
      <div className="absolute bottom-0 left-0 right-0 z-20 transform translate-y-1/3 mt-12">
        <div className="max-w-5xl mx-auto px-4">
          <QuickSearch />
        </div>
      </div>
    </section>
  );
}
