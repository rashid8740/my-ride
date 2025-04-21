const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// Create Express app
const app = express();

// Configure CORS with specific origins
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://my-ride-frontend.vercel.app',
    'https://my-ride.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/favorites', favoriteRoutes);

// Global database connection status
let isMongoConnected = false;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is running',
    database: isMongoConnected ? 'connected' : 'disconnected'
  });
});

// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to My Ride API',
    database: isMongoConnected ? 'connected' : 'disconnected'
  });
});

// Connect to MongoDB with improved options
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-ride';

// Added connection options for better stability
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Keep initial connection attempt fast
  socketTimeoutMS: 45000, // Longer socket timeout
  family: 4, // Use IPv4, skip IPv6
  maxPoolSize: 10, // Maximum connection pool size
  connectTimeoutMS: 10000, // Connection timeout
  retryWrites: true, // Retry write operations
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB');
    isMongoConnected = true;
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    isMongoConnected = false;
    // Don't exit the process to keep the API running
    // process.exit(1);
  });

// Listen for MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
  isMongoConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
  isMongoConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
  isMongoConnected = false;
});

// Handle application termination and close DB connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 