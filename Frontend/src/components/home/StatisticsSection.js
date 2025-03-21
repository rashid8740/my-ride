// src/components/home/StatisticsSection.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faUsers,
  faTrophy,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

// CountUp animation component
const CountUp = ({ end, duration = 2000, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(
        progress * (end - startValue) + startValue
      );

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return (
    <div ref={countRef} className="inline">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, suffix = "", color }) => {
  return (
    <div className="relative flex flex-col items-center text-center p-4 xs:p-5 sm:p-6 md:p-8 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div
        className={`p-3 xs:p-3.5 sm:p-4 rounded-xl ${color} mb-3 xs:mb-4 sm:mb-5 md:mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-gray-900">
        <CountUp end={value} suffix={suffix} />
      </h3>
      <p className="text-sm xs:text-base sm:text-base md:text-lg text-gray-600 font-medium">
        {title}
      </p>
      <div
        className={`absolute bottom-0 left-0 w-full h-1 ${color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl`}
      ></div>
    </div>
  );
};

export default function StatisticsSection({ id }) {
  return (
    <section
      id={id}
      className="w-full py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24 relative bg-gradient-to-b from-white to-gray-100"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full opacity-40"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full opacity-40"></div>
      </div>

      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            Trusted by Thousands of Car Buyers
          </h2>
          <p className="text-sm xs:text-base sm:text-base md:text-lg text-gray-600">
            We've helped thousands of customers find their perfect vehicle with
            our exceptional service and vast inventory.
          </p>
        </div>

        {/* Statistics Grid - 2x2 on small screens, 4 columns on lg */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          <StatCard
            icon={<FontAwesomeIcon icon={faCar} size="lg" />}
            title="Cars for Sale"
            value={12500}
            color="bg-blue-600"
          />
          <StatCard
            icon={<FontAwesomeIcon icon={faUsers} size="lg" />}
            title="Happy Customers"
            value={9800}
            color="bg-orange-500"
          />
          <StatCard
            icon={<FontAwesomeIcon icon={faTrophy} size="lg" />}
            title="Awards Won"
            value={150}
            color="bg-purple-600"
          />
          <StatCard
            icon={<FontAwesomeIcon icon={faLocationDot} size="lg" />}
            title="Locations"
            value={24}
            color="bg-green-600"
          />
        </div>

        {/* Call to Action */}
        <div className="mt-8 xs:mt-10 sm:mt-12 md:mt-16 lg:mt-20 text-center">
          <p className="text-sm xs:text-base sm:text-base md:text-lg text-gray-600 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
            Join thousands of satisfied customers who found their dream car with
            us
          </p>
          <button className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm xs:text-base py-2 xs:py-2.5 sm:py-3 px-4 xs:px-5 sm:px-6 md:px-8 rounded-full transition-colors shadow-lg">
            Browse Our Inventory
          </button>
        </div>
      </div>

      {/* Add custom styles for xs breakpoint */}
      <style jsx global>{`
        @media (min-width: 480px) {
          .xs\\:hidden {
            display: none;
          }
          .xs\\:block {
            display: block;
          }
          .xs\\:p-3 {
            padding: 0.75rem;
          }
          .xs\\:p-3\\.5 {
            padding: 0.875rem;
          }
          .xs\\:p-4 {
            padding: 1rem;
          }
          .xs\\:p-5 {
            padding: 1.25rem;
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
          .xs\\:py-2\\.5 {
            padding-top: 0.625rem;
            padding-bottom: 0.625rem;
          }
          .xs\\:py-14 {
            padding-top: 3.5rem;
            padding-bottom: 3.5rem;
          }
          .xs\\:mt-10 {
            margin-top: 2.5rem;
          }
          .xs\\:mb-4 {
            margin-bottom: 1rem;
          }
          .xs\\:text-base {
            font-size: 1rem;
            line-height: 1.5rem;
          }
          .xs\\:text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
          .xs\\:text-xl {
            font-size: 1.25rem;
            line-height: 1.75rem;
          }
          .xs\\:text-3xl {
            font-size: 1.875rem;
            line-height: 2.25rem;
          }
          .xs\\:gap-4 {
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
