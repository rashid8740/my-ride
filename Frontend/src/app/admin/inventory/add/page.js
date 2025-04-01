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
  Camera
} from 'lucide-react';
import apiService from '@/utils/api';

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
  });
  
  const [images, setImages] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  
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
      // Preview images
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setImages(prev => [...prev, ...newImages]);
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
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage('');
      
      // First create the car entry
      const carResponse = await apiService.cars.create(formData);
      
      if (!carResponse.data || !carResponse.data._id) {
        throw new Error('Failed to create car entry');
      }
      
      const carId = carResponse.data._id;
      
      // If we have images, upload them
      if (images.length > 0) {
        const imageFiles = images.map(img => img.file);
        await apiService.cars.uploadImages(carId, imageFiles);
      }
      
      setSuccessMessage('Vehicle added successfully');
      
      // Redirect to the car detail page after a delay
      setTimeout(() => {
        router.push(`/admin/inventory/edit/${carId}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError(err.message || 'Failed to add vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
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
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/admin/inventory" className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
            <p className="text-gray-500 mt-1">Create a new vehicle listing in your inventory</p>
          </div>
        </div>
      </div>
      
      {/* Progress Stepper */}
      <div className="hidden md:flex mb-8 justify-between items-center">
        {formSections.map((section, index) => (
          <FormStep 
            key={index}
            title={section.title}
            number={index + 1}
            active={currentStep === index}
            completed={currentStep > index}
          />
        ))}
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Rest of the form will be updated in subsequent edits */}
          </div>
        </form>
      </div>
    </div>
  );
} 