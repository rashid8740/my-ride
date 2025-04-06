"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  X, 
  AlertTriangle,
  Check,
  Car,
  DollarSign,
  Settings,
  FileText,
  Tag,
  Camera,
  AlertCircle,
  Loader2
} from 'lucide-react';
import apiService from '@/utils/api';
import { toast } from 'react-hot-toast';

// Step component for the form progress indicator
const FormStep = ({ title, icon, active, completed, number }) => {
  return (
    <div className="flex-1">
      <div className="flex items-center">
        <div 
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            completed ? 'bg-green-500 text-white' : 
            active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}
        >
          {completed ? <Check className="h-5 w-5" /> : number}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${active ? 'text-orange-500' : 'text-gray-500'}`}>{title}</p>
        </div>
      </div>
    </div>
  );
};

// Improve the FormStepper component for better visual appearance
const FormStepper = ({ steps, currentStep }) => {
  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" aria-hidden="true"></div>
      <ol className="relative z-10 flex justify-between items-center">
        {steps.map((step, index) => (
          <li key={index} className="flex items-center relative">
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep > index 
                  ? 'bg-green-600 text-white' 
                  : currentStep === index 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white border-2 border-gray-300 text-gray-500'
              }`}
            >
              {currentStep > index ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-xs font-semibold">{index + 1}</span>
              )}
            </div>
            <span 
              className={`absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium ${
                currentStep === index ? 'text-orange-600' : 'text-gray-500'
              }`}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

// Update input classes for better visibility
const inputBaseClass = "block w-full px-4 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm bg-white text-gray-900";
const selectBaseClass = "block w-full px-4 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm bg-white text-gray-900";
const textareaBaseClass = "block w-full px-4 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm bg-white text-gray-900";

export default function AddVehiclePage() {
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    trim: '',
    vin: '',
    stock: '',
    msrp: '',
    category: '',
    color: '',
    fuel: '',
    transmission: '',
    features: []
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Form sections
  const formSections = [
    { title: "Vehicle Info", icon: Car },
    { title: "Pricing", icon: DollarSign },
    { title: "Details", icon: FileText },
    { title: "Features", icon: Tag },
    { title: "Images", icon: Camera }
  ];
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };
  
  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Add the new files to the selected images array
      setSelectedImages(prevImages => [...prevImages, ...files]);
      // Clear the input value so the same file can be selected again if needed
      e.target.value = '';
    }
  };
  
  // Function to remove an image from the selected images
  const removeImage = (index) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };
  
  // Add a new feature - completely rewritten
  const addFeature = () => {
    if (newFeature.trim()) {
      // Update the features array
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      
      // Clear the input
      setNewFeature('');
    }
  };
  
  // Remove a feature
  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    try {
      setLoading(true);
      setError('');
      setUploadProgress(5);
      
      // Validation - Check required fields are filled
      if (!formData.make || !formData.model || !formData.year || !formData.price) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      // Prepare vehicle data object
      const vehicleData = {
        title: `${formData.year} ${formData.make} ${formData.model}`,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        mileage: formData.mileage ? parseInt(formData.mileage) : 0,
        stock: formData.stock ? formData.stock : '',
        msrp: formData.msrp ? parseFloat(formData.msrp) : undefined,
        fuel: formData.fuel || formData.fuelType || '',
        transmission: formData.transmission || '',
        vin: formData.vin || '',
        description: formData.description || '',
        trim: formData.trim || '',
        category: formData.category || '',
        status: formData.status || 'available',
        features: formData.features || [],
        images: []
      };
      
      console.log('Submitting vehicle data:', vehicleData);
      
      // Handle image uploads if any images are selected
      if (selectedImages.length > 0) {
        setUploadProgress(5); // Start progress
        
        // Create FormData objects for each image
        const uploadPromises = selectedImages.map(async (image, index) => {
          const formData = new FormData();
          formData.append('file', image);
          
          console.log(`Uploading image ${index + 1}/${selectedImages.length}: ${image.name}`);
          
          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              console.error("Upload error response:", errorData);
              throw new Error(errorData.details || errorData.error || `Failed to upload image: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`Image ${index + 1} uploaded successfully:`, data);
            
            // Return a standardized object with url property
            if (data.url) {
              return { url: data.url };
            } else if (data.urls && data.urls.length > 0) {
              // If multiple URLs are returned, use the first one
              return { url: data.urls[0] };
            } else {
              throw new Error('No image URL returned from upload');
            }
          } catch (error) {
            console.error(`Error uploading image ${index + 1}:`, error);
            throw error; // Re-throw to be caught by the Promise.all
          }
        });
        
        // Update progress as uploads complete
        setUploadProgress(30);
        
        try {
          // Wait for all uploads to complete
          const uploadResults = await Promise.all(uploadPromises);
          setUploadProgress(70);
          
          // Add the image objects directly to the vehicle data
          // Each uploadResult is already in the format { url: "..." }
          vehicleData.images = uploadResults;
          
          console.log(`Added ${vehicleData.images.length} images to vehicle data:`, vehicleData.images);
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      // Submit the vehicle data
      setUploadProgress(80);
      
      try {
        console.log('Sending vehicle data to API:', JSON.stringify(vehicleData));
        
        // Submit via our API route
        const response = await fetch('/api/cars', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify(vehicleData),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ 
            message: `Server error: ${response.status} ${response.statusText}` 
          }));
          throw new Error(errorData.message || `Failed to add vehicle: ${response.statusText}`);
        }
        
        // Get the created vehicle data
        const createdVehicle = await response.json();
        console.log('Vehicle created successfully:', createdVehicle);
        
        setUploadProgress(100);
        
        // Show success message with more details
        toast.success(`Vehicle added successfully! ID: ${createdVehicle.data?._id || 'N/A'}`);
        
        // Clear form data for a fresh start if the user adds another vehicle
        setFormData({
          make: '',
          model: '',
          year: new Date().getFullYear(),
          price: '',
          mileage: '',
          trim: '',
          vin: '',
          stock: '',
          msrp: '',
          category: '',
          color: '',
          fuel: '',
          transmission: '',
          features: []
        });
        
        // Clear selected images
        setSelectedImages([]);
        
        // Redirect to inventory page after a short delay
        setTimeout(() => {
          router.push('/admin/inventory');
        }, 1500);
      } catch (err) {
        console.error('Error adding vehicle:', err);
        // Check for network errors
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setError('Network error: Could not connect to the server. Please check your connection and try again.');
        } else {
          setError(err.message || 'An error occurred while adding the vehicle');
        }
        setUploadProgress(0);
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions for steps
  const goToNextStep = () => {
    if (currentStep < formSections.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Add category selection dropdown in the form
  // In the "Vehicle Info" section of the form (Step 0)
  const renderVehicleInfoFields = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="make" className="block text-sm font-semibold text-gray-800 mb-2">
            Make<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            className={inputBaseClass}
            required
          />
        </div>
        
        <div>
          <label htmlFor="model" className="block text-sm font-semibold text-gray-800 mb-2">
            Model<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={inputBaseClass}
            required
          />
        </div>
        
        <div>
          <label htmlFor="year" className="block text-sm font-semibold text-gray-800 mb-2">
            Year<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            className={inputBaseClass}
            required
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={selectBaseClass}
          >
            <option value="">Select a category</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="MUV">MUV</option>
            <option value="Luxury">Luxury</option>
            <option value="Convertible">Convertible</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="vin" className="block text-sm font-semibold text-gray-800 mb-2">
            VIN
          </label>
          <input
            type="text"
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            className={inputBaseClass}
          />
        </div>
        
        <div>
          <label htmlFor="trim" className="block text-sm font-semibold text-gray-800 mb-2">
            Trim
          </label>
          <input
            type="text"
            id="trim"
            name="trim"
            value={formData.trim}
            onChange={handleChange}
            className={inputBaseClass}
          />
        </div>
      </div>
    );
  };

  // In the "Pricing" section (Step 1)
  const renderPricingFields = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-2">
            Price (KSh)<span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">KSh</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1"
              className="block w-full pl-12 px-4 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm bg-white text-gray-900"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="msrp" className="block text-sm font-semibold text-gray-800 mb-2">
            MSRP (KSh)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">KSh</span>
            </div>
            <input
              type="number"
              id="msrp"
              name="msrp"
              value={formData.msrp}
              onChange={handleChange}
              min="0"
              step="1"
              className="block w-full pl-12 px-4 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm bg-white text-gray-900"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="mileage" className="block text-sm font-semibold text-gray-800 mb-2">
            Mileage
          </label>
          <input
            type="number"
            id="mileage"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            min="0"
            step="1"
            className={inputBaseClass}
          />
        </div>
        
        <div>
          <label htmlFor="stock" className="block text-sm font-semibold text-gray-800 mb-2">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            step="1"
            className={inputBaseClass}
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-gray-800 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={selectBaseClass}
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
    );
  };

  // In the "Details" section (Step 2)
  const renderDetailsFields = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fuelType" className="block text-sm font-semibold text-gray-800 mb-2">
            Fuel Type
          </label>
          <select
            id="fuelType"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className={selectBaseClass}
          >
            <option value="">Select fuel type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="CNG">CNG</option>
            <option value="LPG">LPG</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="transmission" className="block text-sm font-semibold text-gray-800 mb-2">
            Transmission
          </label>
          <select
            id="transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className={selectBaseClass}
          >
            <option value="">Select transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
            <option value="CVT">CVT</option>
            <option value="Semi-Automatic">Semi-Automatic</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={textareaBaseClass}
          ></textarea>
        </div>
      </div>
    );
  };

  // Enhanced DragAndDrop component for image upload
  const DragAndDropZone = ({ onImageSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };
    
    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };
    
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);
        const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length > 0) {
          // Create a fake event object with the files
          onImageSelect({ target: { files: imageFiles } });
        }
      }
    };
    
    return (
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('vehicle-images').click()}
      >
        <input
          type="file"
          id="vehicle-images"
          name="images"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onImageSelect}
        />
        <Camera className="h-10 w-10 mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-900 mb-1">
          Drag &amp; drop vehicle images or click to browse
        </p>
        <p className="text-xs text-gray-500">
          Support for multiple images (JPG, PNG, GIF) up to 5MB each
        </p>
      </div>
    );
  };

  // Render selected image previews
  const renderImagePreviews = () => {
    if (selectedImages.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No images selected
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-4">
        {selectedImages.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={URL.createObjectURL(image)}
                alt={`Vehicle preview ${index + 1}`}
                className="w-full h-full object-cover"
                onLoad={() => URL.revokeObjectURL(image.preview)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs py-1 px-2 rounded shadow-md">
                Main Image
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Adding section headers to each step
  const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="mb-8 pb-4 border-b border-gray-200">
      <div className="flex items-center">
        <div className="bg-orange-100 p-2 rounded-lg mr-3">
          <Icon className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
      </div>
    </div>
  );

  // Update the renderCurrentStep function to include section headers
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <SectionHeader 
              icon={Car} 
              title="Vehicle Information" 
              description="Enter the basic details of the vehicle"
            />
            {renderVehicleInfoFields()}
          </>
        );
      case 1:
        return (
          <>
            <SectionHeader 
              icon={DollarSign} 
              title="Pricing Information" 
              description="Set the pricing and availability details"
            />
            {renderPricingFields()}
          </>
        );
      case 2:
        return (
          <>
            <SectionHeader 
              icon={Settings} 
              title="Technical Details" 
              description="Add specifications and technical information"
            />
            {renderDetailsFields()}
          </>
        );
      case 3:
        return (
          <>
            <SectionHeader 
              icon={Tag} 
              title="Vehicle Features" 
              description="Add key features and selling points"
            />
            <AddFeaturesSection />
          </>
        );
      case 4:
        return (
          <>
            <SectionHeader 
              icon={Camera} 
              title="Vehicle Images" 
              description="Upload photos of the vehicle (first image will be the main image)"
            />
            <DragAndDropZone onImageSelect={handleImageSelect} />
            {renderImagePreviews()}
          </>
        );
      default:
        return null;
    }
  };
  
  // Update the AddFeaturesSection component with a completely new approach
  const AddFeaturesSection = () => {
    const [newFeature, setNewFeature] = useState('');
    const [featureSearch, setFeatureSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);

    // Predefined feature categories with common options
    const predefinedFeatures = [
      { category: "Safety", features: ["Airbags", "ABS", "Stability Control", "Backup Camera", "Blind Spot Monitor", "Lane Departure Warning", "Parking Sensors", "Collision Warning", "Hill Start Assist", "Child Safety Locks", "ISOFIX", "Emergency Brake Assist"] },
      { category: "Technology", features: ["Bluetooth Connection", "Navigation System", "Apple CarPlay", "Android Auto", "Wireless Charging", "Premium Sound System", "Touchscreen Display", "Keyless Entry", "Remote Start", "Heads-Up Display", "WiFi Hotspot", "USB Ports", "Satellite Radio", "Voice Recognition"] },
      { category: "Comfort", features: ["Leather Seats", "Heated Seats", "Ventilated Seats", "Power Seats", "Memory Seats", "Dual-Zone Climate Control", "Climate Control", "Sunroof", "Moonroof", "Panoramic Roof", "Heated Steering Wheel", "Lumbar Support", "Third Row Seating", "Rear Window Shades"] },
      { category: "Performance", features: ["Turbo Engine", "All-Wheel Drive", "Sport Mode", "Paddle Shifters", "Performance Tires", "Sport Suspension", "Traction Control", "Launch Control", "Limited Slip Differential", "Performance Exhaust", "Adjustable Drive Modes", "Hill Descent Control"] },
      { category: "Exterior", features: ["Alloy Wheels", "Fog Lights", "LED Headlights", "Panoramic Roof", "Power Liftgate", "Roof Rack", "Tinted Windows", "Running Boards", "Sunroof", "Tow Hitch", "Power Folding Mirrors", "Chrome Accents", "Rear Spoiler"] },
      { category: "Convenience", features: ["Push Button Start", "Power Windows", "Power Locks", "Cruise Control", "Adaptive Cruise Control", "Rain-Sensing Wipers", "Auto-Dimming Mirror", "Automatic Headlights", "Power Outlets", "Keyless Entry", "Hands-Free Trunk", "Memory Settings"] },
      { category: "Driver Assistance", features: ["Automatic Emergency Braking", "Forward Collision Warning", "Pedestrian Detection", "Traffic Sign Recognition", "Driver Attention Monitor", "360-Degree Camera", "Adaptive Headlights", "Self-Parking System", "Traffic Jam Assist", "Night Vision", "Rear Cross Traffic Alert"] },
      { category: "Engine Specs", features: ["2.0L Turbo", "2.5L Inline-4", "3.0L V6", "3.5L V6", "4.0L V8", "5.0L V8", "Hybrid", "Electric", "Diesel"] },
      { category: "Dimensions", features: ["Cargo Capacity: 20+ cu ft", "Cargo Capacity: 30+ cu ft", "Cargo Capacity: 40+ cu ft", "Cargo Capacity: 50+ cu ft", "Fuel Capacity: 15+ gal", "Fuel Capacity: 18+ gal", "Fuel Capacity: 20+ gal"] },
      { category: "Drivetrain", features: ["Front-Wheel Drive", "Rear-Wheel Drive", "All-Wheel Drive", "Four-Wheel Drive", "Part-Time 4WD", "Selectable 4WD"] }
    ];
    
    // Get all features from all categories for search
    const allFeatures = predefinedFeatures.reduce((acc, category) => {
      return [...acc, ...category.features];
    }, []);
    
    // Filter features based on search
    const filteredFeatures = featureSearch.trim()
      ? allFeatures.filter(feature => 
          feature.toLowerCase().includes(featureSearch.toLowerCase()))
      : [];
    
    const handleAddPredefinedFeature = (feature) => {
      if (!formData.features.includes(feature)) {
        setFormData(prev => ({
          ...prev,
          features: [...prev.features, feature]
        }));
        toast.success(`Added: ${feature}`);
      } else {
        toast.error("Feature already added");
      }
    };
    
    // Add new vehicle specs section
    const vehicleSpecs = [
      { label: "Engine", options: ["2.0L Turbo", "2.5L Inline-4", "3.0L V6", "3.5L V6", "4.0L V8", "5.0L V8", "Hybrid", "Electric", "Diesel"] },
      { label: "Horsepower", options: ["150-200 hp", "201-250 hp", "251-300 hp", "301-350 hp", "351-400 hp", "400+ hp"] },
      { label: "Torque", options: ["150-200 lb-ft", "201-250 lb-ft", "251-300 lb-ft", "301-350 lb-ft", "351-400 lb-ft", "400+ lb-ft"] },
      { label: "Transmission", options: ["Manual", "Automatic", "CVT", "Dual-Clutch", "Semi-Automatic"] },
      { label: "Drivetrain", options: ["Front-Wheel Drive", "Rear-Wheel Drive", "All-Wheel Drive", "Four-Wheel Drive"] },
      { label: "Dimensions", options: [
        "Length: 170-180 in", "Length: 181-190 in", "Length: 191-200 in", "Length: 200+ in",
        "Width: 70-75 in", "Width: 76-80 in", "Width: 81-85 in", "Width: 85+ in",
        "Height: 55-60 in", "Height: 61-65 in", "Height: 66-70 in", "Height: 70+ in",
        "Cargo Capacity: 20+ cu ft", "Cargo Capacity: 30+ cu ft", "Cargo Capacity: 40+ cu ft",
        "Fuel Capacity: 15+ gal", "Fuel Capacity: 18+ gal", "Fuel Capacity: 20+ gal"
      ]}
    ];

    // Handle adding a custom feature
    const handleAddFeature = () => {
      if (newFeature.trim()) {
        setFormData(prev => ({
          ...prev,
          features: [...prev.features, newFeature.trim()]
        }));
        setNewFeature('');
      }
    };

    return (
      <div>
        
        {/* Add new feature */}
        <div className="mb-4 flex">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            className={`${inputBaseClass} flex-grow`}
            placeholder="Add a custom feature"
          />
          <button
            type="button"
            onClick={handleAddFeature}
            disabled={!newFeature.trim()}
            className={`ml-2 px-4 py-2 rounded-md ${
              !newFeature.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            Add
          </button>
        </div>
        
        {/* Feature search */}
        <div className="mb-4">
          <label htmlFor="featureSearch" className="block text-sm font-medium text-gray-700 mb-1">
            Search Features
          </label>
          <div className="relative">
            <input
              type="text"
              id="featureSearch"
              value={featureSearch}
              onChange={(e) => setFeatureSearch(e.target.value)}
              className={inputBaseClass}
              placeholder="Type to search for features..."
            />
            {featureSearch.trim() && filteredFeatures.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto p-2">
                <div className="flex flex-wrap gap-2">
                  {filteredFeatures.map((feature, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleAddPredefinedFeature(feature);
                        setFeatureSearch('');
                      }}
                      className={`text-sm py-1 px-3 rounded-full transition-colors ${
                        formData.features.includes(feature)
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-white text-orange-700 border border-orange-200 hover:bg-orange-100'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="mb-2 flex flex-wrap gap-1">
          {predefinedFeatures.map((category, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveCategory(activeCategory === idx ? null : idx)}
              className={`text-xs py-1 px-3 rounded-md transition-colors ${
                activeCategory === idx
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>
        
        {/* Predefined features */}
        <div className="mb-8 bg-orange-50 rounded-lg p-4 border border-orange-100">
          <h4 className="text-sm font-medium text-orange-800 mb-3">
            {activeCategory !== null 
              ? `${predefinedFeatures[activeCategory].category} Features` 
              : 'Select a category above or search for features'}
          </h4>
          
          <div className="space-y-4">
            {activeCategory !== null && (
              <div className="flex flex-wrap gap-2">
                {predefinedFeatures[activeCategory].features.map((feature, featureIdx) => (
                  <button
                    key={featureIdx}
                    type="button"
                    onClick={() => handleAddPredefinedFeature(feature)}
                    className={`text-sm py-1 px-3 rounded-full transition-colors ${
                      formData.features.includes(feature)
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-white text-orange-700 border border-orange-200 hover:bg-orange-100'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Specifications Section */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">Vehicle Specifications</h4>
          
          <div className="space-y-6">
            {vehicleSpecs.map((specGroup, groupIdx) => (
              <div key={groupIdx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h5 className="text-sm font-medium text-gray-700 mb-2">{specGroup.label}</h5>
                <div className="flex flex-wrap gap-2">
                  {specGroup.options.map((option, optionIdx) => (
                    <button
                      key={optionIdx}
                      type="button"
                      onClick={() => handleAddPredefinedFeature(option)}
                      className={`text-sm py-1 px-3 rounded-full transition-colors ${
                        formData.features.includes(option)
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Features list */}
        {formData.features.length > 0 ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Added Features: ({formData.features.length})</h4>
              {formData.features.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all features?')) {
                      setFormData(prev => ({ ...prev, features: [] }));
                      toast.success('All features cleared');
                    }
                  }}
                  className="text-xs py-1 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-orange-100 text-orange-800 rounded-full py-1 px-3 flex items-center border border-orange-200 font-medium"
                >
                  <span className="text-sm text-orange-800">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-2 text-orange-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">No features added yet.</p>
        )}
      </div>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6 bg-gradient-to-r from-orange-50 to-white border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
          <p className="mt-1 text-sm text-gray-600">
            Enter the details for the new vehicle to add it to inventory
          </p>
        </div>

        <div className="px-6 pt-8 pb-6">
          <div className="mb-10">
            <FormStepper steps={formSections.map(section => section.title)} currentStep={currentStep} />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md border border-red-200">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
              {renderCurrentStep()}
            </div>

            {loading && (
              <div className="mb-6">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-gray-500 text-center">
                  {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                </p>
              </div>
            )}

            <div className="px-6 py-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div>
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Vehicle
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 