const Contact = require('../models/Contact');
const User = require('../models/User');

// @desc    Submit contact inquiry
// @route   POST /api/contact
// @access  Public
exports.submitInquiry = async (req, res) => {
  try {
    console.log('🔍 [Backend] submitInquiry started - received request');
    console.log('🔍 [Backend] Request IP:', req.ip);
    console.log('🔍 [Backend] Request headers:', {
      contentType: req.headers['content-type'],
      authorization: req.headers['authorization'] ? 'Bearer [REDACTED]' : 'None',
      userAgent: req.headers['user-agent']
    });
    
    const { name, email, phone, subject, message, vehicle, vehicleId } = req.body;
    
    console.log('🔍 [Backend] Received inquiry submission:', {
      name, 
      email, 
      phone, 
      subject, 
      vehicleId: vehicleId || 'None', 
      vehicle: vehicle || 'None',
      messageLength: message ? message.length : 0
    });
    
    // Create new contact inquiry
    console.log('🔍 [Backend] Attempting to create contact document in database');
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      car: vehicleId, // Set car reference if vehicleId is provided
      vehicleInfo: vehicle, // Store vehicle text info even if no ID
      status: 'new' // Use lowercase status to match the schema
    });
    
    console.log('✅ [Backend] Created new inquiry successfully:', {
      id: contact._id,
      car: contact.car,
      status: contact.status,
      created: contact.createdAt
    });
    
    // In a production app, would send notification email to admin/dealer
    
    res.status(201).json({
      status: 'success',
      message: 'Your inquiry has been submitted successfully. We will contact you soon.',
      data: {
        id: contact._id
      }
    });
    console.log('✅ [Backend] Response sent to client with status 201');
  } catch (error) {
    console.error('❌ [Backend] Submit inquiry error:', error);
    console.error('❌ [Backend] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (error.name === 'ValidationError') {
      console.error('❌ [Backend] Mongoose validation error details:', error.errors);
      return res.status(400).json({
        status: 'error',
        message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      console.error('❌ [Backend] MongoDB error code:', error.code);
      if (error.code === 11000) { // Duplicate key error
        return res.status(400).json({
          status: 'error',
          message: 'A duplicate entry was detected'
        });
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while submitting inquiry'
    });
    console.error('❌ [Backend] Response sent to client with status 500');
  }
};

// @desc    Get all inquiries (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllInquiries = async (req, res) => {
  try {
    console.log('🔍 [Backend] getAllInquiries started - admin request to fetch all inquiries');
    console.log('🔍 [Backend] User making request:', req.user ? req.user._id : 'No user ID available');
    console.log('🔍 [Backend] Query parameters:', req.query);
    
    const inquiries = await Contact.find()
      .populate('car', 'make model year price images');
    
    console.log(`✅ [Backend] Successfully retrieved ${inquiries.length} inquiries`);
    
    if (inquiries.length === 0) {
      console.warn('⚠️ [Backend] No inquiries found in the database');
    } else {
      console.log('🔍 [Backend] Sample inquiry data:', 
        inquiries.slice(0, 1).map(inq => ({
          id: inq._id,
          name: inq.name,
          email: inq.email,
          subject: inq.subject,
          car: inq.car ? 'Car reference exists' : 'No car reference',
          vehicleInfo: inq.vehicleInfo,
          status: inq.status,
          createdAt: inq.createdAt
        }))
      );
    }
    
    res.status(200).json({
      status: 'success',
      count: inquiries.length,
      data: inquiries,
    });
    
    console.log('✅ [Backend] Response sent to client with status 200');
  } catch (error) {
    console.error('❌ [Backend] Get all inquiries error:', error);
    console.error('❌ [Backend] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching inquiries',
    });
    
    console.error('❌ [Backend] Response sent to client with status 500');
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

// @desc    Delete inquiry (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteInquiry = async (req, res) => {
  try {
    console.log('🔍 [Backend] deleteInquiry started - attempting to delete inquiry:', req.params.id);
    
    const inquiry = await Contact.findById(req.params.id);
    
    if (!inquiry) {
      console.warn('⚠️ [Backend] Inquiry not found for deletion:', req.params.id);
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found',
      });
    }
    
    await Contact.findByIdAndDelete(req.params.id);
    
    console.log('✅ [Backend] Successfully deleted inquiry:', req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    console.error('❌ [Backend] Delete inquiry error:', error);
    console.error('❌ [Backend] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting inquiry',
    });
  }
};