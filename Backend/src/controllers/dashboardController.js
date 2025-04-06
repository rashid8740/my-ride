const User = require('../models/User');
const Car = require('../models/Car');
const Contact = require('../models/Contact');

// @desc    Get dashboard statistics (Admin only)
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalInquiries = await Contact.countDocuments();
    
    // Get recent inquiries
    const recentInquiries = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('car', 'make model year images');
    
    console.log('Recent inquiries for dashboard:', recentInquiries.map(inq => ({
      id: inq._id,
      name: inq.name,
      subject: inq.subject,
      hasCarRef: !!inq.car,
      vehicleInfo: inq.vehicleInfo,
      status: inq.status
    })));
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt');
    
    // Get low stock cars (stock < 3)
    const lowStockCars = await Car.find({ stock: { $lt: 3 } })
      .sort({ stock: 1 })
      .limit(5);
    
    // Get stats by status
    const newInquiries = await Contact.countDocuments({ status: 'new' });
    const inProgressInquiries = await Contact.countDocuments({ status: 'inProgress' });
    const resolvedInquiries = await Contact.countDocuments({ status: 'resolved' });
    
    // Get sales data (mock for now, would come from orders in a real app)
    const salesData = {
      total: 128590,
      increase: 12, // percent increase from last month
      recentSales: [
        { month: 'Jan', amount: 65000 },
        { month: 'Feb', amount: 72000 },
        { month: 'Mar', amount: 84000 },
        { month: 'Apr', amount: 110000 },
        { month: 'May', amount: 128590 }
      ]
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalCars,
        totalInquiries,
        recentInquiries,
        recentUsers,
        lowStockCars,
        inquiriesByStatus: {
          new: newInquiries,
          inProgress: inProgressInquiries,
          resolved: resolvedInquiries
        },
        salesData
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard statistics'
    });
  }
}; 