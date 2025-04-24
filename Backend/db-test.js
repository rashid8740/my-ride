const mongoose = require('mongoose');

// Get connection string from environment or use the one from vercel.json
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/my-ride';

console.log('Attempting to connect to MongoDB...');
console.log('Connection string (partially hidden):', MONGODB_URI.split('@')[0].replace(/:.+@/, ':****@') + '@' + MONGODB_URI.split('@')[1]);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('MongoDB connection successful!');
  console.log('Connected to database:', mongoose.connection.db.databaseName);
  console.log('Host:', mongoose.connection.host);
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  if (err.name === 'MongoNetworkError') {
    console.error('Network error detected. This might be due to IP restrictions in MongoDB Atlas.');
    console.error('Make sure to add 0.0.0.0/0 to your MongoDB Atlas Network Access whitelist.');
  }
  process.exit(1);
}); 