/**
 * This API endpoint provides information about environment variables
 * for debugging purposes only. Never expose sensitive data.
 */
export default function handler(req, res) {
  // Collect safe environment variables (no secrets)
  const safeEnvVars = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  };

  // Share the environment details
  return res.status(200).json({
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    variables: safeEnvVars
  });
} 