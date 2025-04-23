/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://my-ride-backend-tau.vercel.app',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://my-ride-git-main-rashid8740s-projects.vercel.app'
  },
  // This ensures that Next.js can correctly handle client-side routing
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      // This ensures any route that doesn't match other specific routes is handled by the homepage
      {
        source: '/:path*',
        destination: '/',
      },
    ];
  },
  // Make sure all pages fallback to index for client-side routing
  async exportPathMap() {
    return {
      '/': { page: '/' },
    };
  },
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
}

module.exports = nextConfig 