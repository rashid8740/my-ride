import { getAuthToken } from '@/utils/auth';

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
    
    const { carId, imageIds } = req.body;
    
    if (!carId || !imageIds || !Array.isArray(imageIds)) {
      return res.status(400).json({ message: 'Invalid request. carId and imageIds array required.' });
    }
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Call backend API to delete images
    const deleteUrl = `${backendUrl}/api/cars/${carId}/images`;
    console.log(`Deleting images for car ${carId}:`, imageIds);
    
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ imageIds })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from backend:', errorData);
      return res.status(response.status).json(errorData);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error deleting car images:', error);
    return res.status(500).json({ 
      message: error.message || 'An error occurred while deleting car images' 
    });
  }
} 