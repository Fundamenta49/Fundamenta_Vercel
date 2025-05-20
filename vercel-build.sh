#!/bin/bash

# Fundamenta Vercel Build Script - Clean Version

echo "Starting Fundamenta build process..."

# Print versions
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build frontend (inside /client)
echo "Building Vite frontend..."
cd client
npm install
npm run build
cd ..

# Copy frontend build output to server directory
echo "Copying frontend build to dist/public..."
mkdir -p dist/public
cp -r client/dist/* dist/public/

# Build backend (your real Express server)
echo "Bundling Express backend..."
npx esbuild server/index.ts \
  --bundle \
  --platform=node \
  --target=node18 \
  --outfile=dist/index.js \
  --format=cjs

echo "Build complete!"
