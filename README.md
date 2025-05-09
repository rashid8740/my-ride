# MyRide Car Dealership Application

A full-stack car dealership application with a React frontend and Node.js backend.

## Project Structure

This project contains two main directories:

- `Frontend`: A Next.js application for the user interface
- `Backend`: An Express.js API server for the backend functionality

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4 or higher)

## Getting Started

### First-Time Setup

1. Clone the repository:
   ```
   git clone <repo-url>
   cd my-ride
   ```

2. Install all dependencies (root, frontend, and backend):
   ```
   npm run install:all
   ```

3. Create the environment files:

   For Backend (Backend/.env):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/my-ride
   JWT_SECRET=myridedealer123secret456key789very000secure
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   For Frontend (Frontend/.env.local):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

### Running the Application

1. Start both frontend and backend with one command:
   ```
   npm run dev
   ```

   This will start:
   - Frontend on http://localhost:3000
   - Backend on http://localhost:5000/api

2. Admin login credentials:
   - Email: `admin@myride.com`
   - Password: `Admin@123`

### Starting Individual Services

- To start only the frontend:
  ```
  npm run start:frontend
  ```

- To start only the backend:
  ```
  npm run start:backend
  ```

## Features

- User registration and authentication
- Car listings with search and filter functionality
- Car details with inquiries
- Admin dashboard to manage users, inventory, and inquiries
- Analytics dashboard with data visualization
- Responsive UI for desktop and mobile devices

## Troubleshooting

If you encounter any issues:

1. Ensure MongoDB is running locally
2. Check if the `.env` files are set up correctly
3. Verify that all dependencies are installed
4. Make sure ports 3000 and 5000 are available

## License

This project is licensed under the ISC License.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/verify/:token` - Verify email

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/featured` - Get featured cars
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create car (protected)
- `PUT /api/cars/:id` - Update car (protected)
- `DELETE /api/cars/:id` - Delete car (protected)
- `POST /api/cars/:id/images` - Upload car images (protected)
- `PATCH /api/cars/:id/images/:imageId/main` - Set main image (protected)
- `DELETE /api/cars/:id/images/:imageId` - Delete image (protected)

### Contact
- `POST /api/contact` - Submit inquiry
- `GET /api/contact` - Get all inquiries (protected)
- `GET /api/contact/:id` - Get single inquiry (protected)
- `PATCH /api/contact/:id/status` - Update inquiry status (protected)
- `PATCH /api/contact/:id/assign` - Assign inquiry to user (protected)
- `POST /api/contact/:id/response` - Add response to inquiry (protected)

### Users
- `PUT /api/users/profile` - Update profile (protected)
- `POST /api/users/avatar` - Upload avatar (protected)
- `GET /api/users/favorites` - Get favorites (protected)
- `POST /api/users/favorites/:carId` - Add to favorites (protected)
- `DELETE /api/users/favorites/:carId` - Remove from favorites (protected)

## Roadmap
- Add payment processing for deposits
- Implement online booking system for test drives
- Add real-time chat for customer support
- Expand admin dashboard with analytics and reporting
- Add multi-language support

## Acknowledgements
- [Next.js](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Deployment Guide

### Frontend Deployment on Vercel

1. Make sure your repository is on GitHub
2. Connect your repository to Vercel
3. Add the following environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., https://my-ride-backend.vercel.app)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `NEXT_PUBLIC_CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Backend Deployment on Vercel

1. Make sure your repository is on GitHub
2. Create a new project on Vercel for the backend
3. Set the root directory to `Backend`
4. Add the following environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret for JWT token generation
   - `PORT`: 5000 (if needed)

### Troubleshooting

If you encounter a "Network error" when accessing the deployed frontend:

1. Check that your backend is deployed and running
2. Verify that environment variables are set correctly on Vercel
3. Check that CORS is configured to allow your frontend domain
4. Test the backend health endpoint directly (e.g., https://my-ride-backend.vercel.app/api/health)

## Local Development

### Prerequisites

- Node.js
- MongoDB

### Setup Instructions

1. Clone the repository
2. Install dependencies

```bash
npm run install:all
```

3. Create a `.env` file in the Backend directory:

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Create a `.env.local` file in the Frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

5. Run the application

```bash
npm run dev
```

This will start both the frontend and backend servers.

## Features

- Browse available cars
- Filter by type, make, model, etc.
- Contact the dealership
- Admin dashboard for inventory management

## Additional Notes

- This README provides a comprehensive overview of the project, its structure, and its features.
- Deployment instructions are included for both frontend and backend.
- Local development setup is detailed for both frontend and backend.
- The README ends with a summary of the project's features.

 
 