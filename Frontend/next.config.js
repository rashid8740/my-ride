/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Hardcoded environment variables as a fallback
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://my-ride-backend-tau.vercel.app',
  },
  async rewrites() {
    return {
      fallback: [
        // Fallback to the backend API if on production
        {
          source: '/api/:path*',
          destination: 'https://my-ride-backend-tau.vercel.app/api/:path*',
        },
      ],
    };
  },
}

module.exports = nextConfig 