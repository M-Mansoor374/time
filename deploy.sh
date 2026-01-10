#!/bin/bash

# Ahrf Deployment Script
# This script automates the deployment process on VPS

echo "🚀 Starting Ahrf Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 is not installed. Installing PM2...${NC}"
    npm install -g pm2
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Please edit .env file with your actual configuration values!${NC}"
        echo -e "${YELLOW}⚠️  Run: nano .env${NC}"
    else
        echo -e "${RED}❌ .env.example not found. Please create .env file manually.${NC}"
        exit 1
    fi
fi

# Install dependencies
echo -e "${GREEN}📦 Installing dependencies...${NC}"
npm install

# Create logs directory
mkdir -p logs

# Stop existing PM2 process if running
if pm2 list | grep -q "ahrf-backend"; then
    echo -e "${YELLOW}🔄 Stopping existing application...${NC}"
    pm2 stop ahrf-backend
    pm2 delete ahrf-backend
fi

# Start application with PM2
echo -e "${GREEN}🚀 Starting application with PM2...${NC}"
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${GREEN}📊 Application status:${NC}"
pm2 status

echo -e "${GREEN}📝 View logs with: pm2 logs ahrf-backend${NC}"
echo -e "${GREEN}🔄 Restart with: pm2 restart ahrf-backend${NC}"

