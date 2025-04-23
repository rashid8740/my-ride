/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://my-ride-hhne.vercel.app',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://my-ride-git-main-rashid8740s-projects.vercel.app'
  },
  // Handle 404 pages by redirecting to custom error page
  async redirects() {
    return [
      {
        source: '/404',
        destination: '/',
        permanent: false,
      },
    ];
  },
  // Ensure client-side routing works properly
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
}

module.exports = nextConfig 