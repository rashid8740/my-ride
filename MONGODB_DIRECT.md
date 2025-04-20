# Direct MongoDB Connection

## Overview

We've updated the application to support direct MongoDB connectivity when the backend is not available. This approach:

1. Tries to connect to the backend server first
2. If that fails, falls back to direct MongoDB connection
3. Ensures data access even if the backend is down

## How It Works

The system now has two methods of data access:

1. **Primary Method**: Access data via the backend API
2. **Fallback Method**: Direct connection to MongoDB

## Configuration

The MongoDB connection string is stored in:
```
MONGODB_URI=mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/
```

## Important Files

1. **apiConfig.js**: Contains getMongoDBUri() that returns the connection string
2. **API Handlers**: Updated to use direct MongoDB when backend is unavailable

## Deployment Considerations

When deploying to Vercel:

1. No need to run a separate backend
2. The frontend will connect directly to MongoDB when needed
3. Make sure MongoDB Atlas allows connections from 0.0.0.0/0 (any IP)

## Security Notes

Direct MongoDB connection from frontend code has security implications:

1. The connection string is exposed in your code
2. There's no middleware layer for validation/authorization
3. Best for internal tools or prototypes, not production systems with sensitive data

## Hybrid Approach

For best results:

1. Use backend API when available for proper data validation and business logic
2. Fall back to direct MongoDB only in emergencies
3. Consider adding authentication/authorization logic to direct MongoDB access

## Vercel Environment Variables

For added security, add your MongoDB URI as an environment variable in Vercel:

1. Go to Project Settings
2. Add Environment Variable
3. Name: MONGODB_URI
4. Value: mongodb+srv://rashdi8740:Up6MrE69mLM7gwsB@cluster0.chaq15e.mongodb.net/ 