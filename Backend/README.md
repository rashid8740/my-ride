# My Ride Backend

Backend API for the My Ride car dealership application.

## Deployment to Vercel

### Option 1: Automatic Deployment (Recommended)

1. Make the deployment script executable:
   ```bash
   chmod +x deploy-to-vercel.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy-to-vercel.sh
   ```

3. Follow the on-screen instructions to complete the deployment.

### Option 2: Manual Deployment

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the backend:
   ```bash
   vercel --prod
   ```

### Option 3: Deploy from GitHub

1. Push your code to GitHub
2. Create a new project on Vercel Dashboard
3. Connect your GitHub repository
4. Set the following options:
   - Framework: Node.js
   - Root Directory: Backend (if you're deploying from the monorepo root)
   - Build Command: none (leave empty)
   - Output Directory: none (leave empty)
   - Install Command: npm install

## Configuration

The `vercel.json` file contains all necessary configuration for deployment, including:

- Build settings
- Routes configuration
- CORS headers
- Environment variables

## Environment Variables

The following environment variables are required:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## After Deployment

1. After deploying, you'll get a URL for your backend (e.g., `https://my-ride-backend.vercel.app`)
2. Update your frontend's environment variable to use this URL:
   - In Vercel, go to your frontend project settings
   - Add environment variable: `NEXT_PUBLIC_API_URL=https://my-ride-backend.vercel.app`

## Troubleshooting

- **CORS Issues**: If you encounter CORS errors, make sure your frontend domain is listed in the allowed origins.
- **Database Connection**: Ensure your MongoDB connection string is correct and that your IP address is whitelisted in MongoDB Atlas.
- **JWT Authentication**: Make sure the JWT_SECRET is consistent between development and production.

## Local Development

To run the backend locally:

```bash
npm install
npm run dev
```

The server will start on port 5000 by default. 