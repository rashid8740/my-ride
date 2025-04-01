#!/bin/bash

echo "Stopping any running Node.js processes..."
pkill -f node || true

echo "Starting backend server..."
cd Backend
npm run dev &
BACKEND_PID=$!

echo "Waiting for backend to initialize (5 seconds)..."
sleep 5

echo "Starting frontend server..."
cd ../Frontend
npm run dev &
FRONTEND_PID=$!

echo "Both servers are now running!"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:5000"
echo ""
echo "Admin credentials for login:"
echo "- Email: admin@myride.com"
echo "- Password: Admin@123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Keep script running and catch interrupt signal
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 