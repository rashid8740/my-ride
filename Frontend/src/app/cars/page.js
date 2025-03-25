// src/app/cars/[id]/page.js
"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Heart,
  Share2,
  Phone,
  Mail,
  Camera,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Star,
  Calendar,
  MapPin,
  Gauge,
  Fuel,
  TrendingUp,
  Car,
  Users,
  Shield,
  AlertTriangle,
  Clock,
  Info,
  ArrowRight,
  MessageCircle,
  ThumbsUp,
  Zap,
  Truck,
  Key,
  Maximize2,
  RefreshCcw,
  User,
  Award,
  Send,
  Eye,
  Flag,
  CheckCircle,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

// Slider Component
const ImageSlider = ({ images, videos }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeThumb, setActiveThumb] = useState(0);
  const mainSliderRef = useRef(null);
  const thumbSliderRef = useRef(null);

  // Handle navigation
  const goToSlide = (index) => {
    setActiveIndex(index);
    setActiveThumb(index);
  };

  const nextSlide = () => {
    const totalSlides = images.length + (videos?.length || 0);
    setActiveIndex(activeIndex === totalSlides - 1 ? 0 : activeIndex + 1);
    setActiveThumb(activeThumb === totalSlides - 1 ? 0 : activeThumb + 1);
  };

  const prevSlide = () => {
    const totalSlides = images.length + (videos?.length || 0);
    setActiveIndex(activeIndex === 0 ? totalSlides - 1 : activeIndex - 1);
    setActiveThumb(activeThumb === 0 ? totalSlides - 1 : activeThumb - 1);
  };

  return (
    <div className="relative">
      {/* Main Slider */}
      <div
        ref={mainSliderRef}
        className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 mb-2"
      >
        <div className="relative h-[250px] sm:h-[380px] md:h-[450px] lg:h-[500px]">
          {images.map((src, index) => (
            <div
              key={`slide-${index}`}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
                activeIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={src}
                alt={`Vehicle image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {videos &&
            videos.map((video, index) => (
              <div
                key={`video-${index}`}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
                  activeIndex === images.length + index
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0"
                }`}
              >
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white hover:bg-white/30 transition-colors">
                      <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            aria-label="Next image"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>

          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-20 bg-green-500 text-white text-sm font-medium py-1 px-3 rounded">
            Available
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            <Camera size={12} className="inline mr-1" />
            {activeIndex + 1} / {images.length + (videos?.length || 0)}
          </div>
        </div>
      </div>

      {/* Thumbnail Slider */}
      <div ref={thumbSliderRef} className="relative">
        <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
          {images.map((src, index) => (
            <button
              key={`thumb-${index}`}
              onClick={() => goToSlide(index)}
              className={`relative h-14 w-20 sm:h-16 sm:w-24 flex-shrink-0 rounded-md overflow-hidden transition-all ${
                activeThumb === index
                  ? "border-2 border-orange-500 opacity-100"
                  : "border border-gray-200 opacity-80 hover:opacity-100"
              }`}
            >
              <img
                src={src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}

          {videos &&
            videos.map((video, index) => (
              <button
                key={`video-thumb-${index}`}
                onClick={() => goToSlide(images.length + index)}
                className={`relative h-14 w-20 sm:h-16 sm:w-24 flex-shrink-0 rounded-md overflow-hidden transition-all ${
                  activeThumb === images.length + index
                    ? "border-2 border-orange-500 opacity-100"
                    : "border border-gray-200 opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={video.thumbnail}
                  alt={`Video thumbnail`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// Star Rating Component
const StarRating = ({ rating, showValue = true, size = "default" }) => {
  const starSize = size === "small" ? 14 : size === "large" ? 20 : 16;
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={starSize}
          className={`${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : i < rating
              ? "text-yellow-400 fill-yellow-400 opacity-60"
              : "text-gray-300"
          } ${size === "small" ? "mr-0.5" : "mr-1"}`}
        />
      ))}
      {showValue && (
        <span
          className={`text-gray-700 ml-1 ${size === "small" ? "text-xs" : ""}`}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Feature Item Component
const FeatureItem = ({ children }) => {
  return (
    <div className="flex items-center space-x-2 py-1.5">
      <Check size={18} className="text-green-500 flex-shrink-0" />
      <span className="text-gray-700 text-sm">{children}</span>
    </div>
  );
};

// Key Spec Item Component
const KeySpecItem = ({ icon, label, value }) => {
  return (
    <div className="flex flex-col items-center text-center bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-all">
      <div className="bg-orange-50 text-orange-500 p-3 rounded-full mb-3">
        {icon}
      </div>
      <div className="font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
};

// Spec Item Component
const SpecItem = ({ label, value }) => {
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
};

// Tab Component
const Tab = ({ active, label, onClick, count }) => {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-4 font-medium text-sm transition-colors relative whitespace-nowrap ${
        active
          ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500"
          : "text-gray-600 hover:text-gray-800"
      }`}
    >
      {label}
      {count && (
        <span className="ml-1.5 text-xs bg-gray-100 text-gray-700 py-0.5 px-1.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
};

// Feature Badge Component
const FeatureBadge = ({ children }) => {
  return (
    <div className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-xs font-medium">
      {children}
    </div>
  );
};

// Similar Car Card Component
const SimilarCarCard = ({ car }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md group transition-all duration-300">
      {/* Car Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-white font-semibold mb-1 drop-shadow-sm">
                {car.title}
              </h3>
              <div className="flex items-center">
                <span className="text-orange-500 font-bold bg-white/90 rounded-lg py-0.5 px-2 text-sm shadow-sm">
                  ${car.price}
                </span>
              </div>
            </div>
            <div className="flex space-x-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors">
                <Heart size={16} className="text-white" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors">
                <Share2 size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Car Details */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Gauge size={14} className="text-orange-500" />
            <span>{car.mileage}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel size={14} className="text-orange-500" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-orange-500" />
            <span>5 Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-orange-500" />
            <span>{car.year}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <Link
            href={`/cars/${car.id}`}
            className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center group"
          >
            View Details
            <ChevronRight
              size={16}
              className="ml-1 group-hover:ml-2 transition-all"
            />
          </Link>
          <span className="text-xs text-gray-500">3 days ago</span>
        </div>
      </div>
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => {
  return (
    <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm">
      <div className="flex items-start">
        <img
          src={review.avatar}
          alt={review.name}
          className="h-12 w-12 rounded-full mr-4 object-cover border border-gray-200"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-gray-900">{review.name}</h4>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
          <StarRating rating={review.rating} size="small" />
          <p className="text-gray-700 my-3 text-sm leading-relaxed">
            {review.comment}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <button className="flex items-center hover:text-orange-500 transition-colors">
              <ThumbsUp size={14} className="mr-1" />
              Helpful ({review.helpful})
            </button>
            <span className="mx-2">•</span>
            <button className="flex items-center hover:text-orange-500 transition-colors">
              <MessageCircle size={14} className="mr-1" />
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inspection Report Card
const InspectionReportCard = ({ title, status, description }) => {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-start">
        <div
          className={`p-2 rounded-full mr-3 ${
            status === "pass"
              ? "bg-green-100 text-green-500"
              : status === "warning"
              ? "bg-yellow-100 text-yellow-500"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {status === "pass" ? (
            <Check size={18} />
          ) : status === "warning" ? (
            <AlertTriangle size={18} />
          ) : (
            <Info size={18} />
          )}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Calculator Component
const PaymentCalculator = ({ price }) => {
  const [downPayment, setDownPayment] = useState(5000);
  const [term, setTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(4.5);

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const principal = parseFloat(price.replace(/,/g, "")) - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const termMonths = parseInt(term);

    if (principal <= 0 || monthlyRate === 0 || termMonths === 0) return 0;

    const x = Math.pow(1 + monthlyRate, termMonths);
    const monthly = (principal * x * monthlyRate) / (x - 1);

    return monthly.toFixed(2);
  };

  const monthlyPayment = calculateMonthlyPayment();

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg text-gray-900 mb-4">
        Payment Calculator
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Down Payment
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            $
          </span>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full pl-8 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Loan Term
        </label>
        <select
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="36">36 months (3 years)</option>
          <option value="48">48 months (4 years)</option>
          <option value="60">60 months (5 years)</option>
          <option value="72">72 months (6 years)</option>
          <option value="84">84 months (7 years)</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Interest Rate (%)
        </label>
        <div className="relative">
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            min="0"
            max="20"
            step="0.1"
            className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            %
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-4">
        <span className="text-gray-700 font-medium">Monthly Payment:</span>
        <span className="text-orange-500 font-bold text-xl">
          ${monthlyPayment}
        </span>
      </div>

      <div className="text-xs text-gray-500 text-center">
        This calculator is for estimation purposes only. Contact us for accurate
        payment details.
      </div>
    </div>
  );
};

export default function CarDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);

  // Mock data - In a real app, you would fetch this from an API
  const mockCarData = {
    id: params.id,
    title: "2023 Mercedes-Benz EQS 580 4MATIC Sedan",
    description:
      "Experience the future of luxury electric vehicles with the 2023 Mercedes-Benz EQS 580. This flagship electric sedan combines cutting-edge technology, exceptional comfort, and impressive performance in a sleek, aerodynamic package. With Dual Electric Motors and 4MATIC All-Wheel Drive, the EQS delivers instant torque and confident handling in all conditions.",
    price: "134,500",
    msrp: "148,950",
    discount: "14,450",
    year: "2023",
    make: "Mercedes-Benz",
    model: "EQS 580",
    trim: "4MATIC Sedan",
    mileage: "2,847 miles",
    vin: "WMZ7E7YB1NJ123456",
    stock: "MB32547",
    exterior: "Obsidian Black Metallic",
    interior: "Neva Grey/Balao Brown Nappa Leather",
    fuel: "Electric",
    battery: "107.8 kWh",
    range: "340 miles",
    charging: "Up to 200kW DC Fast Charging",
    transmission: "Single-Speed Automatic",
    drivetrain: "All-Wheel Drive (4MATIC)",
    engine: "Dual Permanent Magnet Synchronous Motors",
    horsepower: "516 hp",
    torque: "631 lb-ft",
    efficiency: "89 MPGe combined",
    bodyType: "Sedan",
    doors: "4",
    seating: "5",
    warranty: "4-Year/50,000-Mile Basic, 10-Year/155,000-Mile Battery",
    location: "Miami, FL",
    dealership: "Mercedes-Benz of Miami",
    dealershipPhone: "+1 (305) 555-7890",
    dealershipEmail: "sales@mbmiami.com",
    dealershipLogo: "https://randomuser.me/api/portraits/men/32.jpg",
    dealershipRating: 4.8,
    dealershipReviews: 236,
    dealershipResponse: "Usually responds within 30 minutes",
    status: "Available",
    carfaxReport: true,
    serviceHistory: true,
    ownershipHistory: "1 Owner, No Accidents",
    features: [
      "MBUX Hyperscreen with 56-inch Curved Display",
      "Burmester® 3D Surround Sound System",
      "Active Ambient Lighting",
      "Head-Up Display",
      "Augmented Reality Navigation",
      "Energizing Comfort Package",
      "Driver Assistance Package",
      "4-Zone Climate Control",
      "Ventilated & Heated Front Seats with Massage",
      "Panoramic Sunroof",
      "Power Rear Sunshade",
      "21-inch AMG Multi-Spoke Wheels",
      "Adaptive Air Suspension",
      "Rear-Axle Steering",
      "Digital Light Headlamps",
      "Wireless Charging",
      "Apple CarPlay & Android Auto",
    ],
    images: [
      "https://images.unsplash.com/photo-1622096242427-e22e5a6f8fcf?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1639250517155-b8fb3bf1f051?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1669214248843-ebc1e82f8f88?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1669214275000-633794e47f43?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618843479291-26e4c63e14af?q=80&w=1920&auto=format&fit=crop",
    ],
    videos: [
      {
        thumbnail:
          "https://images.unsplash.com/photo-1582639510494-c80b5de9f148?q=80&w=1920&auto=format&fit=crop",
        title: "Mercedes EQS 580 Review",
        duration: "12:35",
      },
    ],
    reviews: [
      {
        name: "James Wilson",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        date: "January 15, 2025",
        rating: 5,
        comment:
          "The EQS is a technological masterpiece. The Hyperscreen is mind-blowing and the ride quality is exceptional. Electric range is impressive even in cold weather conditions.",
        helpful: 14,
      },
      {
        name: "Sarah Chen",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        date: "December 3, 2024",
        rating: 4,
        comment:
          "Coming from a Tesla Model S, the build quality and luxury features of the EQS are on another level. The only downside is the charging network isn't as extensive, but the car itself is amazing.",
        helpful: 8,
      },
      {
        name: "Robert Taylor",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        date: "November 18, 2024",
        rating: 5,
        comment:
          "This is my first EV and I'm blown away. The silence, the acceleration, and the tech features make every drive special. The dealership experience was also top-notch.",
        helpful: 5,
      },
    ],
    inspectionReport: [
      {
        title: "Exterior Condition",
        status: "pass",
        description:
          "No visible damages, scratches or dents. Paint is in excellent condition.",
      },
      {
        title: "Interior Condition",
        status: "pass",
        description:
          "Interior is pristine. All controls and features working as expected.",
      },
      {
        title: "Battery Health",
        status: "pass",
        description: "Battery shows 99% health, charging to full capacity.",
      },
      {
        title: "Electrical Systems",
        status: "pass",
        description:
          "All electrical components and systems functioning properly.",
      },
      {
        title: "Suspension & Steering",
        status: "warning",
        description:
          "Minor alignment adjustment recommended for optimal performance.",
      },
      {
        title: "Tires & Brakes",
        status: "pass",
        description:
          "Tires show minimal wear. Brake pads and rotors in excellent condition.",
      },
    ],
    similarCars: [
      {
        id: 101,
        title: "2023 Tesla Model S Plaid",
        price: "122,900",
        year: "2023",
        mileage: "5,432 miles",
        fuel: "Electric",
        image:
          "https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 102,
        title: "2022 Porsche Taycan Turbo S",
        price: "149,500",
        year: "2022",
        mileage: "8,761 miles",
        fuel: "Electric",
        image:
          "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 103,
        title: "2023 Lucid Air Grand Touring",
        price: "141,200",
        year: "2023",
        mileage: "1,987 miles",
        fuel: "Electric",
        image:
          "https://images.unsplash.com/photo-1607454163781-9c8e50f6916a?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 104,
        title: "2023 Audi e-tron GT RS",
        price: "145,900",
        year: "2023",
        mileage: "3,542 miles",
        fuel: "Electric",
        image:
          "https://images.unsplash.com/photo-1608549297202-80692d11b3bc?q=80&w=800&auto=format&fit=crop",
      },
    ],
  };

  // Simulate data fetching
  useEffect(() => {
    setTimeout(() => {
      setCar(mockCarData);
      setLoading(false);
    }, 800);
  }, [params.id]);

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    alert("Inquiry submitted successfully!");
    setInquiryForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  // If loading, show skeleton loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-6"></div>
            <div className="flex space-x-4 mb-8 overflow-x-auto">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 w-24 bg-gray-200 rounded flex-shrink-0"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Car Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The car you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/inventory"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Browse Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Breadcrumbs - Fixed position below navbar */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500">
              Home
            </Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <Link
              href="/inventory"
              className="text-gray-500 hover:text-orange-500"
            >
              Inventory
            </Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <Link
              href={`/inventory/${car.make.toLowerCase()}`}
              className="text-gray-500 hover:text-orange-500"
            >
              {car.make}
            </Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">{car.model}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Title Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {car.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
              <div className="flex items-center">
                <MapPin size={16} className="text-orange-500 mr-1" />
                <span className="text-gray-600 text-sm">{car.location}</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center">
                <Calendar size={16} className="text-orange-500 mr-1" />
                <span className="text-gray-600 text-sm">Listed 3 days ago</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center">
                <Eye size={16} className="text-orange-500 mr-1" />
                <span className="text-gray-600 text-sm">325 views</span>
              </div>
            </div>
            <div className="flex items-center">
              <StarRating rating={4.8} size="small" />
              <span className="text-gray-500 text-sm ml-1">(28 Reviews)</span>
            </div>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center gap-2">
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-colors">
              <Heart size={18} className="text-orange-500" />
              <span className="font-medium">Save</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-colors">
              <Share2 size={18} className="text-orange-500" />
              <span className="font-medium">Share</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-colors">
              <Flag size={18} className="text-orange-500" />
              <span className="font-medium">Report</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Car Gallery & Details */}
          <div className="lg:col-span-2">
            {/* Car Gallery */}
            <ImageSlider images={car.images} videos={car.videos} />

            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl shadow-sm mt-6 mb-6 sticky top-20 z-30">
              <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100">
                <Tab
                  active={activeTab === "overview"}
                  label="Overview"
                  onClick={() => setActiveTab("overview")}
                />
                <Tab
                  active={activeTab === "features"}
                  label="Features & Specs"
                  onClick={() => setActiveTab("features")}
                />
                <Tab
                  active={activeTab === "inspection"}
                  label="Inspection"
                  onClick={() => setActiveTab("inspection")}
                />
                <Tab
                  active={activeTab === "reviews"}
                  label="Reviews"
                  count={car.reviews.length}
                  onClick={() => setActiveTab("reviews")}
                />
                <Tab
                  active={activeTab === "calculator"}
                  label="Calculator"
                  onClick={() => setActiveTab("calculator")}
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Description */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Info size={20} className="text-orange-500 mr-2" />
                      About This {car.make} {car.model}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {car.description}
                    </p>
                  </div>

                  {/* Key Specifications */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Zap size={20} className="text-orange-500 mr-2" />
                      Key Specifications
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <KeySpecItem
                        icon={<Gauge size={22} />}
                        label="Mileage"
                        value={car.mileage}
                      />
                      <KeySpecItem
                        icon={<Calendar size={22} />}
                        label="Year"
                        value={car.year}
                      />
                      <KeySpecItem
                        icon={<Fuel size={22} />}
                        label="Fuel Type"
                        value={car.fuel}
                      />
                      <KeySpecItem
                        icon={<Truck size={22} />}
                        label="Transmission"
                        value={car.transmission}
                      />
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Key size={20} className="text-orange-500 mr-2" />
                      Additional Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      <SpecItem label="Body Style" value={car.bodyType} />
                      <SpecItem label="Exterior Color" value={car.exterior} />
                      <SpecItem label="Interior Color" value={car.interior} />
                      <SpecItem label="VIN" value={car.vin} />
                      <SpecItem label="Engine" value={car.engine} />
                      <SpecItem label="Drivetrain" value={car.drivetrain} />
                      <SpecItem label="Horsepower" value={car.horsepower} />
                      <SpecItem label="Torque" value={car.torque} />
                      <SpecItem label="Battery Capacity" value={car.battery} />
                      <SpecItem label="Range" value={car.range} />
                      <SpecItem label="Charging" value={car.charging} />
                      <SpecItem label="Efficiency" value={car.efficiency} />
                    </div>
                  </div>

                  {/* Vehicle Status */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Shield size={20} className="text-orange-500 mr-2" />
                      Vehicle Status
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-4 flex items-center">
                        <CheckCircle
                          size={36}
                          className="text-green-500 mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Clean Title
                          </h3>
                          <p className="text-xs text-gray-600">
                            No accidents or damages reported
                          </p>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 flex items-center">
                        <CheckCircle
                          size={36}
                          className="text-green-500 mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            One Owner
                          </h3>
                          <p className="text-xs text-gray-600">
                            Personal use only
                          </p>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 flex items-center">
                        <CheckCircle
                          size={36}
                          className="text-green-500 mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Service History
                          </h3>
                          <p className="text-xs text-gray-600">
                            Complete maintenance records available
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlighted Features */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Award size={20} className="text-orange-500 mr-2" />
                      Highlighted Features
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {car.features.slice(0, 6).map((feature, index) => (
                        <FeatureBadge key={index}>{feature}</FeatureBadge>
                      ))}
                      {car.features.length > 6 && (
                        <FeatureBadge>
                          +{car.features.length - 6} more
                        </FeatureBadge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      {car.features.slice(0, 8).map((feature, index) => (
                        <FeatureItem key={index}>{feature}</FeatureItem>
                      ))}
                    </div>

                    {car.features.length > 8 && (
                      <button className="w-full mt-4 text-orange-500 hover:text-orange-600 font-medium flex items-center justify-center">
                        <span>Show All Features</span>
                        <ChevronDown size={16} className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === "features" && (
                <div className="space-y-6">
                  {/* All Features */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Award size={20} className="text-orange-500 mr-2" />
                      All Features & Options
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      {car.features.map((feature, index) => (
                        <FeatureItem key={index}>{feature}</FeatureItem>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Specifications */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Maximize2 size={20} className="text-orange-500 mr-2" />
                      Detailed Specifications
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                          Dimensions & Capacities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                          <SpecItem label="Length" value="207.3 in" />
                          <SpecItem label="Width" value="75.8 in" />
                          <SpecItem label="Height" value="59.5 in" />
                          <SpecItem label="Wheelbase" value="126.4 in" />
                          <SpecItem label="Cargo Space" value="22.0 cu ft" />
                          <SpecItem label="Curb Weight" value="5,888 lbs" />
                          <SpecItem
                            label="Seating Capacity"
                            value={car.seating}
                          />
                          <SpecItem label="Doors" value={car.doors} />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                          Performance
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                          <SpecItem label="0-60 mph" value="4.1 sec" />
                          <SpecItem
                            label="Top Speed"
                            value="130 mph (limited)"
                          />
                          <SpecItem label="Horsepower" value={car.horsepower} />
                          <SpecItem label="Torque" value={car.torque} />
                          <SpecItem
                            label="Motor Type"
                            value="Dual Permanent Magnet"
                          />
                          <SpecItem label="Drivetrain" value={car.drivetrain} />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                          Electric System
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                          <SpecItem
                            label="Battery Capacity"
                            value={car.battery}
                          />
                          <SpecItem label="Range" value={car.range} />
                          <SpecItem
                            label="Fast Charging"
                            value={car.charging}
                          />
                          <SpecItem label="Onboard Charger" value="11 kW" />
                          <SpecItem
                            label="Charging Time (10%-80%)"
                            value="31 min (DC Fast)"
                          />
                          <SpecItem label="Efficiency" value={car.efficiency} />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                          Safety & Warranty
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                          <SpecItem
                            label="NHTSA Rating"
                            value="5-Star Overall"
                          />
                          <SpecItem
                            label="Driver Assistance"
                            value="Level 2+"
                          />
                          <SpecItem label="Airbags" value="10 Total" />
                          <SpecItem
                            label="Basic Warranty"
                            value="4-Year/50,000-Mile"
                          />
                          <SpecItem
                            label="Battery Warranty"
                            value="10-Year/155,000-Mile"
                          />
                          <SpecItem
                            label="Roadside Assistance"
                            value="4-Year/50,000-Mile"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Inspection Tab */}
              {activeTab === "inspection" && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Shield size={20} className="text-orange-500 mr-2" />
                      151-Point Inspection Results
                    </h2>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      Passed
                    </span>
                  </div>

                  <p className="text-gray-700 mb-6">
                    This vehicle has undergone our comprehensive 151-point
                    inspection to ensure it meets our quality standards. Below
                    are the results from key inspection areas:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {car.inspectionReport.map((item, index) => (
                      <InspectionReportCard
                        key={index}
                        title={item.title}
                        status={item.status}
                        description={item.description}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                      <span>Download Full Inspection Report</span>
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                    {car.carfaxReport && (
                      <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                        <span>View CARFAX Report</span>
                        <ArrowRight size={16} className="ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <MessageCircle
                          size={20}
                          className="text-orange-500 mr-2"
                        />
                        Customer Reviews
                      </h2>
                      <div className="flex items-center mt-1">
                        <StarRating rating={4.8} size="default" />
                        <span className="text-gray-500 ml-2">
                          Based on {car.reviews.length} reviews
                        </span>
                      </div>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                      <span>Write a Review</span>
                      <Star size={16} className="ml-2" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {car.reviews.map((review, index) => (
                      <ReviewCard key={index} review={review} />
                    ))}
                  </div>
                </div>
              )}

              {/* Calculator Tab */}
              {activeTab === "calculator" && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <RefreshCcw size={20} className="text-orange-500 mr-2" />
                    Payment Calculator
                  </h2>

                  <PaymentCalculator price={car.price} />
                </div>
              )}
            </div>

            {/* Similar Cars Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Similar Vehicles
                </h2>
                <Link
                  href="/inventory"
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center group"
                >
                  View All{" "}
                  <ChevronRight
                    size={16}
                    className="ml-1 group-hover:ml-2 transition-all"
                  />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {car.similarCars.map((similarCar) => (
                  <SimilarCarCard key={similarCar.id} car={similarCar} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Contact */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {car.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    Stock# {car.stock}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    ${car.price}
                  </span>
                  {car.discount && (
                    <span className="ml-2 text-sm text-green-600 font-medium">
                      Save ${car.discount}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline">
                  <span className="text-sm text-gray-500">MSRP:</span>
                  <span className="ml-1 text-gray-500 line-through">
                    ${car.msrp}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Excludes taxes, title, and registration fees
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Est. payment</div>
                  <div className="text-gray-900 font-bold text-lg">
                    $1,785/mo
                  </div>
                  <div className="text-xs text-gray-500">60 mos, 4.9% APR</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Mileage</div>
                  <div className="text-gray-900 font-bold text-lg">
                    {car.mileage}
                  </div>
                  <div className="text-xs text-gray-500">Below Average</div>
                </div>
              </div>

              <div className="flex flex-col space-y-3 mb-4">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm">
                  Schedule Test Drive
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm">
                  Apply for Financing
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors">
                  Make an Offer
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setActiveTab("calculator")}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  Calculate your payment
                </button>
              </div>
            </div>

            {/* Dealership Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <img
                    src={car.dealershipLogo}
                    alt={car.dealership}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {car.dealership}
                  </h3>
                  <div className="flex items-center text-sm">
                    <StarRating
                      rating={car.dealershipRating}
                      size="small"
                      showValue={false}
                    />
                    <span className="ml-1 text-gray-500">
                      {car.dealershipRating} ({car.dealershipReviews})
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-700 mb-4">
                <p className="flex items-center mb-2">
                  <Clock size={16} className="mr-2 text-orange-500" />
                  {car.dealershipResponse}
                </p>
                <p className="flex items-center mb-2">
                  <MapPin size={16} className="mr-2 text-orange-500" />
                  {car.location}
                </p>
                <p className="flex items-center">
                  <Phone size={16} className="mr-2 text-orange-500" />
                  {car.dealershipPhone}
                </p>
              </div>

              <div className="flex space-x-2 mb-4">
                <a
                  href={`tel:${car.dealershipPhone}`}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Phone size={16} className="mr-2" />
                  Call
                </a>
                <a
                  href={`mailto:${car.dealershipEmail}`}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Mail size={16} className="mr-2" />
                  Email
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <User size={18} className="text-orange-500 mr-2" />
                Request More Information
              </h3>

              <form onSubmit={handleInquirySubmit}>
                <div className="space-y-3 mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={inquiryForm.name}
                      onChange={handleInquiryChange}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={inquiryForm.email}
                      onChange={handleInquiryChange}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={inquiryForm.phone}
                      onChange={handleInquiryChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      placeholder="I'm interested in this Mercedes-Benz EQS 580..."
                      value={inquiryForm.message}
                      onChange={handleInquiryChange}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                >
                  <Send size={18} className="mr-2" />
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Add custom styles for hiding scrollbars while maintaining functionality */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
