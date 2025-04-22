# Deploying My Ride Backend to Vercel

This guide will help you deploy your My Ride backend to Vercel, making it accessible from your frontend application.

## Method 1: Deploy Using the Script (Recommended)

1. Make the deployment script executable:
   ```bash
   chmod +x deploy-backend.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy-backend.sh
   ```

3. Follow the prompts from the Vercel CLI.
   - If you're using Vercel for the first time, you'll need to log in.
   - You may need to link your GitHub account.
   - Choose your personal account or team.
   - Confirm the project name (default: my-ride-backend).
   - The script will then deploy your backend.

4. After deployment, note the URL provided (e.g., `https://my-ride-backend.vercel.app`).

5. Update your frontend's environment variable in Vercel dashboard:
   - Set `NEXT_PUBLIC_API_URL` to your new backend URL.

## Method 2: Manual Deployment with Vercel Dashboard

1. Push your backend code to GitHub if you haven't already.

2. Log in to [Vercel Dashboard](https://vercel.com/dashboard).

3. Click "Add New..." and select "Project".

4. Import your GitHub repository.

5. Configure the project:
   - Root Directory: `Backend` (if your backend is in a subdirectory)
   - Framework Preset: `Other`
   - Build Command: `npm install`
   - Output Directory: (leave empty)
   - Install Command: `npm install`

6. Add the following environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret for JWT tokens

7. Click "Deploy".

8. After deployment, note the URL of your deployed backend.

9. Update your frontend's environment variable in Vercel dashboard:
   - Set `NEXT_PUBLIC_API_URL` to your new backend URL.

## Verifying Your Deployment

1. Visit your deployed backend URL (e.g., `https://my-ride-backend.vercel.app`).
   - You should see a welcome message: "Welcome to My Ride API".

2. Check the health endpoint: `https://my-ride-backend.vercel.app/api/health`.
   - You should see a JSON response with `status: "ok"`.

3. Test your frontend against the new backend by:
   - Logging in
   - Browsing inventory
   - Checking other features

## Troubleshooting

If you encounter issues with your deployment:

1. **CORS Errors**: Ensure your backend CORS settings include your frontend URL.
   - The `vercel.json` file should have headers set correctly.
   - Your backend code should also have CORS configured.

2. **Database Connection Issues**:
   - Check your MongoDB connection string.
   - Ensure your MongoDB Atlas IP whitelist allows connections from Vercel.

3. **Environment Variables**:
   - Verify all required environment variables are set in Vercel.
   - MONGODB_URI and JWT_SECRET are particularly important.

4. **Deployment Failures**:
   - Check the Vercel deployment logs for errors.
   - Make sure your package.json has the correct main file and start script.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Deployment Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html) 