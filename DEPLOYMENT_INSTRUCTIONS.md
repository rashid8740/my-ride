# Deployment Instructions for My Ride Application

## Backend Deployment

1. Create a separate Vercel project for the backend:
   - Go to Vercel dashboard: https://vercel.com/dashboard
   - Click "Add New" -> "Project"
   - Import your GitHub repository
   - Set the root directory to "Backend"
   - Set framework preset to "Other"

2. Add environment variables:
   - MONGODB_URI: `mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/`
   - PORT: `5000`

3. Deploy the backend
   - After deployment, note the URL (e.g., https://backend-my-ride.vercel.app)

## Frontend Deployment

1. Create a separate Vercel project for the frontend:
   - Go to Vercel dashboard
   - Click "Add New" -> "Project"
   - Import the same GitHub repository
   - Set the root directory to "Frontend"
   - Set framework preset to "Next.js"

2. Add environment variables:
   - NEXT_PUBLIC_API_URL: [Your backend URL from step 3 above]
   - Other environment variables from .env.local

3. Deploy the frontend

## How to Fix Connection Issues

If you're experiencing "Error Loading Inventory" with 404 errors:

1. Check if your backend is deployed correctly:
   - Visit your backend URL directly in browser
   - It should show "Welcome to My Ride API"

2. Update the API URL in Vercel environment variables:
   - Go to your frontend project settings in Vercel
   - Update NEXT_PUBLIC_API_URL to your actual backend URL

3. Redeploy your frontend:
   - Trigger a new deployment

4. If you need to test locally with your production backend:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app npm run dev
   ``` 