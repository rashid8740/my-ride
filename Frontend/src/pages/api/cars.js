// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getAuthToken } from '@/utils/auth';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Log request params
      console.log('Request params:', req.query);
      
      // Prepare query params
      const queryParams = new URLSearchParams();
      Object.entries(req.query).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      // Construct the request URL
      const apiUrl = `${backendUrl}/api/cars${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('Using backend URL:', apiUrl);

      // Make the request
      const response = await fetch(apiUrl);
      
      // Handle non-200 responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend returned ${response.status}: ${errorText}`);
        
        // Provide a more helpful error message
        return res.status(response.status).json({ 
          status: 'error', 
          message: `Backend server error: ${response.status}`,
          detail: errorText.substring(0, 500) // Limit long error messages
        });
      }
      
      // Parse and return the data
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch cars data',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ status: 'error', message: `Method ${req.method} Not Allowed` });
  }
} 