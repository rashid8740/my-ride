const mongoose = require('mongoose');

module.exports = async (req, res) => {
  try {
    // Get connection string from environment
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return res.status(500).json({
        error: 'MongoDB connection string not found in environment variables',
        env: Object.keys(process.env).filter(key => !key.includes('SECRET') && !key.includes('KEY'))
      });
    }
    
    // Attempt connection
    const connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    
    return res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      database: mongoose.connection.db.databaseName,
      host: mongoose.connection.host,
      // Return non-sensitive environment variables
      env: {
        NODE_ENV: process.env.NODE_ENV,
        FRONTEND_URL: process.env.FRONTEND_URL
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
}; 