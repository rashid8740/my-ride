#!/bin/bash

# Vercel build script to ensure clean builds
echo "Running Vercel build script..."

# Debug environment variables (safely)
echo "Checking environment variables..."
if [ -n "$NEXT_PUBLIC_API_URL" ]; then
  echo "NEXT_PUBLIC_API_URL is set to: $NEXT_PUBLIC_API_URL"
else
  echo "NEXT_PUBLIC_API_URL is not set! Will default to localhost in development."
fi

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
npm install @emotion/react @emotion/styled @babel/core @emotion/babel-plugin

# Create a minimal next.config.js
echo "Setting up next.config.js..."
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  }
}

module.exports = nextConfig
EOL

# Create a .env.local file for the build
echo "Setting up .env.local for build process..."
if [ -n "$NEXT_PUBLIC_API_URL" ]; then
  echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > .env.local
  echo "Created .env.local with API URL"
else 
  echo "NEXT_PUBLIC_API_URL=https://my-ride-backend.vercel.app" > .env.local
  echo "Created .env.local with default backend API URL"
fi

# Run the build
echo "Running build..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "Build completed!" 