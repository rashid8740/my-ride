#!/bin/bash

# Script to deploy backend to Vercel

echo "Deploying My Ride Backend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies..."
npm install

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment completed!"
echo "Make note of the deployed URL and update your frontend's NEXT_PUBLIC_API_URL in Vercel environment variables." 