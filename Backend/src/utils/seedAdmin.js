const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Seed an admin user if none exists
 */
const seedAdminUser = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Admin user already exists, skipping seed');
      return;
    }
    
    // Create new admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@myride.com',
      password: 'Admin@123',  // This should be changed after first login
      role: 'admin',
      isVerified: true
    });
    
    console.log('Admin user created successfully:', adminUser.email);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

module.exports = seedAdminUser; 