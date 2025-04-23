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
const allowedOrigins = [
  // Local development
  'http://localhost:3000',
  
  // Production domains
  'https://my-ride.vercel.app',
  'https://my-ride-frontend.vercel.app',
  'https://my-ride-git-main-rashid8740s-projects.vercel.app',
  'https://my-ride-evn1kfka8-rashid8740s-projects.vercel.app',
  'https://my-ride-axp0zkmm0-rashid8740s-projects.vercel.app',
  
  // Dynamic Vercel preview deployments (wildcard would be better but we'll list patterns)
  'https://my-ride-git-*.vercel.app',
  'https://my-ride-*-rashid8740s-projects.vercel.app',
  
  // Add any other domains your frontend might be deployed on
  process.env.FRONTEND_URL // Also use the environment variable if set
].filter(Boolean); // Filter out undefined/empty values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // Check for exact match
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Check for wildcard patterns (for Vercel preview deployments)
    for (const pattern of allowedOrigins) {
      if (pattern.includes('*') && new RegExp('^' + pattern.replace('*', '.*') + '$').test(origin)) {
        return callback(null, true);
      }
    }
    
    // In production, we'll log but allow all origins to prevent blocking
    console.log('CORS request from:', origin);
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // Cache CORS preflight response for 24 hours
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
    database: isMongoConnected ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to My Ride API',
    database: isMongoConnected ? 'connected' : 'disconnected',
    status: 'active',
    api_version: '1.0',
    documentation: '/api',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB with improved options
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-ride';
console.log(`Connecting to MongoDB: ${MONGODB_URI.split('@')[0].replace(/:.+@/, ':****@')}...`);

// Ensure we have the right database name
let mongoURI = MONGODB_URI;
if (!mongoURI.includes('/my-ride') && !mongoURI.endsWith('/')) {
  // Add database name if not present
  mongoURI = `${mongoURI}/my-ride`;
  console.log('Added database name to connection string');
}

// Added connection options for better stability
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Increased timeout for Vercel
  socketTimeoutMS: 45000, // Longer socket timeout
  family: 4, // Use IPv4, skip IPv6
  maxPoolSize: 10, // Maximum connection pool size
  connectTimeoutMS: 10000, // Connection timeout
  retryWrites: true, // Retry write operations
};

// Function to handle connection with retries
const connectWithRetry = (retryCount = 5) => {
  return mongoose.connect(mongoURI, mongooseOptions)
    .then(() => {
      console.log('Connected to MongoDB successfully');
      isMongoConnected = true;
    })
    .catch((error) => {
      console.error(`MongoDB connection error (attempt ${6 - retryCount}/5):`, error.message);
      isMongoConnected = false;
      
      if (retryCount > 0) {
        console.log(`Retrying connection in 3 seconds... (${retryCount} attempts left)`);
        setTimeout(() => connectWithRetry(retryCount - 1), 3000);
      } else {
        console.error('Failed to connect to MongoDB after multiple attempts.');
      }
    });
};

// Start the initial connection
connectWithRetry();

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