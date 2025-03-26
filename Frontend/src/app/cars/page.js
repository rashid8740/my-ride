// src/app/cars/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductHeader from "@/components/product/ProductHeader";
import ProductDetails from "@/components/product/ProductDetails";
import ProductGallery from "@/components/product/ProductGallery";
import ProductActions from "@/components/product/ProductActions";

export default function CarProductPage({ params }) {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data fetch - in a real app, this would be an API call using the params.id
  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      setCar(mockCarData);
      setLoading(false);
    }, 300);
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-orange-200 mb-4"></div>
          <div className="text-gray-500">Loading vehicle details...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 py-3">
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
            <span className="text-gray-900 font-medium truncate">
              {car.title}
            </span>
          </div>
        </div>
      </div>

      {/* Product Header */}
      <ProductHeader car={car} />

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Product Details & Gallery - Left 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            <ProductDetails car={car} />
            <ProductGallery images={car.images} />
          </div>

          {/* Product Actions - Right 1/3 */}
          <div className="lg:col-span-1">
            <ProductActions car={car} />
          </div>
        </div>
      </div>
    </main>
  );
}

// Mock data
const mockCarData = {
  id: "123456",
  title: "2023 Mercedes-Benz E-Class E 350 4MATIC Sedan",
  price: 64995,
  discountedPrice: 61995,
  condition: "Used",
  year: 2023,
  make: "Mercedes-Benz",
  model: "E-Class",
  trim: "E 350 4MATIC",
  bodyType: "Sedan",
  mileage: 12456,
  fuelType: "Gasoline",
  transmission: "9-Speed Automatic",
  drivetrain: "All-Wheel Drive",
  exteriorColor: "Obsidian Black Metallic",
  interiorColor: "Black/Nut Brown",
  vin: "W1KZF8KB7PL123456",
  stockNumber: "MB12345",
  featured: true,
  status: "In Stock",
  location: "Miami, FL",
  description:
    "This well-maintained 2023 Mercedes-Benz E-Class E 350 4MATIC Sedan comes equipped with premium features including a panoramic sunroof, heated leather seats, and the latest MBUX infotainment system. With only 12,456 miles, this luxury sedan offers exceptional value and is in immaculate condition. The classic Obsidian Black Metallic exterior paired with the elegant Black/Nut Brown interior creates a sophisticated aesthetic that stands the test of time.",
  features: [
    "12.3-inch Digital Instrument Cluster",
    "12.3-inch Touchscreen Display",
    "Apple CarPlay & Android Auto",
    "Burmester® Surround Sound System",
    "Panoramic Sunroof",
    "Heated & Ventilated Front Seats",
    "64-Color Ambient Lighting",
    "Wireless Charging",
    "Adaptive Cruise Control",
    "Blind Spot Assist",
    "Lane Keeping Assist",
    "Parking Assist with Surround View Camera",
    "Head-Up Display",
    "Keyless Go",
    "Power Trunk Lid",
    "LED Intelligent Light System",
    "AMG Line Exterior Package",
    "19-inch AMG 5-Twin-Spoke Wheels",
    "Driver Assistance Package",
    "Premium Package",
  ],
  specifications: {
    engine: "2.0L Turbocharged Inline-4",
    horsepower: "255 hp @ 5,800-6,100 rpm",
    torque: "273 lb-ft @ 1,800-4,000 rpm",
    fuelEconomy: "22 city / 30 highway / 25 combined",
    fuelTank: "17.4 gallons",
    acceleration: "0-60 mph in 6.1 seconds",
    topSpeed: "130 mph (electronically limited)",
    length: "194.3 inches",
    width: "81.3 inches (with mirrors)",
    height: "57.8 inches",
    wheelbase: "115.7 inches",
    groundClearance: "4.1 inches",
    cargoCapacity: "13.1 cubic feet",
    seatingCapacity: "5 passengers",
    weight: "3,891 lbs",
  },
  images: [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=1920&auto=format&fit=crop",
      alt: "Mercedes-Benz E-Class Front",
      type: "exterior",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?q=80&w=1920&auto=format&fit=crop",
      alt: "Mercedes-Benz E-Class Side",
      type: "exterior",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1920&auto=format&fit=crop",
      alt: "Mercedes-Benz E-Class Rear",
      type: "exterior",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1601071566572-5c5172f06ab4?q=80&w=1920&auto=format&fit=crop",
      alt: "Mercedes-Benz E-Class Interior Dashboard",
      type: "interior",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop",
      alt: "Mercedes-Benz E-Class Interior Seats",
      type: "interior",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1583267746897-2cf415887172?q=80&w=1920&auto=format&fit=crop",
      alt: "Mercedes-Benz E-Class Wheels",
      type: "exterior",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1593460354736-1350ee6e2853?q=80&w=1920&auto=format&fit=crop",
      alt: "Mercedes-Benz E-Class Engine",
      type: "mechanical",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1606664982731-8ad057dee169?q=80&w=1920&auto=format&fit=crop",
      alt: "Mercedes-Benz E-Class Tech Features",
      type: "interior",
    },
  ],
  similarVehicles: [
    {
      id: 101,
      title: "2023 BMW 5 Series 530i xDrive",
      price: 62500,
      mileage: 9876,
      image:
        "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 102,
      title: "2023 Audi A6 Premium Plus quattro",
      price: 59900,
      mileage: 11250,
      image:
        "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 103,
      title: "2022 Lexus ES 350 F Sport",
      price: 52800,
      mileage: 14325,
      image:
        "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=800&auto=format&fit=crop",
    },
  ],
};
