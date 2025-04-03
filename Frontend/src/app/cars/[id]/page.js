"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  ChevronRight, 
  Heart,
  Phone,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Check,
  MapPin,
  AlertCircle,
  ArrowLeft,
  Tag,
  Share2,
  Star,
  ChevronLeft,
  ArrowUpRight,
  MoveLeft,
  MoveRight,
  Users,
  CarFront,
  Shield,
  X,
  ArrowRight
} from "lucide-react";
import { cars } from "@/app/inventory/data";
import { toast } from "react-hot-toast";
import { useFavorites } from "@/utils/FavoritesContext";

// Gallery component for car images
const CarGallery = ({ images, mainImage, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Use the main image and create additional fake images for the gallery
  const allImages = [
    mainImage, 
    mainImage.replace('?q=80&w=800', '?q=80&w=801'),
    mainImage.replace('?q=80&w=800', '?q=80&w=802'),
    mainImage.replace('?q=80&w=800', '?q=80&w=803'),
    mainImage.replace('?q=80&w=800', '?q=80&w=804')
  ];
  
  const nextSlide = () => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      {isFullscreen && (
        <button 
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full"
        >
          <X size={24} />
        </button>
      )}
      
      {/* Main image */}
      <div className={`relative overflow-hidden ${isFullscreen ? 'h-screen' : 'h-[300px] sm:h-[400px] md:h-[500px] rounded-t-xl lg:rounded-tr-none lg:rounded-l-xl'}`}>
        <div className="absolute inset-0 flex">
          {allImages.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-500 ${idx === activeIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={img}
                alt={`${title} - Image ${idx + 1}`}
                className={`w-full h-full object-cover ${isFullscreen ? 'object-contain' : 'object-cover'}`}
                onClick={toggleFullscreen}
              />
            </div>
          ))}
        </div>
        
        {/* Slider controls */}
        {!isFullscreen && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        
        {/* Fullscreen controls */}
        {isFullscreen && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-10">
            <button
              onClick={prevSlide}
              className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <MoveLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
              aria-label="Next image"
            >
              <MoveRight size={24} />
            </button>
          </div>
        )}
        
        {/* Thumbnail indicator */}
        {!isFullscreen && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeIndex 
                    ? 'bg-white w-4' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Zoom/Fullscreen button */}
        {!isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-md flex items-center transition-colors z-10"
            aria-label="View fullscreen"
          >
            <ArrowUpRight size={16} className="mr-1" />
            <span className="text-xs font-medium">Enlarge</span>
          </button>
        )}
      </div>
      
      {/* Thumbnails */}
      {!isFullscreen && (
        <div className="flex mt-2 gap-2 px-2 overflow-x-auto pb-2 lg:px-0">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition ${
                idx === activeIndex ? 'border-orange-500' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CarDetailPage = ({ params }) => {
  const { id } = params;
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "I'm interested in this vehicle. Please contact me."
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  const { toggleFavorite, isFavorite, isAuthenticated } = useFavorites();

  // Fetch car data from our sample data until backend is working
  useEffect(() => {
    console.log("Fetching car with ID:", id);
    setLoading(true);
    setTimeout(() => {
      const foundCar = cars.find(c => c.id.toString() === id);
      console.log("Found car:", foundCar);
      if (foundCar) {
        setCar(foundCar);
        setError(null);
      } else {
        setError("Car not found. Please check the URL and try again.");
      }
      setLoading(false);
    }, 800);
  }, [id]);
  
  // Check if car is in favorites (for UI state)
  const isCarInFavorites = car ? isFavorite(car.id || Number(id)) : false;

  // Toggle favorite status
  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add favorites");
      return;
    }
    
    try {
      setIsTogglingFavorite(true);
      // Make sure we have a valid ID to add
      const carIdToUse = car.id || Number(params.id);
      console.log("Toggling favorite for car ID:", carIdToUse);
      
      const result = await toggleFavorite(carIdToUse);
      
      if (result.success) {
        // Force a UI update based on the actual current state
        const isFav = isFavorite(carIdToUse);
        if (isFav) {
          toast.success("Added to favorites");
        } else {
          toast.success("Removed from favorites");
        }
      } else {
        toast.error(result.message || "Failed to update favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Something went wrong");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Handle contact form input changes
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (formSubmitting) return;
    
    setFormSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setFormSuccess(true);
      setFormSubmitting(false);
    }, 1000);
  };

  // Dummy car features
  const carFeatures = [
    'Navigation System',
    'Leather Seats',
    'Sunroof',
    'Backup Camera',
    'Bluetooth Connection',
    'Premium Sound System',
    'Heated Seats',
    'Parking Sensors',
    'Lane Departure Warning',
    'Blind Spot Monitor',
    'Apple CarPlay',
    'Android Auto',
    'Keyless Entry',
    'Push Button Start',
    'Climate Control'
  ];

  // Debug why the page is blank
  console.log("Rendering car detail page. Loading:", loading, "Error:", error, "Car:", car);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="animate-pulse">
                {/* Breadcrumb skeleton */}
                <div className="h-10 border-b border-gray-100 px-4 flex items-center">
                  <div className="h-2 w-32 bg-gray-200 rounded"></div>
                </div>
                
                {/* Gallery skeleton */}
                <div className="h-[400px] bg-gray-200"></div>
                
                {/* Content skeleton - two columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Main content */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="h-8 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    
                    <div className="h-40 bg-gray-200 rounded mt-6"></div>
                  </div>
                  
                  {/* Sidebar */}
                  <div className="bg-gray-100 rounded-xl p-4 h-96"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Error Loading Car Details</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link 
                href="/inventory" 
                className="inline-flex items-center px-5 py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to Inventory
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
              <p className="text-gray-600 mb-6">We couldn't find the car you're looking for.</p>
              <Link 
                href="/inventory" 
                className="inline-flex items-center px-5 py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to Inventory
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center text-sm">
              <Link href="/" className="text-gray-500 hover:text-orange-500">
                Home
              </Link>
              <ChevronRight size={14} className="mx-2 text-gray-400" />
              <Link href="/inventory" className="text-gray-500 hover:text-orange-500">
                Inventory
              </Link>
              <ChevronRight size={14} className="mx-2 text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">
                {car.title}
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Left Column - Car Gallery */}
              <div className="lg:col-span-2">
                <CarGallery 
                  mainImage={car.image} 
                  title={car.title} 
                />
              </div>

              {/* Right Column - Car Info & Pricing */}
              <div className="p-6 border-t lg:border-t-0 lg:border-l border-gray-100">
                {/* Status and Favorite */}
                <div className="flex justify-between items-center mb-4">
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Available
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                      aria-label="Share"
                    >
                      <Share2 size={18} />
                    </button>
                    <button
                      onClick={handleFavoriteToggle}
                      className={`p-2 rounded-full transition-colors ${
                        isCarInFavorites
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                      disabled={isTogglingFavorite}
                      aria-label={isCarInFavorites ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart size={18} fill={isCarInFavorites ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
                
                {/* Car title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {car.title}
                </h1>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin size={14} className="mr-1" />
                  <span>Brooklyn, NY</span>
                </div>
                
                {/* Pricing */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="text-3xl text-orange-500 font-bold">
                    ${car.price}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Est. ${parseInt(car.price.replace(/,/g, '')) / 48}/mo for 48 months
                  </div>
                </div>
                
                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex flex-col px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500">Year</span>
                    <span className="font-medium text-gray-900">{car.year}</span>
                  </div>
                  <div className="flex flex-col px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500">Mileage</span>
                    <span className="font-medium text-gray-900">{car.mileage}</span>
                  </div>
                  <div className="flex flex-col px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500">Fuel</span>
                    <span className="font-medium text-gray-900">{car.fuel}</span>
                  </div>
                  <div className="flex flex-col px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500">Transmission</span>
                    <span className="font-medium text-gray-900">{car.transmission}</span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="space-y-3">
                  <a 
                    href="#contact-form" 
                    className="block w-full py-3 px-4 bg-orange-500 text-white font-medium text-center rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Contact Seller
                  </a>
                  
                  <button 
                    className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    (123) 456-7890
                  </button>
                </div>
                
                {/* Seller info */}
                <div className="border-t border-gray-100 mt-6 pt-5">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-3">
                      <Users size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">MyRide Dealership</div>
                      <div className="text-sm text-gray-500">Verified Seller</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Overview Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Vehicle Overview</h2>
            <p className="text-gray-600 mb-6">
              This {car.year} {car.title} comes with a clean history, excellent condition, and low mileage. 
              It features premium {car.category.toLowerCase()} styling, advanced technology, and exceptional performance.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center mb-3 text-orange-500">
                  <CarFront size={20} className="mr-2" />
                  <h3 className="font-semibold">Exterior</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Sleek design with premium finishes and attention to detail. Features LED lighting and alloy wheels.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center mb-3 text-orange-500">
                  <Users size={20} className="mr-2" />
                  <h3 className="font-semibold">Interior</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Spacious cabin with premium materials, comfortable seating, and intuitive controls.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center mb-3 text-orange-500">
                  <Shield size={20} className="mr-2" />
                  <h3 className="font-semibold">Safety</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Comprehensive safety features including multiple airbags, stability control, and driver assistance.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start">
              <div className="text-blue-500 mr-3 mt-1">
                <Star fill="currentColor" size={20} />
              </div>
              <div>
                <h3 className="text-blue-800 font-medium mb-1">Why This Car Stands Out</h3>
                <p className="text-blue-700 text-sm">
                  This particular model features an excellent combination of performance, efficiency, and technology. The car has been properly maintained and offers exceptional value.
                </p>
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Vehicle Features</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-orange-500">
                  <Shield className="h-5 w-5 mr-2" />
                  Safety Features
                </h3>
                <ul className="space-y-2">
                  {carFeatures.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-orange-500">
                  <Settings className="h-5 w-5 mr-2" />
                  Technology
                </h3>
                <ul className="space-y-2">
                  {carFeatures.slice(5, 10).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-orange-500">
                  <Users className="h-5 w-5 mr-2" />
                  Comfort
                </h3>
                <ul className="space-y-2">
                  {carFeatures.slice(10, 15).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Specifications Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Vehicle Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200 flex items-center text-orange-500">
                  <Gauge className="h-5 w-5 mr-2" />
                  Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Engine</div>
                    <div className="font-medium text-gray-900">2.0L Turbo</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Horsepower</div>
                    <div className="font-medium text-gray-900">248 hp</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Torque</div>
                    <div className="font-medium text-gray-900">258 lb-ft</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Transmission</div>
                    <div className="font-medium text-gray-900">{car.transmission}</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Drivetrain</div>
                    <div className="font-medium text-gray-900">All-Wheel Drive</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200 flex items-center text-orange-500">
                  <CarFront className="h-5 w-5 mr-2" />
                  Dimensions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Length</div>
                    <div className="font-medium text-gray-900">185.7 in</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Width</div>
                    <div className="font-medium text-gray-900">74.4 in</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Height</div>
                    <div className="font-medium text-gray-900">65.3 in</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Cargo Capacity</div>
                    <div className="font-medium text-gray-900">28.7 cu ft</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Fuel Capacity</div>
                    <div className="font-medium text-gray-900">17.7 gal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Similar cars section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100 flex justify-between items-center">
              <span>You Might Also Like</span>
              <Link href="/inventory" className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center">
                View more <ArrowRight size={16} className="ml-1" />
              </Link>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {cars.filter(c => c.id !== car.id).slice(0, 3).map(similarCar => (
                <div key={similarCar.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={similarCar.image}
                      alt={similarCar.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {similarCar.year}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {similarCar.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Gauge className="h-4 w-4" />
                        <span>{similarCar.mileage}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="h-4 w-4" />
                        <span>{similarCar.transmission}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div className="text-orange-500 font-bold text-lg">
                        ${similarCar.price}
                      </div>
                      <Link 
                        href={`/cars/${similarCar.id}`}
                        className="text-sm font-medium bg-orange-50 text-orange-600 px-3 py-1 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Contact Form - moved to bottom */}
          <div id="contact-form" className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Interested in this {car.title}?</h2>
            
            {formSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-medium text-green-800 text-lg mb-2">Inquiry Sent Successfully!</h3>
                <p className="text-green-700 mb-4">We'll get back to you soon regarding this vehicle.</p>
                <button 
                  onClick={() => setFormSuccess(false)}
                  className="px-4 py-2 bg-white border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={contactForm.name}
                      onChange={handleContactInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={contactForm.email}
                      onChange={handleContactInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Your message"
                  ></textarea>
                </div>
                
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formError}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className={`w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors ${
                    formSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {formSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
                
                <p className="text-xs text-center text-gray-500 mt-2">
                  By submitting this form, you agree to our <a href="#" className="text-orange-500 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Custom styling */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <Footer />
    </div>
  );
};

export default CarDetailPage;