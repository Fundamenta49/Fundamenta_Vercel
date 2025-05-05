#!/bin/bash
# deploy-prepare.sh - Script to prepare the application for deployment

echo "=== Fundamenta Deployment Preparation Script ==="
echo "Starting deployment preparation at $(date)"

# Step 1: Build TypeScript files
echo "Building TypeScript files..."
./node_modules/.bin/tsc

# Step 2: Build frontend with Vite
echo "Building frontend with Vite..."
npm run build

# Step 3: Copy static files
echo "Copying static files..."
mkdir -p dist/public
if [ -d "public" ]; then
  cp -r public/* dist/public/ 2>/dev/null || true
fi

# Step 4: Verify the build output
if [ -d "./dist" ] && [ -f "./dist/server/index.js" ]; then
  echo "✅ Build successful!"
else
  echo "❌ Build verification failed. The dist/server/index.js file is missing."
  echo "Please check the build output for errors."
  exit 1
fi

echo "Deployment preparation completed at $(date)"
echo "You can now deploy the application with: NODE_ENV=production node dist/server/index.js"