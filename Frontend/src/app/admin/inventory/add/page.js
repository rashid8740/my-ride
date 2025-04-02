"use client";
import { useState } from 'react';
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
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    trim: '',
    price: '',
    msrp: '',
    mileage: '',
    vin: '',
    status: 'available',
    stock: 1,
    fuelType: '',
    transmission: '',
    description: '',
    features: [],
    location: '',
    category: '',
  });
  
  const [images, setImages] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  
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
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedImages(files);

      // Create image previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };
  
  // Remove image from selection
  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };
  
  // Add a new feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
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
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.make || !formData.model || !formData.year || !formData.price) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Create a vehicle object
      const vehicleData = {
        ...formData,
        features: formData.features || [],
        year: parseInt(formData.year),
        price: parseInt(formData.price),
        mileage: formData.mileage ? parseInt(formData.mileage) : 0,
        stock: formData.stock ? parseInt(formData.stock) : 1,
        msrp: formData.msrp ? parseInt(formData.msrp) : null,
      };

      // Handle image uploads if any images are selected
      if (selectedImages.length > 0) {
        setUploadProgress(5); // Start progress
        
        // Create FormData objects for each image
        const uploadPromises = selectedImages.map(async (image) => {
          const formData = new FormData();
          formData.append('file', image);
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Failed to upload image: ${response.statusText}`);
          }
          
          return response.json();
        });
        
        // Update progress as uploads complete
        setUploadProgress(30);
        
        // Wait for all uploads to complete
        const uploadResults = await Promise.all(uploadPromises);
        setUploadProgress(70);
        
        // Add the Cloudinary URLs to the vehicle data
        vehicleData.images = uploadResults.map(result => result.url);
      }
      
      // Submit the vehicle data to the API
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      setUploadProgress(90);

      if (!response.ok) {
        throw new Error(`Failed to add vehicle: ${response.statusText}`);
      }

      setUploadProgress(100);
      
      // Show success message and redirect
      toast.success('Vehicle added successfully!');
      setTimeout(() => {
        router.push('/admin/inventory');
      }, 1500);
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError(err.message || 'An error occurred while adding the vehicle');
      setUploadProgress(0);
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
            Price ($)<span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1"
              className="block w-full pl-7 px-4 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm bg-white text-gray-900"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="msrp" className="block text-sm font-semibold text-gray-800 mb-2">
            MSRP ($)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="msrp"
              name="msrp"
              value={formData.msrp}
              onChange={handleChange}
              min="0"
              step="1"
              className="block w-full pl-7 px-4 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm bg-white text-gray-900"
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
        const fileInput = document.getElementById('image-upload');
        fileInput.files = e.dataTransfer.files;
        
        // Trigger the onChange event manually
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    };
    
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-10 text-center ${
          isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'
        } transition-colors duration-200 hover:bg-gray-50 cursor-pointer`}
      >
        <Upload className="mx-auto h-12 w-12 text-orange-400" />
        <p className="mt-2 text-sm text-gray-700 font-medium">
          Drag and drop images here, or{' '}
          <label htmlFor="image-upload" className="font-bold text-orange-600 hover:text-orange-500 cursor-pointer underline">
            browse
          </label>
        </p>
        <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={onImageSelect}
          className="sr-only"
        />
      </div>
    );
  };

  // Update the renderImagePreviews function for better presentation
  const renderImagePreviews = () => {
    if (imagePreviews.length === 0) {
      return null;
    }

    return (
      <div className="mt-8 bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-base font-medium text-gray-700 mb-3 flex items-center">
          <Camera className="h-5 w-5 mr-2 text-orange-500" />
          Selected Images ({imagePreviews.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200"></div>
              <button
                type="button"
                onClick={() => {
                  // Remove the image from both arrays
                  setSelectedImages(selectedImages.filter((_, i) => i !== index));
                  setImagePreviews(imagePreviews.filter((_, i) => i !== index));
                }}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Main Image
                </span>
              )}
            </div>
          ))}
        </div>
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
  
  // Update the AddFeaturesSection component
  const AddFeaturesSection = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-end space-x-2">
            <div className="flex-grow">
              <label htmlFor="newFeature" className="block text-sm font-semibold text-gray-800 mb-2">
                Add Feature
              </label>
              <input
                type="text"
                id="newFeature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newFeature.trim()) {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                className={inputBaseClass}
                placeholder="e.g., Bluetooth, Sunroof, Heated Seats"
              />
            </div>
            <button
              type="button"
              onClick={addFeature}
              disabled={!newFeature.trim()}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>

          {formData.features.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Tag className="h-4 w-4 mr-1 text-orange-500" />
                Added Features ({formData.features.length})
              </h4>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-md">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-white px-3 py-1.5 rounded-full text-sm font-medium text-gray-800 border border-gray-300 group shadow-sm hover:shadow-md transition-shadow"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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