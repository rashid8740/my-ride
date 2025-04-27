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
  ArrowRight,
  Car,
  Maximize2,
  Minimize2
} from "lucide-react";
import { cars } from "@/app/inventory/data";
import { toast } from "react-hot-toast";
import { useFavorites } from "@/utils/FavoritesContext";
import apiService from "@/utils/api";
import Image from "next/image";

// Gallery component for car images
const CarGallery = ({ car, title, mainImage }) => {
  const [activeImage, setActiveImage] = useState(mainImage);
  const [fitMode, setFitMode] = useState('cover');
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Handle image fit toggle
  const toggleFitMode = () => {
    setFitMode(prev => prev === 'contain' ? 'cover' : 'contain');
  };
  
  // Handle image zoom toggle
  const toggleZoom = () => {
    setIsZoomed(prev => !prev);
  };
  
  useEffect(() => {
    if (mainImage) {
      setActiveImage(mainImage);
    } else if (car && car.processedImages && car.processedImages.length > 0) {
      setActiveImage(car.processedImages[0].url);
    } else if (car && car.images && car.images.length > 0) {
      // Handle various image formats
      const firstImage = car.images[0];
      if (typeof firstImage === 'string') {
        setActiveImage(firstImage);
      } else if (firstImage && firstImage.url) {
        setActiveImage(firstImage.url);
      }
    }
  }, [mainImage, car]);
  
  // Debug what images are available
  useEffect(() => {
    if (car) {
      console.log("CarGallery - Images available:", {
    mainImage, 
        processedImages: car.processedImages || [],
        images: car.images || [],
        image: car.image
      });
    }
  }, [car, mainImage]);
  
  if (!car) return null;
  
  // Initialize displayImages
  let displayImages = [];
  
  if (car.processedImages && car.processedImages.length > 0) {
    displayImages = car.processedImages;
  } else if (car.images && car.images.length > 0) {
    displayImages = car.images.map(img => {
      if (typeof img === 'string') return { url: img };
      return img;
    });
  } else if (car.image) {
    displayImages = [{ url: car.image }];
  }
  
  const hasMultipleImages = displayImages.length > 1;
  
  return (
    <div className="rounded-lg overflow-hidden bg-white border border-gray-200 w-full h-full">
      <div className="h-[550px] bg-gray-100 relative">
        {activeImage ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <img
              src={activeImage}
              alt={title || "Car image"}
              className={`car-gallery-image ${fitMode === 'cover' ? 'image-cover' : 'image-contain'} ${isZoomed ? 'zoomed' : ''}`}
              onClick={toggleZoom}
            />
            
            {/* Image Controls */}
            <div className="image-controls">
              <button 
                onClick={toggleFitMode} 
                className="p-2 rounded-md hover:bg-gray-200 transition-colors" 
                title={fitMode === 'contain' ? "Switch to fill mode" : "Switch to fit mode"}
              >
                {fitMode === 'contain' ? 
                  <span className="flex items-center gap-1 text-xs font-medium">Fill <Maximize2 size={14} /></span> : 
                  <span className="flex items-center gap-1 text-xs font-medium">Fit <Minimize2 size={14} /></span>
                }
              </button>
              <button 
                onClick={toggleZoom} 
                className="p-2 rounded-md hover:bg-gray-200 transition-colors" 
                title={isZoomed ? "Exit zoom" : "Zoom in"}
              >
                <span className="flex items-center gap-1 text-xs font-medium">
                  {isZoomed ? "Exit" : "Zoom"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            <Car size={48} />
        </div>
        )}
          </div>
      
      {hasMultipleImages && (
        <div className="p-4 overflow-hidden">
          <div className="flex flex-wrap gap-3 justify-center thumbnail-container overflow-x-auto py-2">
            {displayImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img.url)}
                className={`relative h-20 w-32 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                  activeImage === img.url ? 'border-orange-500' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={img.url}
                  alt={`${title || "Car"} image ${i + 1}`}
                  className="object-contain hover:object-cover transition-all w-full h-full"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
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
  const [mainImage, setMainImage] = useState(null);
  
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
    const fetchCarDetails = async () => {
    setLoading(true);
        setError(null);
      
      try {
        // Determine if the ID is a valid ObjectId or a sample ID
        const useNumericEndpoint = !isNaN(Number(id)) && String(Number(id)) === id;
        
        let carData;
        
        if (useNumericEndpoint) {
          console.log("Fetching sample car ID:", id);
          const response = await fetch(`/api/sample/cars/${id}`);
          if (!response.ok) throw new Error('Failed to fetch sample car data');
          const result = await response.json();
          carData = result.data;
      } else {
          console.log("Fetching car by ID:", id);
          try {
            // Try to get car from API directly
            const response = await fetch(`/api/cars/${id}`);
            if (!response.ok) throw new Error('Car not found in API');
            const result = await response.json();
            carData = result.data;
            console.log("Car data from API:", carData);
          } catch (err) {
            // Fallback to regular car data for demo purposes
            console.log("Fetching car from sample data as fallback");
            const sampleCar = cars.find(c => c.id.toString() === id);
            if (!sampleCar) throw new Error('Car not found');
            carData = sampleCar;
          }
        }
        
        if (!carData) {
          throw new Error('Car not found');
        }
        
        // Process images for consistency
        carData.processedImages = [];
        
        // Case 1: Array of image objects with url property
        if (carData.images && Array.isArray(carData.images)) {
          console.log("Processing car images array:", carData.images);
          carData.images.forEach(img => {
            if (typeof img === 'string') {
              carData.processedImages.push({ url: img });
            } else if (img && typeof img === 'object') {
              if (img.url) {
                carData.processedImages.push({ url: img.url });
              } else if (img.secure_url) {
                carData.processedImages.push({ url: img.secure_url });
              } else if (img.src) {
                carData.processedImages.push({ url: img.src });
              } else if (img.path) {
                carData.processedImages.push({ url: img.path });
              } else {
                console.warn("Found image object with no recognized URL property:", img);
              }
            }
          });
        }
        
        // Case 2: Single image URL
        if (carData.image && typeof carData.image === 'string' && carData.processedImages.length === 0) {
          carData.processedImages.push({ url: carData.image });
        }
        
        // Case 3: Handle imageUrl property that some sample data might have
        if (carData.imageUrl && typeof carData.imageUrl === 'string' && carData.processedImages.length === 0) {
          carData.processedImages.push({ url: carData.imageUrl });
        }
        
        // If we still have no images, use a placeholder
        if (carData.processedImages.length === 0) {
          console.warn("No valid images found for car:", carData._id || carData.id);
          carData.processedImages.push({ 
            url: "https://via.placeholder.com/800x500?text=No+Image+Available" 
          });
        }
        
        // Log what we found
        console.log("Processed car data:", {
          id: carData._id || carData.id,
          title: carData.title,
          originalImages: carData.images,
          processedImages: carData.processedImages
        });
        
        setCar(carData);
        
        if (carData.processedImages.length > 0) {
          setMainImage(carData.processedImages[0].url);
        }
        
        // Fetch similar cars
        if (carData.make && carData.model) {
          // You can implement this if needed
          // fetchSimilarCars(carData.make, carData.model, carData._id || carData.id);
        }
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('Car not found. Please check the URL and try again.');
      } finally {
      setLoading(false);
      }
    };
    
    fetchCarDetails();
  }, [id]);
  
  // Check if car is in favorites (for UI state)
  const isCarInFavorites = car ? isFavorite(car._id || car.id || id) : false;

  // Handle favorite toggling
  const handleFavoriteToggle = async () => {
    try {
      // Get the correct ID format for the car
      const carIdToUse = car._id || car.id || id;
      console.log("Toggling favorite for car:", carIdToUse);
      
      // Call the toggleFavorite function with proper car ID
      const result = await toggleFavorite(carIdToUse);
      
      if (result && result.success) {
        // Success is already handled by the toggleFavorite function with toast notification
        return;
      } else if (result && !result.success) {
        toast.error(result.message || "Failed to update favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Something went wrong when updating favorites");
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
    
    console.log('🔍 [CarDetail] Starting inquiry submission');
    setFormSubmitting(true);
    setFormError(null);
    
    try {
      // Prepare the inquiry data
      const inquiryData = {
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        subject: `Inquiry about ${car.title}`,
        message: contactForm.message,
        vehicle: car.title,
        vehicleId: car._id || car.id
      };
      
      console.log('🔍 [CarDetail] Prepared inquiry data:', inquiryData);
      console.log('🔍 [CarDetail] Car ID:', car._id || car.id);
      
      // Submit the inquiry to the backend
      console.log('🔍 [CarDetail] Sending inquiry to API');
      const response = await apiService.contact.submitInquiry(inquiryData);
      console.log('✅ [CarDetail] API response:', response);
      
      if (response.status === 'success') {
        console.log('✅ [CarDetail] Inquiry submission successful');
        // Show success message
        setFormSuccess(true);
        
        // Reset form fields
        setContactForm({
          name: "",
          email: "",
          phone: "",
          message: "I'm interested in this vehicle. Please contact me."
        });
      } else {
        console.error('❌ [CarDetail] API returned unsuccessful status:', response);
        throw new Error(response.message || 'Failed to submit inquiry');
      }
    } catch (err) {
      console.error('❌ [CarDetail] Error submitting inquiry:', err);
      console.error('❌ [CarDetail] Error details:', {
        message: err.message,
        stack: err.stack
      });
      setFormError(err.message || 'An error occurred while submitting your inquiry. Please try again later.');
    } finally {
      setFormSubmitting(false);
      console.log('🔍 [CarDetail] Inquiry submission process completed');
    }
  };

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
              <div className="lg:col-span-2 w-full p-0">
                <CarGallery 
                  car={car} 
                  title={car.title} 
                  mainImage={mainImage}
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
                    KSh {typeof car.price === 'number' ? car.price.toLocaleString() : car.price}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Est. KSh {Math.round((typeof car.price === 'number' ? car.price : parseInt(car.price.toString().replace(/[^\d]/g, ''))) / 48).toLocaleString()}/mo for 48 months
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
                  {car.features && car.features
                    .filter(feature => 
                      feature.toLowerCase().includes('safety') ||
                      feature.toLowerCase().includes('airbag') ||
                      feature.toLowerCase().includes('assist') ||
                      feature.toLowerCase().includes('brake') ||
                      feature.toLowerCase().includes('monitor') ||
                      feature.toLowerCase().includes('warning') ||
                      feature.toLowerCase().includes('camera')
                    )
                    .slice(0, 5)
                    .map((feature, index) => (
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
                  {car.features && car.features
                    .filter(feature => 
                      feature.toLowerCase().includes('display') ||
                      feature.toLowerCase().includes('sound') ||
                      feature.toLowerCase().includes('apple') ||
                      feature.toLowerCase().includes('android') ||
                      feature.toLowerCase().includes('carplay') ||
                      feature.toLowerCase().includes('bluetooth') ||
                      feature.toLowerCase().includes('navigation') ||
                      feature.toLowerCase().includes('wifi') ||
                      feature.toLowerCase().includes('usb') ||
                      feature.toLowerCase().includes('system')
                    )
                    .slice(0, 5)
                    .map((feature, index) => (
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
                  {car.features && car.features
                    .filter(feature => 
                      feature.toLowerCase().includes('seat') ||
                      feature.toLowerCase().includes('climate') ||
                      feature.toLowerCase().includes('sunroof') ||
                      feature.toLowerCase().includes('roof') ||
                      feature.toLowerCase().includes('keyless') ||
                      feature.toLowerCase().includes('push') ||
                      feature.toLowerCase().includes('heated') ||
                      feature.toLowerCase().includes('ventilated') ||
                      feature.toLowerCase().includes('leather')
                    )
                    .slice(0, 5)
                    .map((feature, index) => (
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
                  {/* Try to find engine spec from features */}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Engine</div>
                    <div className="font-medium text-gray-900">
                      {car.features?.find(f => 
                        f.toLowerCase().includes('engine') || 
                        f.toLowerCase().includes('turbo') || 
                        /\d\.\d[l]/i.test(f) || 
                        /v\d/i.test(f)
                      ) || 'N/A'}
                  </div>
                  </div>
                  
                  {/* Try to find horsepower from features */}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Horsepower</div>
                    <div className="font-medium text-gray-900">
                      {car.features?.find(f => 
                        f.toLowerCase().includes('hp') || 
                        f.toLowerCase().includes('horsepower')
                      ) || 'N/A'}
                  </div>
                  </div>
                  
                  {/* Try to find torque from features */}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Torque</div>
                    <div className="font-medium text-gray-900">
                      {car.features?.find(f => 
                        f.toLowerCase().includes('lb-ft') || 
                        f.toLowerCase().includes('torque')
                      ) || 'N/A'}
                  </div>
                  </div>
                  
                  {/* Use actual car transmission data */}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Transmission</div>
                    <div className="font-medium text-gray-900">{car.transmission || 'N/A'}</div>
                  </div>
                  
                  {/* Try to find drivetrain from features or use actual car data */}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Drivetrain</div>
                    <div className="font-medium text-gray-900">
                      {car.drivetrain || 
                       car.features?.find(f => 
                         f.toLowerCase().includes('wheel drive') || 
                         f.toLowerCase().includes('awd') ||
                         f.toLowerCase().includes('4wd') ||
                         f.toLowerCase().includes('rwd') ||
                         f.toLowerCase().includes('fwd')
                       ) || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200 flex items-center text-orange-500">
                  <CarFront className="h-5 w-5 mr-2" />
                  Dimensions
                </h3>
                <div className="space-y-3">
                  {/* Try to find length from features */}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Length</div>
                    <div className="font-medium text-gray-900">
                      {car.features?.find(f => f.toLowerCase().includes('length')) || 'N/A'}
                  </div>
                  </div>
                  
                  {/* Try to find width from features */}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Width</div>
                    <div className="font-medium text-gray-900">
                      {car.features?.find(f => f.toLowerCase().includes('width')) || 'N/A'}
                  </div>
                  </div>
                  
                  {/* Try to find height from features */}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Height</div>
                    <div className="font-medium text-gray-900">
                      {car.features?.find(f => f.toLowerCase().includes('height')) || 'N/A'}
                  </div>
                  </div>
                  
                  {/* Try to find cargo capacity from features */}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Cargo Capacity</div>
                    <div className="font-medium text-gray-900">
                      {car.features?.find(f => 
                        f.toLowerCase().includes('cargo') || 
                        f.toLowerCase().includes('cu ft')
                      ) || 'N/A'}
                  </div>
                  </div>
                  
                  {/* Try to find fuel capacity from features */}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <div className="text-gray-600">Fuel Capacity</div>
                    <div className="font-medium text-gray-900">
                      {car.features?.find(f => 
                        f.toLowerCase().includes('fuel capacity') || 
                        f.toLowerCase().includes('gal')
                      ) || 'N/A'}
                    </div>
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
                        KSh {similarCar.price}
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
        
        /* Fix for car image display */
        .car-gallery-image {
          max-width: 98%;
          max-height: 98%;
          width: auto;
          height: auto;
          object-position: center;
          transition: all 0.2s ease;
        }
        
        .image-contain {
          object-fit: contain;
        }
        
        .image-cover {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        /* Optional controls to switch between view modes */
        .image-controls {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: flex;
          gap: 8px;
          background: rgba(255,255,255,0.8);
          padding: 4px;
          border-radius: 8px;
        }

        /* Image zoom effect */
        .car-gallery-image:hover {
          cursor: zoom-in;
        }
        
        .car-gallery-image.zoomed {
          transform: scale(1.8);
          cursor: zoom-out;
          transition: transform 0.3s ease;
        }
        
        .car-gallery-image:not(.zoomed) {
          transition: transform 0.3s ease;
        }
        
        /* Enhanced thumbnails */
        .thumbnail-container {
          scrollbar-width: thin;
          scrollbar-color: #f97316 #f1f5f9;
        }
        
        .thumbnail-container::-webkit-scrollbar {
          height: 6px;
        }
        
        .thumbnail-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .thumbnail-container::-webkit-scrollbar-thumb {
          background-color: #f97316;
          border-radius: 3px;
        }
      `}</style>
      
      <Footer />
    </div>
  );
};

export default CarDetailPage;