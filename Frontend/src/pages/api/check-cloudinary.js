import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Log configuration (for server logs only, not returned to browser)
    console.log('Cloudinary Configuration:', {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ? 'Present' : 'Missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing',
    });

    // Get the search options from the query string
    const { folder = 'my-ride/cars', limit = 10 } = req.query;

    // Search for resources in the specified folder
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('created_at', 'desc')
      .max_results(parseInt(limit))
      .execute();

    // Return the resources
    return res.status(200).json({
      status: 'success',
      cloudinary_config: {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key_present: !!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        api_secret_present: !!process.env.CLOUDINARY_API_SECRET,
      },
      data: {
        total: result.total_count,
        resources: result.resources.map(resource => ({
          public_id: resource.public_id,
          url: resource.secure_url,
          format: resource.format,
          created_at: resource.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('Error checking Cloudinary:', error);
    
    return res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while checking Cloudinary',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      cloudinary_config: {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key_present: !!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        api_secret_present: !!process.env.CLOUDINARY_API_SECRET,
      },
    });
  }
} 