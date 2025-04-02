#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting the MyRide application...${NC}"

# Instead of killing all Node processes, we'll use more specific targeting
echo -e "Stopping any running MyRide servers..."

# Find and kill only port 3000 (Frontend) and 5000 (Backend) processes
fuser -k 3000/tcp 2>/dev/null
fuser -k 5000/tcp 2>/dev/null

# Small pause to ensure ports are cleared
sleep 2

# Start the backend server
echo -e "\n${YELLOW}Starting Backend Server...${NC}"
cd Backend
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}Backend server started with PID: $BACKEND_PID${NC}"

# Wait for backend to start
echo "Waiting for Backend to initialize..."
sleep 5

# Start the frontend server
echo -e "\n${YELLOW}Starting Frontend Server...${NC}"
cd ../Frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend server started with PID: $FRONTEND_PID${NC}"

# Display info
echo -e "\n${BLUE}=== Server Information ===${NC}"
echo -e "${GREEN}Backend server:${NC} http://localhost:5000/api"
echo -e "${GREEN}Frontend server:${NC} http://localhost:3000"
echo -e "${YELLOW}Admin Login:${NC} Email: admin@myride.com, Password: Admin@123"
echo -e "\n${BLUE}Press Ctrl+C to stop both servers${NC}"

# Handle graceful shutdown on Ctrl+C
trap "echo -e '\n${YELLOW}Stopping servers...${NC}'; kill $BACKEND_PID $FRONTEND_PID; echo -e '${GREEN}Servers stopped${NC}'; exit" INT

# Keep script running
wait 