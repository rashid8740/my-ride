import { getAuthToken } from '@/utils/auth';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

// Disable Next.js default body parsing for form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get auth token
    const token = getAuthToken(req);
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Parse form data with formidable
    const form = new formidable.IncomingForm({
      multiples: true,
      keepExtensions: true,
    });
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });
    
    const carId = fields.carId;
    
    if (!carId) {
      return res.status(400).json({ message: 'Car ID is required' });
    }
    
    // Prepare formData for backend request
    const formData = new FormData();
    formData.append('carId', carId);
    
    // Add images to formData
    let images = files.images;
    if (!images) {
      return res.status(400).json({ message: 'No images provided' });
    }
    
    // Ensure images is an array
    if (!Array.isArray(images)) {
      images = [images];
    }
    
    // Add each image file to formData
    let hasValidImages = false;
    for (const image of images) {
      if (image && image.filepath && fs.existsSync(image.filepath)) {
        const fileContent = fs.readFileSync(image.filepath);
        const filename = image.originalFilename || `image-${Date.now()}.jpg`;
        formData.append('images', fileContent, {
          filename,
          contentType: image.mimetype || 'image/jpeg'
        });
        hasValidImages = true;
      }
    }
    
    if (!hasValidImages) {
      return res.status(400).json({ message: 'No valid images found' });
    }
    
    // Send request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const uploadUrl = `${backendUrl}/api/cars/${carId}/images`;
    
    console.log(`Uploading ${images.length} images to car ${carId}`);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to upload images';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      return res.status(response.status).json({ message: errorMessage });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error uploading car images:', error);
    return res.status(500).json({ 
      message: error.message || 'An error occurred while uploading car images' 
    });
  }
} 