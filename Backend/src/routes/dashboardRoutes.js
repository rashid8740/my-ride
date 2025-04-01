const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// Dashboard statistics route
router.get('/stats', isAuthenticated, isAdmin, dashboardController.getDashboardStats);

module.exports = router; 