#!/bin/bash

echo "Running root-level build script..."

# Check if we're in the Frontend directory
if [ -d "Frontend" ]; then
  echo "Found Frontend directory, navigating to it..."
  cd Frontend
else
  echo "Already in the Frontend directory or structure is different"
fi

# Check if vercel-build.sh exists and is executable
if [ -f "vercel-build.sh" ]; then
  echo "Found vercel-build.sh, making it executable..."
  chmod +x vercel-build.sh
  
  echo "Running vercel-build.sh..."
  ./vercel-build.sh
else
  echo "Could not find vercel-build.sh, running a default build process..."
  
  # Clean up and install dependencies
  rm -rf .next node_modules package-lock.json
  npm install
  
  # Install required emotion dependencies
  npm install @emotion/react @emotion/styled @babel/core @emotion/babel-plugin
  
  # Create basic next.config.js
  echo "/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  }
}
module.exports = nextConfig" > next.config.js
  
  # Run the build
  npm run build
fi 