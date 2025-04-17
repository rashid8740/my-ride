import { getAuthToken } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the car ID from the request body or use the default one
    const { carId = '67f1826a4d0870549fe6f515' } = req.body;
    
    // Get the auth token
    const token = getAuthToken(req);

    // Configure API URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Step 1: Fetch Cloudinary images
    console.log("Fetching Cloudinary images...");
    const cloudinaryResponse = await fetch(`http://localhost:3000/api/check-cloudinary`);
    
    if (!cloudinaryResponse.ok) {
      throw new Error(`Failed to fetch Cloudinary images: ${cloudinaryResponse.status}`);
    }
    
    const cloudinaryData = await cloudinaryResponse.json();
    
    if (!cloudinaryData.data || !cloudinaryData.data.resources || !cloudinaryData.data.resources.length) {
      throw new Error('No Cloudinary images found');
    }
    
    // Extract image URLs
    const imageUrls = cloudinaryData.data.resources.map(resource => resource.url);
    console.log(`Found ${imageUrls.length} Cloudinary images`);
    
    // Format images for the car update
    const images = imageUrls.map(url => ({ url }));
    
    // Step 2: Update the car with the images
    console.log(`Updating car ${carId} with ${images.length} images...`);
    const updateUrl = `${backendUrl}/api/cars/${carId}`;
    
    console.log("Update URL:", updateUrl);
    console.log("Update payload:", JSON.stringify({ images }));
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ images })
    });
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update car: ${updateResponse.status} - ${errorText}`);
    }
    
    const updateData = await updateResponse.json();
    
    return res.status(200).json({
      status: 'success',
      message: `Successfully updated car with ${images.length} images`,
      carId,
      imageCount: images.length,
      data: updateData
    });
  } catch (error) {
    console.error('Error fixing car images:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while fixing car images'
    });
  }
} 