#!/bin/bash

# Vercel build script to ensure clean builds
echo "Running Vercel build script..."

# Remove previous build cache if it exists
if [ -d ".next" ]; then
  echo "Removing previous Next.js build cache..."
  rm -rf .next
fi

# Completely clean node_modules for fresh install
echo "Cleaning node_modules..."
rm -rf node_modules
rm -rf package-lock.json

# Reinstall dependencies to ensure everything is fresh
echo "Installing dependencies..."
npm install --force

# Install required emotion dependencies
echo "Installing @emotion/react and @emotion/styled..."
npm install @emotion/react @emotion/styled

# Create a minimal next.config.js if needed
echo "Setting up next.config.js..."
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  webpack: (config) => {
    // Fix module resolution issues
    config.optimization.moduleIds = 'deterministic';
    return config;
  },
  // Add environment variables from Vercel
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://my-ride-backend.vercel.app',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://my-ride-frontend.vercel.app',
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
  }
}

module.exports = nextConfig
EOL

# Check if we're in Vercel environment
if [ -n "$VERCEL" ]; then
  echo "Running in Vercel environment. Ensuring environment variables..."
  # Create .env.production file with the right variables if it doesn't exist
  if [ ! -f ".env.production" ]; then
    echo "Creating .env.production file..."
    cat > .env.production << 'EOL'
# Production environment variables
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-https://my-ride-backend.vercel.app}
NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-https://my-ride-frontend.vercel.app}
EOL
  fi
fi

# Run the build
echo "Running build with environment variables:"
echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "Build completed!" 