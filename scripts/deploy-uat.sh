#!/bin/bash

# CarBot UAT Deployment Script
# This script deploys CarBot to the UAT environment

echo "🧪 Starting CarBot UAT Deployment..."

# Set environment variables
export NODE_ENV=uat
export UAT_MODE=true
export DEMO_DATA_ENABLED=true

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Step 1: Checking prerequisites...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not installed. Installing...${NC}"
    npm install -g vercel
else
    echo -e "${GREEN}✅ Vercel CLI is installed${NC}"
fi

# Check if git is clean
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  Working directory is not clean. Committing changes...${NC}"
    git add .
    git commit -m "UAT deployment preparation"
fi

echo -e "${BLUE}📋 Step 2: Creating UAT branch...${NC}"

# Create or switch to UAT branch
git checkout -b uat-environment 2>/dev/null || git checkout uat-environment
git merge main --no-edit

echo -e "${BLUE}📋 Step 3: Building application...${NC}"

# Build the application
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Aborting deployment.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

echo -e "${BLUE}📋 Step 4: Deploying to Vercel UAT...${NC}"

# Deploy to Vercel with UAT configuration
vercel --prod --confirm --env NODE_ENV=uat --env UAT_MODE=true --env DEMO_DATA_ENABLED=true --name carbot-uat

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment successful!${NC}"

echo -e "${BLUE}📋 Step 5: Setting up UAT database...${NC}"

# Note: Manual step - user needs to run the SQL script
echo -e "${YELLOW}⚠️  Manual Step Required:${NC}"
echo "1. Go to your UAT Supabase project"
echo "2. Run the SQL script: scripts/seed-uat-data.sql"
echo "3. Verify demo data is loaded"

echo -e "${BLUE}📋 Step 6: Verifying deployment...${NC}"

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls carbot-uat --scope=your-team 2>/dev/null | grep "https://" | head -1 | awk '{print $2}')

if [ -z "$DEPLOYMENT_URL" ]; then
    DEPLOYMENT_URL="https://carbot-uat.vercel.app"
fi

echo -e "${GREEN}🚀 UAT Environment Ready!${NC}"
echo ""
echo -e "${BLUE}📊 UAT Environment Details:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "🌐 URL:           ${GREEN}${DEPLOYMENT_URL}${NC}"
echo -e "🔑 Environment:   ${YELLOW}UAT Testing${NC}"
echo -e "💾 Database:      ${YELLOW}Separate UAT Supabase${NC}"
echo -e "💳 Payments:      ${YELLOW}Stripe Test Mode${NC}"
echo -e "📧 Emails:        ${YELLOW}Test Email Service${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}🧪 Test Accounts:${NC}"
echo "Premium:    thomas.wagner@uat-demo.de / DemoPass123!"
echo "Standard:   hans.mueller@uat-demo.de / DemoPass123!"
echo "Trial:      maria.schmidt@uat-demo.de / DemoPass123!"
echo ""
echo -e "${BLUE}🔧 Quick Actions:${NC}"
echo "1. Visit: ${DEPLOYMENT_URL}/dashboard/uat"
echo "2. Generate test data using the UAT dashboard"
echo "3. Run test scenarios from UAT-TESTING-GUIDE.md"
echo "4. Test Stripe payments with card: 4242 4242 4242 4242"
echo ""
echo -e "${GREEN}✅ UAT Environment is ready for testing!${NC}"

# Open UAT dashboard in browser (optional)
read -p "🌐 Open UAT dashboard in browser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "${DEPLOYMENT_URL}/dashboard/uat"
    elif command -v open &> /dev/null; then
        open "${DEPLOYMENT_URL}/dashboard/uat"
    else
        echo "Please open: ${DEPLOYMENT_URL}/dashboard/uat"
    fi
fi