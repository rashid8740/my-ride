const Contact = require('../models/Contact');
const User = require('../models/User');

// @desc    Submit contact inquiry
// @route   POST /api/contact
// @access  Public
exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message, car, dealership } = req.body;
    
    // Create new contact inquiry
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      car,
      dealership,
      status: 'new'
    });
    
    // In a production app, would send notification email to admin/dealer
    
    res.status(201).json({
      status: 'success',
      message: 'Your inquiry has been submitted successfully. We will contact you soon.',
      data: {
        id: contact._id
      }
    });
  } catch (error) {
    console.error('Submit inquiry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while submitting inquiry'
    });
  }
};

// @desc    Get all inquiries (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find()
      .populate('car', 'make model year price images');
    
    res.status(200).json({
      status: 'success',
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error('Get all inquiries error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching inquiries',
    });
  }
};

// @desc    Get inquiry by ID (Admin only)
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Contact.findById(req.params.id)
      .populate('car', 'make model year price images');
    
    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: inquiry,
    });
  } catch (error) {
    console.error('Get inquiry by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching inquiry',
    });
  }
};

// @desc    Update inquiry status (Admin only)
// @route   PATCH /api/contact/:id/status
// @access  Private/Admin
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Status is required',
      });
    }
    
    // Validate status
    const validStatuses = ['new', 'inProgress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Must be one of: new, inProgress, resolved',
      });
    }
    
    const inquiry = await Contact.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found',
      });
    }
    
    inquiry.status = status;
    await inquiry.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Inquiry status updated successfully',
      data: {
        id: inquiry._id,
        status: inquiry.status,
      },
    });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating inquiry status',
    });
  }
};

// @desc    Add response to inquiry (Admin only)
// @route   POST /api/contact/:id/response
// @access  Private/Admin
exports.addResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        status: 'error',
        message: 'Response message is required',
      });
    }
    
    const inquiry = await Contact.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found',
      });
    }
    
    // Add response
    const response = {
      user: req.user._id,
      message,
      createdAt: Date.now(),
    };
    
    inquiry.responses.push(response);
    
    // Update status to inProgress if it's new
    if (inquiry.status === 'new') {
      inquiry.status = 'inProgress';
    }
    
    await inquiry.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Response added successfully',
      data: {
        id: inquiry._id,
        response,
      },
    });
  } catch (error) {
    console.error('Add inquiry response error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding response',
    });
  }
};

// @desc    Assign inquiry to user (Admin only)
// @route   PATCH /api/contact/:id/assign
// @access  Private/Admin
exports.assignInquiry = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required',
      });
    }
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    
    const inquiry = await Contact.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found',
      });
    }
    
    inquiry.assignedTo = userId;
    
    // Update status to inProgress if it's new
    if (inquiry.status === 'new') {
      inquiry.status = 'inProgress';
    }
    
    await inquiry.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Inquiry assigned successfully',
      data: {
        id: inquiry._id,
        assignedTo: userId,
      },
    });
  } catch (error) {
    console.error('Assign inquiry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while assigning inquiry',
    });
  }
};