#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Preparing to deploy My Ride Backend to Vercel...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing it globally...${NC}"
    npm install -g vercel
fi

# Step 1: Verify the project structure
echo -e "${GREEN}Verifying project structure...${NC}"
if [ ! -f "src/index.js" ]; then
    echo -e "${RED}Error: src/index.js not found.${NC}"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo -e "${RED}Error: vercel.json not found.${NC}"
    exit 1
fi

echo -e "${GREEN}Project structure looks good!${NC}"

# Step 2: Check for environment variables
echo -e "${GREEN}Checking environment variables...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Warning: .env file not found. Using environment variables from vercel.json only.${NC}"
fi

# Step 3: Deploy to Vercel
echo -e "${GREEN}Deploying to Vercel...${NC}"
echo -e "${YELLOW}You'll be asked to log in if you're not already logged in.${NC}"
echo -e "${YELLOW}When asked if you want to link to existing project, choose 'Yes' if you have already created a project on Vercel.${NC}"

# Deploy with production environment
vercel --prod

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${GREEN}Your backend should now be accessible at: https://your-project-name.vercel.app${NC}"
echo -e "${YELLOW}Remember to update your frontend's NEXT_PUBLIC_API_URL environment variable to point to this URL${NC}" 