"use client";
import { useState, useEffect } from 'react';
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
  Loader2,
  ShieldAlert,
  UploadCloud,
  Trash2,
  FileEdit
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '@/utils/AuthContext';

// Define the base API URL for direct backend calls
const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Form styling classes
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const inputClass = "block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500";
const inputBaseClass = "block w-full px-4 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm bg-white text-gray-900 transition-colors";
const selectBaseClass = "block w-full px-4 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm bg-white text-gray-900 transition-colors";
const textareaBaseClass = "block w-full px-4 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm bg-white text-gray-900 transition-colors";

// Step components for progress tracking
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

// Define tab items
const tabItems = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'pricing', label: 'Pricing & Performance' },
  { id: 'features', label: 'Features' },
  { id: 'images', label: 'Images' },
];

// Component for section headers
const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      <div className="rounded-full bg-orange-100 p-2 mr-3">
        <Icon className="h-6 w-6 text-orange-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    {description && <p className="text-gray-600 ml-14">{description}</p>}
  </div>
);

export default function EditCarPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const { isAuthenticated, user, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    price: '',
    mileage: '',
    transmission: '',
    fuelType: '',
    engineSize: '',
    doors: '',
    bodyType: '',
    color: '',
    interiorColor: '',
    vin: '039884', // Default VIN for Kenya
    stock: '',
    trim: '',
    features: [],
    description: '',
    condition: '',
    status: 'available'
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCar, setIsLoadingCar] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [featureSearch, setFeatureSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Admin check
  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated) {
      toast.error('You must be logged in to access this page');
      router.push('/login');
      return;
    }
    
    if (!isAdmin) {
      toast.error('You must be an admin to access this page');
      router.push('/');
      return;
    }
  }, [isAuthenticated, isAdmin, router]);

  // Fetch car data when component mounts
  useEffect(() => {
    const fetchCarDetails = async () => {
      setIsLoadingCar(true);
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('You must be logged in to edit vehicles');
        }

        // Fetch car data directly from backend API
        console.log(`Fetching car data from ${baseApiUrl}/api/cars/${id}`);
        const response = await fetch(`${baseApiUrl}/api/cars/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch car data: ${response.status} ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Raw API response:', responseData);
        
        // Extract the car data from the response depending on API structure
        const carData = responseData.car || responseData.data || responseData;
        
        if (!carData) {
          throw new Error('Car data not found in response');
        }
        
        console.log('Loaded car data:', carData);
        
        // Parse and set form data with appropriate fallbacks
        setFormData({
          title: carData.title || '',
          make: carData.make || '',
          model: carData.model || '',
          year: carData.year?.toString() || new Date().getFullYear().toString(),
          price: carData.price?.toString() || '',
          mileage: carData.mileage?.toString() || '',
          transmission: carData.transmission || '',
          fuelType: carData.fuelType || carData.fuel || '',
          engineSize: carData.engineSize?.toString() || '',
          doors: carData.doors?.toString() || '',
          bodyType: carData.bodyType || '',
          category: carData.category || '',
          color: carData.color || carData.exteriorColor || '',
          interiorColor: carData.interiorColor || '',
          vin: carData.vin?.length > 10 ? '039884' : (carData.vin || '039884'),
          stock: carData.stock || '',
          trim: carData.trim || '',
          length: carData.length || '',
          width: carData.width || '',
          height: carData.height || '',
          cargoCapacity: carData.cargoCapacity || '',
          fuelCapacity: carData.fuelCapacity || '',
          horsepower: carData.horsepower || '',
          torque: carData.torque || '',
          drivetrain: carData.drivetrain || '',
          features: Array.isArray(carData.features) ? carData.features : [],
          description: carData.description || '',
          condition: carData.condition || '',
          status: carData.status || 'available'
        });

        // Handle images - different APIs have different formats
        if (carData.images && Array.isArray(carData.images)) {
          setExistingImages(carData.images);
        } else if (carData.image) {
          // Single image string
          setExistingImages([{ _id: 'main', url: carData.image }]);
        } else if (carData.imageUrl) {
          setExistingImages([{ _id: 'main', url: carData.imageUrl }]);
        }
        
        console.log('Loaded VIN from API:', carData.vin);
        
        setIsLoadingCar(false);
      } catch (error) {
        console.error('Error fetching car data:', error);
        setErrorMessage(error.message);
        setIsLoadingCar(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      
      // Auto-update title when make, model, or year changes if title is empty
      // or matches the previous auto-generated pattern
      if (name === 'make' || name === 'model' || name === 'year') {
        const autoTitle = `${prev.year} ${prev.make} ${prev.model}`;
        const newAutoTitle = `${
          name === 'year' ? value : prev.year
        } ${
          name === 'make' ? value : prev.make
        } ${
          name === 'model' ? value : prev.model
        }`;
        
        // Only update if title is empty or matches the previous auto-generated pattern
        if (!prev.title || prev.title === autoTitle) {
          updated.title = newAutoTitle;
        }
      }
      
      return updated;
    });
  };

  // Handle adding a new feature
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // Handle removing a feature
  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files]);
      
      // Create URLs for previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Handle removing a selected image
  const handleRemoveSelectedImage = (index) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    // Remove the image from state
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle marking an existing image for deletion
  const handleMarkImageForDeletion = (imageId, imageIndex) => {
    // If the imageId parameter is null or undefined, use the index as fallback
    const idToUse = imageId || `existing-${imageIndex}`;
    
    if (!idToUse) return;
    
    if (imagesToDelete.includes(idToUse)) {
      // Unmark for deletion
      setImagesToDelete(prev => prev.filter(id => id !== idToUse));
    } else {
      // Mark for deletion
      setImagesToDelete(prev => [...prev, idToUse]);
    }
  };
  
  // Handle form submission to update car
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Validation - Check required fields are filled
      if (!formData.make || !formData.model || !formData.year || !formData.price || !formData.vin) {
        setErrorMessage('Please fill in all required fields including VIN');
        toast.error('Please fill in all required fields including VIN');
        setIsLoading(false);
        return;
      }
      
      // Get the auth token
      const token = localStorage.getItem('token');
      
      if (!token) {
        setErrorMessage('You must be logged in to update vehicles');
        toast.error('Authentication required');
        setIsLoading(false);
        return;
      }
      
      // Prepare vehicle data object
      const vehicleData = {
        title: formData.title || `${formData.year} ${formData.make} ${formData.model}`,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        priceCurrency: 'KSh',
        priceFormatted: `KSh ${parseFloat(formData.price).toLocaleString()}`,
        msrp: formData.msrp ? parseFloat(formData.msrp) : undefined,
        msrpFormatted: formData.msrp ? `KSh ${parseFloat(formData.msrp).toLocaleString()}` : undefined,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        engineSize: formData.engineSize ? parseFloat(formData.engineSize) : undefined,
        doors: formData.doors ? parseInt(formData.doors) : undefined,
        bodyType: formData.bodyType,
        color: formData.color,
        interiorColor: formData.interiorColor,
        vin: formData.vin,
        stock: formData.stock,
        trim: formData.trim,
        length: formData.length,
        width: formData.width,
        height: formData.height,
        cargoCapacity: formData.cargoCapacity,
        fuelCapacity: formData.fuelCapacity,
        horsepower: formData.horsepower,
        torque: formData.torque,
        drivetrain: formData.drivetrain,
        features: formData.features,
        description: formData.description,
        condition: formData.condition,
        category: formData.category,
        status: formData.status || 'available'
      };
      
      console.log('Submitting vehicle with VIN:', formData.vin);
      console.log('vehicleData with VIN:', vehicleData.vin);
      
      // Update car directly to backend API
      const updateResponse = await fetch(`${baseApiUrl}/api/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicleData)
      });
      
      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(errorText || 'Failed to update vehicle information');
      }
      
      const updateResult = await updateResponse.json();
      
      // Show success message for vehicle update but don't redirect yet
      toast.success('Vehicle information updated successfully!');
      
      // If we're not on the images step yet, just move to the next step
      if (activeTab < tabItems.length - 1) {
        goToNextStep();
        setIsLoading(false);
        return;
      }
      
      // Continue with image processing only if on the last step (images step)
      
      // Handle new image uploads if any
      if (selectedImages.length > 0) {
        try {
          console.log(`Uploading ${selectedImages.length} images directly to backend`);
          
          // Create FormData for file uploads
          const formData = new FormData();
          
          // Append each selected image
          selectedImages.forEach(image => {
            formData.append('images', image);
          });
          
          // Upload images directly to backend API
          const imageUploadResponse = await fetch(`${baseApiUrl}/api/cars/${id}/images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          
          if (!imageUploadResponse.ok) {
            const errorText = await imageUploadResponse.text();
            console.error('Image upload failed:', errorText);
            toast.error('Images uploaded but we had trouble saving some photos');
          } else {
            toast.success('Images uploaded successfully');
          }
        } catch (imageError) {
          console.error('Error uploading images:', imageError);
          toast.error('Failed to upload some images');
        }
      }
      
      // Handle deleting images if needed
      if (imagesToDelete.length > 0) {
        try {
          console.log(`Deleting ${imagesToDelete.length} images directly from backend`);
          console.log('Images to delete:', imagesToDelete);
          
          // Filter out any image IDs that start with "existing-" (used as fallback IDs)
          const validImageIds = imagesToDelete.filter(id => !id.startsWith('existing-'));
          
          if (validImageIds.length > 0) {
            console.log('Valid image IDs to delete:', validImageIds);
            
            // Delete images one by one to ensure proper deletion
            let deletionSuccessCount = 0;
            let deletionFailCount = 0;
            
            // Try different API formats for image deletion
            for (const imageId of validImageIds) {
              let deleted = false;
              
              // Try direct PUT request to update the car without the image
              try {
                console.log(`Trying to update car to remove image ${imageId}`);
                
                // Get current car data first
                const carResponse = await fetch(`${baseApiUrl}/api/cars/${id}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                
                if (carResponse.ok) {
                  const carData = await carResponse.json();
                  const car = carData.car || carData.data || carData;
                  
                  // Remove the image from the images array
                  if (car.images && Array.isArray(car.images)) {
                    const updatedImages = car.images.filter(img => {
                      const imgId = img._id || img.id;
                      return imgId !== imageId;
                    });
                    
                    // If we modified the images array, update the car
                    if (updatedImages.length < car.images.length) {
                      const updateResponse = await fetch(`${baseApiUrl}/api/cars/${id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          ...vehicleData,
                          images: updatedImages
                        })
                      });
                      
                      if (updateResponse.ok) {
                        deletionSuccessCount++;
                        deleted = true;
                        continue;
                      }
                    }
                  }
                }
              } catch (error) {
                console.error(`Error trying to update car to remove image ${imageId}:`, error);
              }
              
              if (deleted) continue;
              
              // Try first format: /api/cars/{id}/images/{imageId}
              try {
                const deleteResponse = await fetch(`${baseApiUrl}/api/cars/${id}/images/${imageId}`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                
                if (deleteResponse.ok) {
                  deletionSuccessCount++;
                  continue; // Proceed to next image
                }
              } catch (error) {
                console.error(`Error trying first deletion format for image ${imageId}:`, error);
              }
              
              // Try second format: /api/cars/images/{imageId}
              try {
                const deleteResponse2 = await fetch(`${baseApiUrl}/api/cars/images/${imageId}`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                
                if (deleteResponse2.ok) {
                  deletionSuccessCount++;
                  continue; // Proceed to next image
                }
              } catch (error) {
                console.error(`Error trying second deletion format for image ${imageId}:`, error);
              }
              
              // Try bulk deletion as last resort
              try {
                const bulkDeleteResponse = await fetch(`${baseApiUrl}/api/cars/${id}/images`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    imageIds: [imageId]
                  })
                });
                
                if (bulkDeleteResponse.ok) {
                  deletionSuccessCount++;
                } else {
                  deletionFailCount++;
                }
              } catch (error) {
                console.error(`Error trying bulk deletion for image ${imageId}:`, error);
                deletionFailCount++;
              }
            }
            
            if (deletionSuccessCount > 0) {
              console.log(`Successfully deleted ${deletionSuccessCount} out of ${validImageIds.length} images`);
              if (deletionFailCount > 0) {
                toast.warning(`Deleted ${deletionSuccessCount} images, but ${deletionFailCount} could not be deleted.`);
              } else {
                toast.success('All images deleted successfully');
              }
            } else {
              console.error('Failed to delete any images');
              toast.error('Vehicle updated but we had trouble removing photos');
            }
          } else {
            console.log('No valid image IDs to delete');
          }
        } catch (deleteError) {
          console.error('Error deleting images:', deleteError);
          toast.error('Failed to delete some images');
        }
      }
      
      // Show success message
      toast.success('All changes saved successfully!');
      setSuccessMessage('Vehicle updated successfully!');
      
      // Always reload the page after making changes to refresh the image list
      toast.success('Refreshing to show updated changes...');
      setTimeout(() => {
        window.location.href = `/admin/inventory`;
      }, 1500);
      
    } catch (error) {
      console.error('Error updating vehicle:', error);
      setErrorMessage(error.message || 'Failed to update vehicle');
      toast.error(error.message || 'Failed to update vehicle');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigation between form steps
  const goToNextStep = () => {
    const currentIndex = tabItems.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabItems.length - 1) {
      setActiveTab(tabItems[currentIndex + 1].id);
    }
  };
  
  const goToPrevStep = () => {
    const currentIndex = tabItems.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabItems[currentIndex - 1].id);
    }
  };

  // Determine if we're on the last tab
  const isLastTab = activeTab === tabItems[tabItems.length - 1].id;
  const isFirstTab = activeTab === tabItems[0].id;

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfoFields();
      case 'pricing':
        return renderPricingFields();
      case 'features':
        return renderFeatures();
      case 'images':
        return renderImageFields();
      default:
        return renderBasicInfoFields();
    }
  };

  // Basic Info fields
  const renderBasicInfoFields = () => {
    return (
      <div className="space-y-6">
        <SectionHeader 
          icon={Car} 
          title="Basic Vehicle Information" 
          description="Enter the primary details of the vehicle"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="col-span-full">
            <label htmlFor="title" className={labelClass}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={inputBaseClass}
              placeholder="Vehicle title/name"
              required
            />
          </div>
          <div>
            <label htmlFor="make" className={labelClass}>
              Make <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleInputChange}
              className={inputBaseClass}
              required
            />
          </div>
          <div>
            <label htmlFor="model" className={labelClass}>
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className={inputBaseClass}
              required
            />
          </div>
          <div>
            <label htmlFor="year" className={labelClass}>
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className={inputBaseClass}
              min={1900}
              max={new Date().getFullYear() + 1}
              required
            />
          </div>
          <div>
            <label htmlFor="trim" className={labelClass}>
              Trim Level
            </label>
            <input
              type="text"
              id="trim"
              name="trim"
              value={formData.trim}
              onChange={handleInputChange}
              className={inputBaseClass}
            />
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={selectBaseClass}
            >
              <option value="">Select Category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Wagon">Wagon</option>
              <option value="Van">Van</option>
              <option value="Minivan">Minivan</option>
              <option value="Luxury">Luxury</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label htmlFor="bodyType" className={labelClass}>
              Body Type
            </label>
            <input
              type="text"
              id="bodyType"
              name="bodyType"
              value={formData.bodyType}
              onChange={handleInputChange}
              className={inputBaseClass}
            />
          </div>
          <div>
            <label htmlFor="vin" className={labelClass}>
              VIN (Vehicle Identification Number) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleInputChange}
              className={`${inputBaseClass} focus:border-blue-500 font-medium`}
              placeholder="Enter vehicle chassis/VIN number (e.g., 039884)"
            />
            <p className="text-xs text-gray-500 mt-1">Enter the short VIN format commonly used in Kenya</p>
          </div>
          <div>
            <label htmlFor="stock" className={labelClass}>
              Stock #
            </label>
            <input
              type="text"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className={inputBaseClass}
            />
          </div>
          <div>
            <label htmlFor="color" className={labelClass}>
              Exterior Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className={inputBaseClass}
              placeholder="e.g., Midnight Blue"
            />
          </div>
          <div>
            <label htmlFor="interiorColor" className={labelClass}>
              Interior Color
            </label>
            <input
              type="text"
              id="interiorColor"
              name="interiorColor"
              value={formData.interiorColor}
              onChange={handleInputChange}
              className={inputBaseClass}
              placeholder="e.g., Beige Leather"
            />
          </div>
          
          {/* Dimension Fields */}
          <div className="col-span-full mt-4">
            <h3 className="text-md font-medium mb-3 border-b pb-2 text-gray-700">Vehicle Dimensions</h3>
          </div>
          
          <div>
            <label htmlFor="length" className={labelClass}>
              Length (mm)
            </label>
            <input
              type="text"
              id="length"
              name="length"
              value={formData.length}
              onChange={handleInputChange}
              className={inputBaseClass}
              placeholder="e.g., 4700 mm"
            />
          </div>
          <div>
            <label htmlFor="width" className={labelClass}>
              Width (mm)
            </label>
            <input
              type="text"
              id="width"
              name="width"
              onChange={handleInputChange}
              value={formData.width}
              className={inputBaseClass}
              placeholder="e.g., 1850 mm"
            />
          </div>
          <div>
            <label htmlFor="height" className={labelClass}>
              Height (mm)
            </label>
            <input
              type="text"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className={inputBaseClass}
              placeholder="e.g., 1650 mm"
            />
          </div>
          <div>
            <label htmlFor="cargoCapacity" className={labelClass}>
              Cargo Capacity (L)
            </label>
            <input
              type="text"
              id="cargoCapacity"
              name="cargoCapacity"
              value={formData.cargoCapacity}
              onChange={handleInputChange}
              className={inputBaseClass}
              placeholder="e.g., 500 L"
            />
          </div>
          <div>
            <label htmlFor="fuelCapacity" className={labelClass}>
              Fuel Capacity (L)
            </label>
            <input
              type="text"
              id="fuelCapacity"
              name="fuelCapacity"
              value={formData.fuelCapacity}
              onChange={handleInputChange}
              className={inputBaseClass}
              placeholder="e.g., 60 L"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            className={textareaBaseClass}
            placeholder="Detailed description of the vehicle"
          ></textarea>
        </div>
      </div>
    );
  };

  // Features fields
  const renderFeatures = () => {
    // Predefined feature categories with common options
    const predefinedFeatures = [
      { category: "Safety", features: ["Airbags", "ABS", "Stability Control", "Backup Camera", "Blind Spot Monitor", "Lane Departure Warning", "Parking Sensors", "Collision Warning", "Hill Start Assist", "Child Safety Locks", "ISOFIX", "Emergency Brake Assist"] },
      { category: "Technology", features: ["Bluetooth Connection", "Navigation System", "Apple CarPlay", "Android Auto", "Wireless Charging", "Premium Sound System", "Touchscreen Display", "Keyless Entry", "Remote Start", "Heads-Up Display", "WiFi Hotspot", "USB Ports", "Satellite Radio", "Voice Recognition"] },
      { category: "Comfort", features: ["Leather Seats", "Heated Seats", "Ventilated Seats", "Power Seats", "Memory Seats", "Dual-Zone Climate Control", "Climate Control", "Sunroof", "Moonroof", "Panoramic Roof", "Heated Steering Wheel", "Lumbar Support", "Third Row Seating", "Rear Window Shades"] },
      { category: "Performance", features: ["Turbo Engine", "All-Wheel Drive", "Sport Mode", "Paddle Shifters", "Performance Tires", "Sport Suspension", "Traction Control", "Launch Control", "Limited Slip Differential", "Performance Exhaust", "Adjustable Drive Modes", "Hill Descent Control"] },
      { category: "Exterior", features: ["Alloy Wheels", "Fog Lights", "LED Headlights", "Panoramic Roof", "Power Liftgate", "Roof Rack", "Tinted Windows", "Running Boards", "Sunroof", "Tow Hitch", "Power Folding Mirrors", "Chrome Accents", "Rear Spoiler"] },
      { category: "Convenience", features: ["Push Button Start", "Power Windows", "Power Locks", "Cruise Control", "Adaptive Cruise Control", "Rain-Sensing Wipers", "Auto-Dimming Mirror", "Automatic Headlights", "Power Outlets", "Keyless Entry", "Hands-Free Trunk", "Memory Settings"] },
      { category: "Driver Assistance", features: ["Automatic Emergency Braking", "Forward Collision Warning", "Pedestrian Detection", "Traffic Sign Recognition", "Driver Attention Monitor", "360-Degree Camera", "Adaptive Headlights", "Self-Parking System", "Traffic Jam Assist", "Night Vision", "Rear Cross Traffic Alert"] },
      { category: "Engine Specs", features: [
        "1.5L Engine", 
        "1.6L Engine", 
        "1.8L Engine", 
        "2.0L Engine", 
        "2.2L Diesel", 
        "2.5L Engine", 
        "3.0L Engine", 
        "V6 Engine", 
        "V8 Engine",
        "Turbo Charged",
        "Direct Injection",
        "Common Rail"
      ]},
      { category: "Dimensions", features: [
        "Length: 4000-4500 mm", 
        "Length: 4501-5000 mm", 
        "Length: 5001+ mm",
        "Width: 1700-1800 mm", 
        "Width: 1801-1900 mm", 
        "Width: 1901+ mm",
        "Height: 1500-1600 mm", 
        "Height: 1601-1700 mm", 
        "Height: 1701+ mm",
        "Cargo Capacity: 300+ L", 
        "Cargo Capacity: 500+ L", 
        "Cargo Capacity: 800+ L",
        "Fuel Capacity: 40+ L", 
        "Fuel Capacity: 60+ L", 
        "Fuel Capacity: 80+ L"
      ]},
      { category: "Drivetrain", features: ["Front-Wheel Drive", "Rear-Wheel Drive", "All-Wheel Drive", "Four-Wheel Drive", "Part-Time 4WD", "Selectable 4WD"] },
      { category: "Kenyan Market", features: [
        "Right-Hand Drive", 
        "Duty Paid", 
        "Locally Used", 
        "First Owner", 
        "Japanese Import", 
        "UK Import", 
        "Dubai Import", 
        "South Africa Import",
        "Negotiable",
        "Fixed Price",
        "Trade-In Welcome",
        "Bank Financing Available",
        "Comprehensive Insurance Available"
      ]}
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
      { label: "Engine", options: ["1.5L Engine", "1.6L Engine", "1.8L Engine", "2.0L Engine", "2.2L Diesel", "2.5L Engine", "3.0L Engine", "V6 Engine", "V8 Engine"] },
      { label: "Horsepower", options: ["100-150 hp", "151-200 hp", "201-250 hp", "251-300 hp", "301-350 hp", "351+ hp"] },
      { label: "Torque", options: ["150-200 Nm", "201-250 Nm", "251-300 Nm", "301-350 Nm", "351-400 Nm", "400+ Nm"] },
      { label: "Transmission", options: ["Manual", "Automatic", "CVT", "Dual-Clutch", "Semi-Automatic"] },
      { label: "Drivetrain", options: ["Front-Wheel Drive", "Rear-Wheel Drive", "All-Wheel Drive", "Four-Wheel Drive"] },
      { label: "Dimensions", options: [
        "Length: 4000-4500 mm", "Length: 4501-5000 mm", "Length: 5001+ mm",
        "Width: 1700-1800 mm", "Width: 1801-1900 mm", "Width: 1901+ mm",
        "Height: 1500-1600 mm", "Height: 1601-1700 mm", "Height: 1701+ mm",
        "Cargo Capacity: 300+ L", "Cargo Capacity: 500+ L", "Cargo Capacity: 800+ L",
        "Fuel Capacity: 40+ L", "Fuel Capacity: 60+ L", "Fuel Capacity: 80+ L"
      ]}
    ];
    
    return (
      <div>
        <SectionHeader 
          icon={Tag} 
          title="Vehicle Features" 
          description="Add key features and selling points"
        />
        
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
            className={`ml-2 px-4 py-2 rounded-md text-sm font-medium ${
              !newFeature.trim()
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-orange-500 hover:bg-orange-600 text-white transition-colors'
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
                    onClick={() => handleRemoveFeature(index)}
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

  // Images section
  const renderImageFields = () => {
    return (
      <div>
        <h3 className="text-lg font-medium mb-4">Vehicle Images</h3>
        
        {/* Image upload */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Images
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB per image)</p>
              </div>
              <input
                id="imageUpload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>
          </div>
        </div>
        
        {/* Selected Images Preview */}
        {selectedImages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              New Images to Upload:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSelectedImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingImages.map((image, index) => {
                // Get image ID based on API response structure
                const imageId = image._id || image.id || `existing-${index}`;
                const imageUrl = image.url || image.secure_url || image;
                
                return (
                  <div key={index} className="relative group">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Car image ${index}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleMarkImageForDeletion(imageId, index)}
                        className={`p-2 rounded-full ${
                          imagesToDelete.includes(imageId)
                            ? 'bg-red-500'
                            : 'bg-white text-gray-700'
                        }`}
                      >
                        {imagesToDelete.includes(imageId) ? (
                          <Check size={16} className="text-white" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                    {imagesToDelete.includes(imageId) && (
                      <div className="absolute top-0 left-0 w-full h-full bg-red-500 bg-opacity-30 flex items-center justify-center">
                        <p className="text-white text-xs font-bold">MARKED FOR DELETION</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {imagesToDelete.length > 0 && (
              <p className="mt-2 text-sm text-red-600">
                {imagesToDelete.length} image(s) marked for deletion. Changes will apply after saving.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Pricing & Performance fields
  const renderPricingFields = () => {
    return (
      <div className="space-y-6">
        <SectionHeader 
          icon={DollarSign} 
          title="Pricing & Performance Information" 
          description="Enter pricing details and performance specifications"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Price */}
          <div>
            <label htmlFor="price" className={labelClass}>
              Price (KSh) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium">
                KSh
              </span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`${inputBaseClass} pl-12`}
                min="0"
                step="1000"
                required
              />
            </div>
          </div>
          
          {/* MSRP */}
          <div>
            <label htmlFor="msrp" className={labelClass}>
              MSRP (KSh)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium">
                KSh
              </span>
              <input
                type="number"
                id="msrp"
                name="msrp"
                value={formData.msrp}
                onChange={handleInputChange}
                className={`${inputBaseClass} pl-12`}
                min="0"
                step="1000"
              />
            </div>
          </div>
          
          {/* Mileage */}
          <div>
            <label htmlFor="mileage" className={labelClass}>
              Mileage
            </label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleInputChange}
              className={inputBaseClass}
              min="0"
            />
          </div>
          
          {/* Transmission */}
          <div>
            <label htmlFor="transmission" className={labelClass}>
              Transmission
            </label>
            <select
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleInputChange}
              className={selectBaseClass}
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          
          {/* Fuel Type */}
          <div>
            <label htmlFor="fuelType" className={labelClass}>
              Fuel Type
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              className={selectBaseClass}
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
              <option value="LPG">LPG</option>
            </select>
          </div>
          
          {/* Engine Size */}
          <div>
            <label htmlFor="engineSize" className={labelClass}>
              Engine Size (L)
            </label>
            <input
              type="number"
              id="engineSize"
              name="engineSize"
              value={formData.engineSize}
              onChange={handleInputChange}
              className={inputBaseClass}
              min="0"
              step="0.1"
            />
          </div>
          
          {/* Condition */}
          <div>
            <label htmlFor="condition" className={labelClass}>
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className={selectBaseClass}
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Certified Pre-Owned">Certified Pre-Owned</option>
            </select>
          </div>
          
          {/* Doors */}
          <div>
            <label htmlFor="doors" className={labelClass}>
              Doors
            </label>
            <input
              type="number"
              id="doors"
              name="doors"
              value={formData.doors}
              onChange={handleInputChange}
              className={inputBaseClass}
              min="1"
              max="8"
            />
          </div>
          
          {/* Performance Specifications */}
          <div className="col-span-full mt-4">
            <h3 className="text-md font-medium mb-3 border-b pb-2 text-gray-700">Performance Specifications</h3>
          </div>
          
          <div>
            <label htmlFor="horsepower" className={labelClass}>
              Horsepower
            </label>
            <input
              type="text"
              id="horsepower"
              name="horsepower"
              value={formData.horsepower}
              onChange={handleInputChange}
              className={inputBaseClass}
              placeholder="e.g., 248 hp"
            />
          </div>
          
          <div>
            <label htmlFor="torque" className={labelClass}>
              Torque
            </label>
            <input
              type="text"
              id="torque"
              name="torque"
              value={formData.torque}
              onChange={handleInputChange}
              className={inputBaseClass}
              placeholder="e.g., 258 lb-ft"
            />
          </div>
          
          <div>
            <label htmlFor="drivetrain" className={labelClass}>
              Drivetrain
            </label>
            <select
              id="drivetrain"
              name="drivetrain"
              value={formData.drivetrain}
              onChange={handleInputChange}
              className={selectBaseClass}
            >
              <option value="">Select Drivetrain</option>
              <option value="Front-Wheel Drive">Front-Wheel Drive</option>
              <option value="Rear-Wheel Drive">Rear-Wheel Drive</option>
              <option value="All-Wheel Drive">All-Wheel Drive</option>
              <option value="Four-Wheel Drive">Four-Wheel Drive</option>
            </select>
          </div>
        </div>
      </div>
    );
  };
  
  // Loading state
  if (isLoadingCar) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="animate-spin mb-4">
          <Loader2 size={48} className="text-orange-500" />
        </div>
        <p className="text-gray-600 text-lg">Loading vehicle data...</p>
      </div>
    );
  }
  
  // Error state
  if (errorMessage && !formData.make) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-red-100 p-4 rounded-lg mb-4">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-2" />
          <p className="text-red-700 text-center">{errorMessage}</p>
        </div>
        <Link
          href="/admin/inventory"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <ArrowLeft className="mr-2 -ml-1 h-5 w-5 text-gray-500" aria-hidden="true" />
          Back to Inventory
        </Link>
      </div>
    );
  }
  
  // Move FormStepper inside the component
  const FormStepper = ({ currentTab }) => {
    return (
      <div className="flex border-b">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
              currentTab === tab.id
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };
  
  // Template will be filled in the next edit
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Vehicle</h1>
            <p className="mt-1 text-sm text-gray-500">Update vehicle information in your inventory</p>
          </div>
          <Link
            href="/admin/inventory"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <ArrowLeft className="mr-2 -ml-1 h-5 w-5 text-gray-500" aria-hidden="true" />
            Back to Inventory
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Form header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileEdit className="h-6 w-6 mr-2 text-orange-500" />
              Edit Vehicle
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Update vehicle information, features, and images.
            </p>
          </div>
          
          {/* Progress indicator */}
          <div className="mb-8 py-4">
            <FormStepper currentTab={activeTab} />
          </div>
          
          {/* Form content */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              
              // Only submit if on the last tab and the update button is clicked
              if (activeTab === 'images') {
                handleSubmit(e);
              }
            }}>
            <div className="p-6">
              {renderTabContent()}
            </div>
            
            {/* Form actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={goToPrevStep}
                disabled={isFirstTab}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  isFirstTab 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              {!isLastTab ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent any form submission
                    goToNextStep();
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-orange-500 text-white hover:bg-orange-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-orange-500 text-white hover:bg-orange-600 flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="-ml-1 mr-2 h-4 w-4" />
                      Update Vehicle
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 