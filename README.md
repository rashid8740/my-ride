# MyRide - Car Dealership Website

A modern car dealership website built with Next.js and Express, featuring user authentication, inventory management, and admin dashboard.

## Features

- 🚗 Complete car inventory management
- 👤 User accounts and authentication
- ❤️ Favorite cars functionality
- 📱 Responsive design for all devices
- 🌙 Light and dark mode support
- 📊 Admin dashboard with analytics
- 🔐 Role-based access control

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/my-ride.git
   cd my-ride
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm run install:all
   ```

3. Create `.env` files:

   For Backend:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/my-ride
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   
   # Cloudinary (optional for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   For Frontend:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Admin Access

An admin user is automatically created when you first run the backend server:

- **Email**: admin@myride.com
- **Password**: Admin@123

You can log in with these credentials at http://localhost:3000/login to access the admin dashboard.

### Admin Features

- **Dashboard**: View key metrics and statistics
- **User Management**: Create, edit, and manage user accounts
- **Inventory Management**: Add, edit, and delete car listings
- **Inquiries Management**: View and respond to customer inquiries

## Project Structure

```
/
├── Backend/            # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middlewares/   # Express middlewares
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── index.js       # Entry point
│   ├── .env.example       # Example environment variables
│   └── package.json       # Backend dependencies
│
└── Frontend/           # Next.js frontend
    ├── src/
    │   ├── app/           # Next.js app router
    │   ├── components/    # React components
    │   ├── utils/         # Utility functions
    │   └── ...
    ├── public/            # Static assets
    ├── .env.example       # Example environment variables
    └── package.json       # Frontend dependencies
```

## Technologies Used

### Backend
- Express.js - Web framework
- MongoDB/Mongoose - Database
- JWT - Authentication
- Cloudinary - Image storage

### Frontend
- Next.js - React framework
- Tailwind CSS - Styling
- Lucide React - Icons
- Next.js App Router - Routing

## License

This project is licensed under the MIT License.

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
 
 