"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Car, Upload, Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function FixImagesPage() {
  const router = useRouter();
  const [carId, setCarId] = useState('67f1826a4d0870549fe6f515');
  const [imageUrls, setImageUrls] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Parse the image URLs (expected format: one URL per line)
      const urls = imageUrls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      if (urls.length === 0) {
        setError('Please enter at least one valid image URL');
        setIsLoading(false);
        return;
      }

      // Convert to the format expected by the API
      const images = urls.map(url => ({ url }));

      // Send the update to the API
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update car images');
      }

      const data = await response.json();
      setSuccess(`Successfully updated car images! Car now has ${data.data.images.length} images.`);
      toast.success('Car images updated successfully');
    } catch (err) {
      console.error('Error updating car images:', err);
      setError(err.message || 'An error occurred while updating the car images');
      toast.error('Failed to update car images');
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
          Fix Car Images
        </h1>
        <p className="text-gray-600 mt-1">
          Use this utility to add Cloudinary image URLs to a car record
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
        <form onSubmit={handleSubmit}>
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
              The ID of the car you want to update
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="imageUrls" className="block text-sm font-medium text-gray-700 mb-1">
              Image URLs (one per line)
            </label>
            <textarea
              id="imageUrls"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              rows={8}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/my-ride/cars/example1.jpg&#10;https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/my-ride/cars/example2.jpg"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter Cloudinary image URLs, one per line
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="-ml-1 mr-2 h-4 w-4" />
                  Update Car Images
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 