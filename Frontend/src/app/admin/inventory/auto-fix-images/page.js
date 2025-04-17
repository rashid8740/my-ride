"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Car, Upload, Save, ArrowLeft, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import Link from 'next/link';

export default function AutoFixImagesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [carId, setCarId] = useState('67f1826a4d0870549fe6f515');

  const handleFixImages = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/fix-car-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update car images');
      }

      setSuccess(`Successfully updated car with ${data.imageCount} images.`);
      toast.success('Car images updated successfully');
    } catch (err) {
      console.error('Error fixing car images:', err);
      setError(err.message || 'An error occurred while fixing the car images');
      toast.error('Failed to fix car images');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/admin/inventory" 
          className="flex items-center text-gray-600 hover:text-orange-500 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Inventory
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <ImageIcon className="h-6 w-6 mr-2 text-orange-500" />
          Auto Fix Car Images
        </h1>
        <p className="text-gray-600 mt-1">
          This utility will automatically find your Cloudinary images and add them to the selected car
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Loader2 className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
              <div className="mt-2">
                <Link
                  href={`/cars/${carId}`}
                  className="text-sm text-green-600 font-medium hover:text-green-500"
                >
                  View Car Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <label htmlFor="carId" className="block text-sm font-medium text-gray-700 mb-1">
            Car ID
          </label>
          <input
            type="text"
            id="carId"
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            ID of the car you want to update with Cloudinary images
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleFixImages}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Updating...
              </>
            ) : (
              <>
                <Upload className="-ml-1 mr-2 h-5 w-5" />
                Fix Car Images Automatically
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 