// src/components/home/TestimonialsSection.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          } sm:w-[18px] sm:h-[18px]`}
        />
      ))}
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial, isActive }) => {
  return (
    <div
      className={`transition-all duration-700 transform ${
        isActive
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 translate-x-20 scale-95 absolute"
      }`}
    >
      <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl relative flex flex-col">
        {/* Quote Icon */}
        <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 bg-orange-500 rounded-full p-2 sm:p-3 shadow-lg">
          <Quote size={20} className="text-white sm:hidden" />
          <Quote size={24} className="text-white hidden sm:block" />
        </div>

        {/* Rating and Title at the top */}
        <div className="mb-3 sm:mb-4 pt-3 sm:pt-4">
          <StarRating rating={testimonial.rating} />
          <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-gray-900">
            {testimonial.title}
          </h3>
        </div>

        {/* Content in scrollable area if needed */}
        <div className="overflow-y-auto mb-4 flex-grow">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            "{testimonial.content}"
          </p>
        </div>

        {/* Author - Always at bottom */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="mr-3 sm:mr-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-orange-500"
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {testimonial.name}
              </h4>
              <p className="text-xs sm:text-sm text-gray-500">
                {testimonial.location}
              </p>
            </div>
          </div>

          {/* Car Purchased */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">Purchased:</p>
            <p className="font-medium text-sm sm:text-base text-gray-900">
              {testimonial.carPurchased}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Video Testimonial Component
const VideoTestimonial = ({ video, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform ${
        isActive
          ? "ring-4 ring-orange-500 scale-105"
          : "opacity-60 hover:opacity-80"
      }`}
    >
      {/* Thumbnail */}
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-20 sm:h-24 md:h-28 object-cover"
      />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/50 rounded-full p-1.5 sm:p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Name */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 sm:p-2">
        <p className="text-white text-[10px] sm:text-xs font-medium truncate">
          {video.author}
        </p>
      </div>
    </div>
  );
};

// Video Testimonial Data
const videoTestimonials = [
  {
    author: "James Wilson",
    title: "My Experience with AutoDecar",
    thumbnail:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop",
  },
  {
    author: "Maria Garcia",
    title: "Why I Chose AutoDecar",
    thumbnail:
      "https://images.unsplash.com/photo-1605515439778-e9b91a7c8903?q=80&w=800&auto=format&fit=crop",
  },
  {
    author: "Robert Taylor",
    title: "AutoDecar Delivery Day",
    thumbnail:
      "https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop",
  },
  {
    author: "Lisa Brown",
    title: "One Year with My BMW",
    thumbnail:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
  },
  {
    author: "Thomas Martin",
    title: "AutoDecar vs Traditional Dealerships",
    thumbnail:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
  },
  {
    author: "Sarah Johnson",
    title: "My AutoDecar Experience",
    thumbnail:
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=800&auto=format&fit=crop",
  },
];

export default function TestimonialsSection({ id }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const maxIndex = testimonials.length - 1;

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prevIndex) =>
          prevIndex === maxIndex ? 0 : prevIndex + 1
        );
      }, 8000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [maxIndex, isPlaying]);

  // Navigation handlers
  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? maxIndex : prevIndex - 1));
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === maxIndex ? 0 : prevIndex + 1));
  };

  // Play video handler
  const handlePlayVideo = (index) => {
    setActiveVideoIndex(index);
    setIsPlaying(true);
    // In a real implementation, you would trigger the video to play
  };

  // Close video handler
  const handleCloseVideo = () => {
    setIsPlaying(false);
  };

  return (
    <section
      id={id}
      className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-100 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Real stories from real customers about their experience with
            AutoDecar.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-5 lg:gap-8">
          {/* Written Testimonials */}
          <div className="lg:col-span-3 relative">
            <div className="relative h-[400px] xs:h-[450px] sm:h-[480px] md:h-[500px] lg:h-[500px] mb-6 sm:mb-8 md:mb-10">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  testimonial={testimonial}
                  isActive={index === activeIndex}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 bg-gray-50 p-3 rounded-lg">
              <div className="flex space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-8 bg-orange-500"
                        : "w-3 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={goToPrev}
                  className="p-2.5 rounded-full bg-white border border-gray-300 shadow-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={goToNext}
                  className="p-2.5 rounded-full bg-white border border-gray-300 shadow-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Video Testimonials */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
              {/* Main Video */}
              <div className="relative aspect-video bg-black">
                {isPlaying ? (
                  <div className="w-full h-full relative">
                    <img
                      src={videoTestimonials[activeVideoIndex].thumbnail}
                      alt="Video placeholder"
                      className="w-full h-full object-cover opacity-70"
                    />
                    {/* This would be a real video in production */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={handleCloseVideo}
                        className="bg-white/20 backdrop-blur-sm rounded-full p-3 sm:p-4 hover:bg-white/30 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="white"
                          className="w-6 h-6 sm:w-8 sm:h-8"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm4.28-1.72a.75.75 0 00-1.06 1.06L8.94 15l-3.47 3.47a.75.75 0 101.06 1.06L10 16.06l3.47 3.47a.75.75 0 101.06-1.06L11.06 15l3.47-3.47a.75.75 0 00-1.06-1.06L10 13.94l-3.47-3.47z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center p-4 sm:p-6 md:p-8">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="white"
                          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
                        Customer Video Reviews
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Select a video below to watch real customer experiences
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Selection */}
              <div className="bg-gray-800 p-3 sm:p-4">
                <h3 className="text-sm sm:text-base text-white font-medium mb-2 sm:mb-3">
                  Video Testimonials
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {videoTestimonials.map((video, index) => (
                    <VideoTestimonial
                      key={index}
                      video={video}
                      isActive={isPlaying && index === activeVideoIndex}
                      onClick={() => handlePlayVideo(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for xs breakpoint */}
      <style jsx global>{`
        @media (min-width: 480px) {
          .xs\\:h-\\[380px\\] {
            height: 380px;
          }
        }
      `}</style>
    </section>
  );
}

// Testimonial Data
const testimonials = [
  {
    name: "Alex Thompson",
    location: "Chicago, IL",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    title: "Best car buying experience ever!",
    content:
      "I was skeptical about buying a car online, but AutoDecar made the process incredibly smooth. Their team was professional, responsive, and truly cared about finding me the right vehicle for my needs. The car was delivered in perfect condition, exactly as described.",
    carPurchased: "2023 Tesla Model Y Performance",
  },
  {
    name: "Sophia Rodriguez",
    location: "Miami, FL",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    title: "Transparent pricing and no-pressure sales",
    content:
      "After visiting multiple traditional dealerships and dealing with pushy salespeople, AutoDecar was a breath of fresh air. The pricing was clear, the sales consultant was knowledgeable but not pushy, and I felt in control of the entire process. Highly recommended!",
    carPurchased: "2022 Audi Q5 Premium Plus",
  },
  {
    name: "Michael Johnson",
    location: "Seattle, WA",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 4,
    title: "Great selection and competitive financing",
    content:
      "I spent weeks researching cars online and found the exact model I wanted at AutoDecar. Their financing options were better than my bank's, and they helped me complete all the paperwork online. The only minor issue was a slight delay in delivery, but it was worth the wait.",
    carPurchased: "2023 BMW X3 M40i",
  },
  {
    name: "Emily Chen",
    location: "Austin, TX",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 5,
    title: "Perfect vehicle for our growing family",
    content:
      "As new parents, we needed to upgrade to a family-friendly SUV. The AutoDecar team listened to our requirements and suggested several options within our budget. We couldn't be happier with our purchase. The safety features and spacious interior are exactly what we needed.",
    carPurchased: "2023 Honda CR-V Hybrid Touring",
  },
  {
    name: "David Williams",
    location: "Denver, CO",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    rating: 5,
    title: "Exceptional trade-in value",
    content:
      "I was pleasantly surprised by the trade-in offer for my old vehicle. AutoDecar beat the offers from other dealerships by a significant margin. The entire transaction was handled efficiently, and I drove away in my new truck feeling like I got a great deal all around.",
    carPurchased: "2023 Ford F-150 Lightning",
  },
];
