const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Not authorized, no token provided' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from the token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Please verify your email first' 
      });
    }
    
    // Set user on request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      status: 'error',
      message: 'Not authorized, token failed' 
    });
  }
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      status: 'error',
      message: 'Not authorized as an admin' 
    });
  }
};

// Middleware to check if user is dealer
exports.isDealer = (req, res, next) => {
  if (req.user && (req.user.role === 'dealer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ 
      status: 'error',
      message: 'Not authorized as a dealer' 
    });
  }
};

// Middleware to check if user owns a resource
exports.isResourceOwner = (model) => async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const resource = await model.findById(resourceId);
    
    if (!resource) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Resource not found' 
      });
    }
    
    // Check if user is the owner or an admin
    if (
      (resource.seller && resource.seller.toString() === req.user._id.toString()) ||
      (resource.user && resource.user.toString() === req.user._id.toString()) ||
      req.user.role === 'admin'
    ) {
      next();
    } else {
      return res.status(403).json({ 
        status: 'error',
        message: 'Not authorized to access this resource' 
      });
    }
  } catch (error) {
    console.error('Resource owner check error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Server error while checking resource ownership' 
    });
  }
}; 
 
 