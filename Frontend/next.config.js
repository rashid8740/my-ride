/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizeCss: true,
    optimisticClientCache: true,
  },
  webpack: (config, { isServer }) => {
    // Fix module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Optimize chunk size
    config.optimization.chunkIds = 'deterministic';
    
    return config;
  },
}

module.exports = nextConfig 