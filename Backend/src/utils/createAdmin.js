const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Admin user details - change these as needed
const adminDetails = {
  firstName: 'MyRide',
  lastName: 'Admin',
  email: 'admin123@myride.com',
  password: 'Admin123!',
  phone: '+254722123456',
  role: 'admin',
  isVerified: true
};

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Check if an admin with this email already exists
    const existingAdmin = await User.findOne({ email: adminDetails.email });
    
    if (existingAdmin) {
      console.log(`Admin user with email ${adminDetails.email} already exists`);
      process.exit(0);
    }
    
    // Create the admin user
    const admin = await User.create(adminDetails);
    
    console.log('Admin user created successfully:');
    console.log(`Name: ${admin.firstName} ${admin.lastName}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminDetails.password}`);
    console.log(`Role: ${admin.role}`);
    console.log('Please keep these credentials safe and change the password after first login.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the function
createAdminUser(); 