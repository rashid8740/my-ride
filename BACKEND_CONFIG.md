# Backend Configuration Guide

## Overview

This project has a frontend and backend that need to communicate with each other. In development, they run locally, but in production, they need proper configuration to find each other.

## Environment Variables

The following environment variables need to be set in your Vercel deployment:

### Frontend Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | URL of your backend API | `https://api.my-ride.com` or `https://my-ride-backend.vercel.app` |
| `NODE_ENV` | Environment mode | `production` (set automatically by Vercel) |

### Backend Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/database` |
| `JWT_SECRET` | Secret for JWT token generation | `your-secret-key` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |

## Setting Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Click on "Settings" tab
4. Go to "Environment Variables" section
5. Add each variable and its value
6. Click "Save"

## Deploying Backend and Frontend

For proper communication between frontend and backend:

1. Deploy your backend first
2. Note the URL of your deployed backend API (e.g., `https://my-ride-backend.vercel.app`)
3. Set the `NEXT_PUBLIC_API_URL` in your frontend project to point to this backend URL
4. Deploy your frontend

## Troubleshooting Connection Issues

If you see the error "Network error. Please check if the backend server is running and accessible", it usually means:

1. Your backend is not running
2. The `NEXT_PUBLIC_API_URL` is not set correctly
3. There's a CORS issue preventing the frontend from accessing the backend

### Common Solutions:

1. Verify your backend is deployed and running by visiting `YOUR_BACKEND_URL/api/health`
2. Check that `NEXT_PUBLIC_API_URL` is set correctly in Vercel environment variables
3. Ensure your backend has proper CORS configuration allowing requests from your frontend domain

## MongoDB Configuration

The MongoDB connection string should be in this format:
```
mongodb+srv://username:password@cluster.mongodb.net/database
```

Make sure to:
1. Replace `username` and `password` with your MongoDB Atlas credentials
2. Use the correct cluster address
3. Specify the database name at the end of the URI

## Testing the Connection

To test if your frontend can connect to your backend:

1. Open your deployed frontend
2. Open browser developer tools (F12)
3. Check the console for any API-related errors
4. Try accessing a page that requires backend data

If you see "Network error" messages, review the configuration steps above. 