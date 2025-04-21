# Complete Vercel Deployment Guide

This document provides a step-by-step guide to deploy both the frontend and backend of the My Ride application to Vercel.

## Architecture Overview

Our application consists of two components:
1. **Frontend**: Next.js application (in the `Frontend` directory)
2. **Backend**: Node.js/Express API (in the `Backend` directory)

Both need to be deployed as separate applications in Vercel.

## Step 1: Deploy the Backend

1. Create a new project in Vercel
2. Link your GitHub repository
3. Configure the build settings:
   - Root Directory: `Backend`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist` (if applicable)

4. Add the following environment variables:
   - `MONGODB_URI`: `mongodb+srv://username:password@your-cluster.mongodb.net/my-ride`
   - `JWT_SECRET`: `your-secure-jwt-secret`
   - Any other required variables like Cloudinary credentials

5. Deploy the backend
6. Take note of the deployment URL (e.g., `https://my-ride-backend.vercel.app`)

## Step 2: Deploy the Frontend

1. Create another new project in Vercel
2. Link the same GitHub repository
3. Configure the build settings:
   - Root Directory: `Frontend`
   - Build Command: `./vercel-build.sh`
   - Output Directory: `.next`

4. Add the following environment variables:
   - `NEXT_PUBLIC_API_URL`: The URL of your backend (e.g., `https://my-ride-backend.vercel.app`)
   - Any other required variables for the frontend

5. Deploy the frontend

## Environment Variables Reference

### Backend Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `PORT`: (Optional) Port for the server to run on (Vercel will override this)
- `NODE_ENV`: (Optional) Set to "production" by Vercel automatically

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: URL to the backend API (critical!)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name (if using Cloudinary)
- `NEXT_PUBLIC_CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret (server-side only)

## Troubleshooting

### Network Error / Cannot Connect to Backend
If you see "Network error. Please check if the backend server is running and accessible":

1. Make sure both frontend and backend are deployed
2. Verify the `NEXT_PUBLIC_API_URL` is correctly set in the frontend project
3. Check if the backend is running by visiting the backend URL directly
4. Test the API health endpoint: `https://your-backend-url.vercel.app/api/health`

### Database Connection Issues
If the backend can't connect to MongoDB:

1. Ensure `MONGODB_URI` is correctly set in the backend project
2. Check if the IP address is whitelisted in MongoDB Atlas (add 0.0.0.0/0 for all IPs)
3. Verify the database credentials and database name are correct

### CORS Issues
If you have CORS errors in the console:

1. Make sure your backend is properly configured to accept requests from your frontend domain
2. Add the frontend domain to the CORS allowed origins in your backend code

## Testing the Deployment

After deploying both parts:

1. Visit your frontend URL
2. Try to log in or browse cars
3. Check the browser console for any errors
4. Monitor the Vercel logs for both frontend and backend 