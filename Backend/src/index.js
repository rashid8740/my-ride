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
  // Get connection state as string
  const connectionState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = connectionState[mongoose.connection.readyState] || 'unknown';
  
  // Detailed connection info
  const dbInfo = {
    state: dbState,
    // Only include these if actually connected
    host: mongoose.connection.readyState === 1 ? mongoose.connection.host : null,
    database: mongoose.connection.readyState === 1 ? mongoose.connection.db?.databaseName : null,
    isConnected: isMongoConnected,
    readyState: mongoose.connection.readyState
  };
  
  // Force connection attempt if disconnected (but don't wait for completion)
  if (mongoose.connection.readyState !== 1) {
    console.log('Health check - triggering connection attempt');
    connectToDatabase().catch(err => {
      console.error('Health check connection attempt failed:', err.message);
    });
  }
  
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is running',
    database: isMongoConnected ? 'connected' : 'disconnected',
    db_info: dbInfo,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint for diagnosing MongoDB connection issues
app.get('/api/debug/database', async (req, res) => {
  // Current MongoDB connection status
  const connectionState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const currentState = connectionState[mongoose.connection.readyState] || 'unknown';
  
  // Collect system information
  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      // Include other non-sensitive env vars
      VERCEL: process.env.VERCEL || 'not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
      VERCEL_REGION: process.env.VERCEL_REGION || 'not set'
    }
  };
  
  try {
    // Get connection string from environment
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return res.status(500).json({
        success: false,
        error: 'MongoDB connection string not found in environment variables',
        currentConnectionState: currentState,
        systemInfo
      });
    }
    
    // Try to connect if not already connected
    if (mongoose.connection.readyState !== 1) {
      try {
        console.log('[Debug] Attempting to connect to MongoDB...');
        await connectToDatabase();
      } catch (err) {
        console.error('[Debug] Failed to connect:', err.message);
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Database debug information',
      connectionStatus: {
        state: currentState,
        isConnected: mongoose.connection.readyState === 1,
        host: mongoose.connection.host || 'none',
        database: mongoose.connection.db?.databaseName || 'none',
        connectedSince: isMongoConnected ? 'unknown' : 'not connected'
      },
      mongooseVersion: mongoose.version,
      systemInfo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
      systemInfo
    });
  }
});

// Home route
app.get('/', (req, res) => {
  // Get connection state as string
  const connectionState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = connectionState[mongoose.connection.readyState] || 'unknown';
  
  // Force connection attempt if disconnected (but don't wait for completion)
  if (mongoose.connection.readyState !== 1) {
    console.log('Root endpoint - triggering connection attempt');
    connectToDatabase().catch(err => {
      console.error('Root endpoint connection attempt failed:', err.message);
    });
  }
  
  res.json({ 
    message: 'Welcome to My Ride API',
    database: isMongoConnected ? 'connected' : 'disconnected',
    db_state: dbState,
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

// Use the connection string as is
const mongoURI = MONGODB_URI;

// Global connection cache - more reliable pattern for serverless
let isConnecting = false;
let cachedConnection = null;
const CONN_CACHE_KEY = Symbol.for('mongoose.connection');

// Get global cached connection
const getGlobalConnection = () => {
  return global[CONN_CACHE_KEY];
};

// Set global cached connection
const setGlobalConnection = (connection) => {
  global[CONN_CACHE_KEY] = connection;
  return connection;
};

// Create a consistent function for connecting to the database
async function connectToDatabase() {
  // Check the global cache first (persists between function invocations)
  const globalConn = getGlobalConnection();
  if (globalConn?.connection?.readyState === 1) {
    console.log('Using global cached MongoDB connection');
    isMongoConnected = true;
    cachedConnection = globalConn;
    return globalConn;
  }
  
  // Next check the instance cache
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using instance cached MongoDB connection');
    isMongoConnected = true;
    return cachedConnection;
  }
  
  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    console.log('Connection attempt already in progress...');
    // Wait for existing connection attempt
    await new Promise(resolve => setTimeout(resolve, 1000));
    return connectToDatabase();
  }
  
  isConnecting = true;
  
  try {
    console.log('Creating new MongoDB connection...');
    
    // Enhanced options specifically for Vercel serverless
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // Increased for Vercel
      socketTimeoutMS: 55000, // Increased for Vercel
      family: 4, // Force IPv4
      maxPoolSize: 1, // Keep pool minimal for serverless
      connectTimeoutMS: 30000, // Extended timeout
      heartbeatFrequencyMS: 5000,
      retryWrites: true,
      retryReads: true,
      // Auto_reconnect is critical for serverless
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE
    };
    
    // Close any existing connections to prevent leaks
    if (mongoose.connection.readyState !== 0) {
      console.log('Closing existing mongoose connections before reconnecting...');
      await mongoose.connection.close();
    }
    
    // Connect with enhanced options
    const connection = await mongoose.connect(mongoURI, options);
    
    console.log(`Connected to MongoDB: ${connection.connection.db.databaseName} at ${connection.connection.host}`);
    isMongoConnected = true;
    cachedConnection = connection;
    
    // Store in global cache for reuse across function invocations
    setGlobalConnection(connection);
    
    // Setup event handlers
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
      isMongoConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
      isMongoConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('Mongoose reconnected');
      isMongoConnected = true;
    });
    
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    isMongoConnected = false;
    cachedConnection = null;
    throw error;
  } finally {
    isConnecting = false;
  }
}

// Middleware to ensure MongoDB connection before handling requests
app.use(async (req, res, next) => {
  // Skip connection for non-database routes (health checks, static assets)
  const nonDbRoutes = ['/api/health', '/favicon.ico', '/robots.txt'];
  if (nonDbRoutes.includes(req.path)) {
    return next();
  }
  
  try {
    // Check current connection state
    if (mongoose.connection.readyState !== 1) {
      console.log(`[${req.method}] ${req.path} - DB not connected, attempting connection...`);
      await connectToDatabase();
    } 
    else {
      // Monitor connection health
      if (!isMongoConnected) {
        console.log(`Setting isMongoConnected = true (state was mismatched)`);
        isMongoConnected = true;
      }
    }
    next();
  } catch (error) {
    console.error(`DB Connection middleware error: ${error.message}`);
    
    // Don't fail the request, just log the error and continue
    // This allows the API to return partial functionality even with DB issues
    next();
  }
});

// Connect to database at startup if not in serverless
if (require.main === module) {
  connectToDatabase().catch(err => {
    console.error('Initial database connection failed:', err.message);
  });
}

// Expose the connection function for external use
app.connectToDatabase = connectToDatabase;

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
  cachedConnection = null;
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