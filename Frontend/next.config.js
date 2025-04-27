/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://my-ride-hhne.vercel.app',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://my-ride-git-main-rashid8740s-projects.vercel.app'
  },
  // Handle both API and dynamic page routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      }
    ];
  },
  // Don't use exportPathMap in development as it interferes with page routing
  // If exporting a static site, add all routes here
  /* 
  async exportPathMap() {
    return {
      '/': { page: '/' },
      '/login': { page: '/login' },
      '/register': { page: '/register' },
      '/forgot-password': { page: '/forgot-password' },
      '/contact': { page: '/contact' },
      '/cars': { page: '/cars' },
      '/about': { page: '/about' },
      '/services': { page: '/services' },
      '/inventory': { page: '/inventory' },
      '/favorites': { page: '/favorites' },
      // Add other routes as needed
    };
  },
  */
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
}

module.exports = nextConfig 