// This file is used as an entry point for Vercel API routes
// It exports the Express app as a serverless function

// Import the app from the main application file
const app = require('../src/index');

// Vercel serverless function handler
module.exports = app; 