"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, ArrowRight, Star } from "lucide-react";

// Enhanced Modern Slider with Animation
const ModernSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideTimerRef = useRef(null);

  // Enhanced slide data with more details and features
  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop",
      title: "Find Your Perfect Drive",
      subtitle: "Discover the best deals on premium vehicles",
      car: {
        model: "2023 Audi RS e-tron GT",
        price: "$104,900",
        type: "Electric",
        features: ["0-60mph in 3.1s", "637hp", "AWD"],
        rating: 4.9,
      },
      accent: "bg-blue-500",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop",
      title: "Luxury Redefined",
      subtitle: "Experience performance without compromise",
      car: {
        model: "2023 BMW M4 Competition",
        price: "$79,900",
        type: "Sport",
        features: ["503hp Twin-Turbo", "RWD", "Carbon Fiber"],
        rating: 4.8,
      },
      accent: "bg-red-500",
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
        features: ["350mi Range", "516hp", "Hyperscreen"],
        rating: 4.7,
      },
      accent: "bg-emerald-500",
    },
  ];

  // Reset and start the slide timer
  const resetSlideTimer = () => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    slideTimerRef.current = setTimeout(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

        setTimeout(() => {
          setIsAnimating(false);
        }, 1000);
      }
    }, 6000);
  };

  useEffect(() => {
    resetSlideTimer();
    return () => {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide, isAnimating]);

  const goToSlide = (index) => {
    if (index !== currentSlide && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      resetSlideTimer();
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      resetSlideTimer();
    }
  };

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      resetSlideTimer();
    }
  };

  // Create star rating display
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : i < rating
                ? "text-yellow-400 fill-yellow-400 opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-white text-xs">{rating}</span>
      </div>
    );
  };

  return (
    <div className="h-full relative overflow-hidden">
      {/* Slides */}
      <div className="h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 z-10 scale-100"
                : "opacity-0 z-0 scale-105"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transform transition-transform duration-10000 ease-out"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

            {/* Slide Content */}
            <div className="absolute left-0 top-0 h-full z-20 flex flex-col justify-center px-8 md:px-16 w-full md:w-2/3 lg:w-1/2">
              <div
                className="max-w-lg transform transition-all duration-1000 delay-200"
                style={{
                  opacity: index === currentSlide ? 1 : 0,
                  transform:
                    index === currentSlide
                      ? "translateY(0)"
                      : "translateY(20px)",
                }}
              >
                <div className={`${slide.accent} w-16 h-1 mb-6 rounded`}></div>
                <h2 className="text-xl text-orange-500 font-medium mb-2 tracking-wide">
                  {slide.subtitle}
                </h2>
                <h1 className="text-4xl sm:text-5xl md:text-6xl text-white font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>

                <div className="bg-black/30 backdrop-blur-md rounded-lg p-5 mb-6">
                  <div className="text-white font-semibold text-xl mb-2">
                    {slide.car.model}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {slide.car.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-white/10 text-white text-xs px-3 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <span className="text-orange-400 font-bold text-2xl">
                        {slide.car.price}
                      </span>
                      <div className="mt-1">
                        {renderStars(slide.car.rating)}
                      </div>
                    </div>
                    <span
                      className={`${slide.accent} text-white text-xs px-3 py-1.5 rounded-full flex items-center font-semibold`}
                    >
                      {slide.car.type}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition-colors shadow-lg">
                    <span className="font-medium">View Inventory</span>
                    <ArrowRight size={16} className="ml-2" />
                  </button>

                  <button className="inline-flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-md transition-colors">
                    <span className="font-medium">Book Test Drive</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Container - Now at the bottom with proper spacing */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-between px-4 sm:px-8 md:px-16">
        {/* Enhanced Pagination */}
        <div className="flex items-center space-x-3">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className="group flex items-center"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`transition-all duration-300 rounded-full h-2 
                ${
                  currentSlide === index
                    ? `w-8 ${slide.accent}`
                    : "w-2 bg-white/50 group-hover:bg-white/80"
                }`}
              />
              {currentSlide === index && (
                <span className="ml-2 text-white text-xs font-medium opacity-80">
                  0{index + 1}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex space-x-4">
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="w-12 h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-black transition-colors disabled:opacity-50"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="w-12 h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-black transition-colors disabled:opacity-50"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative w-full">
      {/* Main Slider Section with responsive height */}
      <div className="h-[600px] sm:h-[700px] md:h-[80vh] lg:h-[85vh] mt-16 sm:mt-20">
        <ModernSlider />
      </div>
    </section>
  );
};

export default HeroSection;
