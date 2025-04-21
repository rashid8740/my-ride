import { getAuthToken } from '@/utils/auth';

// Sample fallback data if backend is down
const FALLBACK_VEHICLES = [
  {
    _id: "fallback1",
    title: "2023 Toyota Camry",
    price: 32000,
    year: 2023,
    make: "Toyota",
    model: "Camry",
    mileage: 5000,
    fuelType: "Hybrid",
    transmission: "Automatic",
    description: "Brand new Toyota Camry with excellent fuel efficiency",
    images: [
      { url: "https://res.cloudinary.com/dghr3juaj/image/upload/v1692345678/cars/camry_1.jpg" }
    ],
    status: "available",
    featured: true
  },
  {
    _id: "fallback2",
    title: "2022 Honda Accord",
    price: 28500,
    year: 2022,
    make: "Honda",
    model: "Accord",
    mileage: 12000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    description: "Well-maintained Honda Accord with low mileage",
    images: [
      { url: "https://res.cloudinary.com/dghr3juaj/image/upload/v1692345678/cars/accord_1.jpg" }
    ],
    status: "available",
    featured: true
  },
  {
    _id: "fallback3",
    title: "2021 Tesla Model 3",
    price: 45000,
    year: 2021,
    make: "Tesla",
    model: "Model 3",
    mileage: 15000,
    fuelType: "Electric",
    transmission: "Automatic",
    description: "Premium electric vehicle with all features",
    images: [
      { url: "https://res.cloudinary.com/dghr3juaj/image/upload/v1692345678/cars/tesla_1.jpg" }
    ],
    status: "available",
    featured: true
  }
];

export default async function handler(req, res) {
  // Set CORS headers for better cross-origin support
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get backend URL from environment or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('Using backend URL:', `${backendUrl}/api/cars`);
    
    // Try to get data from backend
    let data;
    try {
      const response = await fetch(`${backendUrl}/api/cars`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Short timeout to quickly fall back to demo data if backend is down
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }
      
      data = await response.json();
      
      // If backend returns empty data, use fallback
      if (!data.data || data.data.length === 0) {
        console.log('Backend returned empty data, using fallback');
        return res.status(200).json({
          status: 'success',
          message: 'Using fallback data (backend returned empty)',
          data: FALLBACK_VEHICLES,
          usingFallback: true
        });
      }
    } catch (backendError) {
      console.error('Error fetching from backend:', backendError.message);
      
      // If backend is unreachable, use fallback data
      console.log('Using fallback vehicle data');
      return res.status(200).json({
        status: 'success', 
        message: 'Using fallback data (backend unreachable)',
        data: FALLBACK_VEHICLES,
        usingFallback: true
      });
    }
    
    // Return the data from backend if we got here
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in vehicles API route:', error);
    
    // Final fallback - always return some data
    return res.status(200).json({
      status: 'success',
      message: 'Using emergency fallback data',
      data: FALLBACK_VEHICLES,
      usingFallback: true,
      error: error.message
    });
  }
} 