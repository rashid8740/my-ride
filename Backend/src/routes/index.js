const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const carRoutes = require('./carRoutes');
const contactRoutes = require('./contactRoutes');
const uploadRoutes = require('./uploadRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Routes configuration
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cars', carRoutes);
router.use('/contact', contactRoutes);
router.use('/uploads', uploadRoutes);
router.use('/dashboard', dashboardRoutes);

// Simple health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

module.exports = router; 