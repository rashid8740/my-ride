// src/components/home/StatisticsSection.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { Car, Users, Award, MapPin } from "lucide-react";

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
    <div className="relative flex flex-col items-center text-center p-6 sm:p-8 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div
        className={`p-3 sm:p-4 rounded-xl ${color} mb-4 sm:mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 text-gray-900">
        <CountUp end={value} suffix={suffix} />
      </h3>
      <p className="text-gray-600 font-medium">{title}</p>
      <div
        className={`absolute bottom-0 left-0 w-full h-1 ${color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
      ></div>
    </div>
  );
};

export default function StatisticsSection({ id }) {
  return (
    <section
      id={id}
      className="w-full py-16 sm:py-20 md:py-24 relative bg-gradient-to-b from-white to-gray-100"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full opacity-40"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Trusted by Thousands of Car Buyers
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            We've helped thousands of customers find their perfect vehicle with
            our exceptional service and vast inventory.
          </p>
        </div>

        {/* Statistics Grid - 2x2 on small screens, 4 columns on lg */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          <StatCard
            icon={<Car size={24} className="sm:hidden" />}
            icon={<Car size={32} className="hidden sm:block" />}
            title="Cars for Sale"
            value={12500}
            color="bg-blue-600"
          />
          <StatCard
            icon={<Users size={24} className="sm:hidden" />}
            icon={<Users size={32} className="hidden sm:block" />}
            title="Happy Customers"
            value={9800}
            color="bg-orange-500"
          />
          <StatCard
            icon={<Award size={24} className="sm:hidden" />}
            icon={<Award size={32} className="hidden sm:block" />}
            title="Awards Won"
            value={150}
            color="bg-purple-600"
          />
          <StatCard
            icon={<MapPin size={24} className="sm:hidden" />}
            icon={<MapPin size={32} className="hidden sm:block" />}
            title="Locations"
            value={24}
            color="bg-green-600"
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center">
          <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">
            Join thousands of satisfied customers who found their dream car with
            us
          </p>
          <button className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-colors shadow-lg">
            Browse Our Inventory
          </button>
        </div>
      </div>
    </section>
  );
}
