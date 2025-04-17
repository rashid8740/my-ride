const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const contactController = require('../controllers/contactController');

// Public inquiry submission route
router.post('/', contactController.submitInquiry);

// Admin routes
router.get('/', isAuthenticated, isAdmin, contactController.getAllInquiries);
router.get('/:id', isAuthenticated, isAdmin, contactController.getInquiryById);
router.patch('/:id/status', isAuthenticated, isAdmin, contactController.updateInquiryStatus);
router.post('/:id/response', isAuthenticated, isAdmin, contactController.addResponse);
router.patch('/:id/assign', isAuthenticated, isAdmin, contactController.assignInquiry);
router.delete('/:id', isAuthenticated, isAdmin, contactController.deleteInquiry);

module.exports = router;