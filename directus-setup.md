# Quick Directus Setup Guide

## Issue: Node.js Version Compatibility
- Your Node.js version: 24.4.0
- Directus requires: Node.js 22.x
- Solution: Use Docker or downgrade Node.js temporarily

## Option 1: Docker Setup (Recommended - Fastest)

### 1. Create docker-compose.yml
Create this file in your CarBot directory:

```yaml
version: '3.8'
services:
  directus:
    image: directus/directus:latest
    ports:
      - "8055:8055"
    volumes:
      - ./directus/database:/directus/database
      - ./directus/uploads:/directus/uploads
      - ./directus/extensions:/directus/extensions
    environment:
      KEY: '255d861b-5ea1-5996-9aa3-922530ec40b1'
      SECRET: '6116487b-cda1-52c2-b5b5-c8022c45e263'
      DB_CLIENT: 'sqlite3'
      DB_FILENAME: '/directus/database/data.db'
      ADMIN_EMAIL: 'admin@carbot.de'
      ADMIN_PASSWORD: 'CarBot2024!'
      PUBLIC_URL: 'http://localhost:8055'
```

### 2. Start Directus
```bash
docker-compose up -d
```

### 3. Access Admin
- URL: http://localhost:8055
- Email: admin@carbot.de  
- Password: CarBot2024!

## Option 2: Node Version Manager (Alternative)

### 1. Install NVM (if not installed)
```bash
# Download and install NVM for Windows
# Then use Node 22
nvm install 22
nvm use 22
```

### 2. Install Directus
```bash
npm create directus-project@latest directus-cms
cd directus-cms
npm start
```

## Option 3: Use Directus Cloud (Free Tier)
1. Go to https://directus.cloud/
2. Sign up for free account
3. Create new project
4. Use cloud URL in your environment variables

## Next Steps Once Running
1. Import the schema.json I created
2. Add your workshop content
3. Test the API integration
4. Configure the content models

## Quick Test Commands
```bash
# Test if Directus is running
curl http://localhost:8055/

# Test API
curl http://localhost:8055/items/services
```

Choose Option 1 (Docker) for the fastest setup!