# Backend Deployment Guide

## Overview

This guide will help you deploy your My Ride backend API to Render.com, a free cloud hosting service that works well for Node.js applications.

## Prerequisites

1. Create a free account on [Render.com](https://render.com)
2. Have your MongoDB Atlas connection string ready
3. Make sure your backend code is pushed to GitHub

## Step 1: Create a New Web Service on Render

1. Log in to your Render dashboard
2. Click "New +" button and select "Web Service"
3. Connect your GitHub repository (you may need to authorize Render to access your GitHub account)
4. Find and select your my-ride repository

## Step 2: Configure Your Web Service

Use the following settings:

- **Name**: my-ride-backend
- **Runtime**: Node
- **Build Command**: `cd Backend && npm install`
- **Start Command**: `cd Backend && npm start`
- **Plan**: Free

## Step 3: Add Environment Variables

In the "Environment" section, add the following key-value pairs:

- `MONGODB_URI`: `mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/`
- `JWT_SECRET`: `your-secret-key` (create a strong random string)
- `PORT`: `10000` (Render will override this with its own port)
- Add any other environment variables your backend needs

## Step 4: Deploy

Click "Create Web Service" and wait for the deployment to complete. This may take a few minutes.

## Step 5: Configure CORS for Your Frontend

For your backend to accept requests from your frontend, you need to configure CORS. 

Make sure your backend's CORS configuration includes your Vercel frontend domain:

```javascript
// In Backend/src/app.js or Backend/src/index.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app-name.vercel.app', // Add your Vercel domain here
  ],
  credentials: true,
}));
```

## Step 6: Update Your Frontend Configuration

Once your backend is deployed, Render will give you a URL like:
`https://my-ride-backend.onrender.com`

Set this URL as the `NEXT_PUBLIC_API_URL` environment variable in your Vercel project settings.

## Testing the Deployment

1. Visit `https://my-ride-backend.onrender.com/api/health` to verify the backend is running
2. Visit your frontend Vercel URL and navigate to the `/diagnostics` page to check connectivity

## Common Issues and Solutions

### Slow First Request

Render's free tier puts services to sleep after inactivity. The first request may take 30-60 seconds to wake up the service.

### MongoDB Connection Issues

If you see MongoDB connection errors:
1. Verify your MongoDB Atlas IP whitelist includes `0.0.0.0/0` to allow connections from anywhere
2. Check that your connection string has the correct username, password, and database name

### CORS Errors

If your frontend can't connect to the backend due to CORS errors:
1. Check network requests in your browser developer tools
2. Ensure your backend CORS configuration includes your Vercel domain
3. Make sure the protocol (http/https) matches exactly

## Monitoring and Logs

Render provides logs and monitoring features:
1. Go to your Web Service dashboard
2. Click on "Logs" to see application output
3. Set up alerts for errors or downtime 