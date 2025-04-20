# Vercel Build Fix

## Problem

The current Vercel build fails with the error:
```
sh: line 1: cd: Frontend: No such file or directory
```

This is because the build command is executed from the wrong directory context.

## Solution

We've updated the Vercel configuration in two ways:

1. **Updated vercel.json**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "Frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "Frontend/$1"
    }
  ],
  "buildCommand": "cd Frontend && npm install @emotion/react @emotion/styled && npm run build",
  "outputDirectory": "Frontend/.next"
}
```

2. **Added build script to package.json**:
```json
"scripts": {
  "build": "cd Frontend && npm run build",
  // other scripts...
}
```

## Deployment Instructions

For Vercel deployments, follow these steps:

1. Push these changes to your repository
2. Go to Vercel and deploy again
3. Make sure the following environment variables are set:
   - `NEXT_PUBLIC_API_URL`: The URL of your backend API

## IMPORTANT: Environment Variables

For your backend connectivity error, make sure:

1. Your backend is deployed and running
2. You've set `NEXT_PUBLIC_API_URL` correctly in Vercel
3. Configure CORS on your backend to allow requests from your Vercel frontend domain

## Testing the Deployment

After deployment:
1. Check the build logs for any errors
2. Verify the frontend is working
3. Test backend connectivity by accessing a page that loads data from the backend

If you see "Network error. Please check if the backend server is running and accessible":
- The backend is not running or not accessible from your frontend
- The `NEXT_PUBLIC_API_URL` is not set correctly

## MongoDB Configuration

Your MongoDB connection string (`mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/`) needs to be set as an environment variable on your backend deployment, not the frontend. 