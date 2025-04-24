require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables

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
  'https://my-ride-seven.vercel.app',
  
  // Dynamic Vercel preview deployments
  'https://my-ride-git-*.vercel.app',
  'https://my-ride-*-rashid8740s-projects.vercel.app',
  
  // Add any other domains your frontend might be deployed on
  process.env.FRONTEND_URL
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
      if (pattern && pattern.includes('*') && new RegExp('^' + pattern.replace('*', '.*') + '$').test(origin)) {
        return callback(null, true);
      }
    }
    
    // In production, allow all origins for compatibility
    console.log('CORS request from:', origin);
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 
                   'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 
                   'x-client-secret'],
  credentials: true,
  maxAge: 86400 // Cache CORS preflight response for 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.enable("trust proxy");
app.set('trust proxy', 1);

// Add security headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

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

// Use the connection string as is - do not modify it
const mongoURI = MONGODB_URI;

// Improved connection options for Vercel serverless environment
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increased for Vercel serverless functions
  socketTimeoutMS: 45000, 
  family: 4, // Use IPv4, skip IPv6
  maxPoolSize: 10, 
  connectTimeoutMS: 30000, // Increased for Vercel serverless functions
  retryWrites: true,
  bufferCommands: false // Disable mongoose buffering for serverless
};

// Better connection approach for serverless - only connect when no existing connection
let isConnecting = false;
async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    isMongoConnected = true;
    return;
  }
  
  if (isConnecting) {
    console.log('Connection already in progress, waiting...');
    return;
  }
  
  isConnecting = true;
  try {
    console.log('Creating new MongoDB connection...');
    await mongoose.connect(mongoURI, mongooseOptions);
    console.log('Connected to MongoDB successfully');
    isMongoConnected = true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    isMongoConnected = false;
  } finally {
    isConnecting = false;
  }
}

// Connect at startup if not in a serverless environment
if (require.main === module) {
  connectToDatabase();
}

// Middleware to ensure database connection for each request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    next();
  }
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

// Start server only if this file is run directly, not if it's imported
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for Vercel serverless functions
module.exports = app; 