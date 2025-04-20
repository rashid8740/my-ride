#!/bin/bash

# Vercel build script to ensure clean builds
echo "Running Vercel build script..."

# Remove all build caches and temporary files
echo "Cleaning build environment..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .vercel

# Force clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Reinstall dependencies to ensure everything is fresh
echo "Installing dependencies..."
npm ci

# Install required emotion dependencies explicitly
echo "Installing @emotion/react and @emotion/styled..."
npm install @emotion/react @emotion/styled

# Run the build with production flag
echo "Running production build..."
NODE_ENV=production npm run build

echo "Build completed!" 