#!/bin/bash

# Vercel Build Script for Fundamenta
# This script runs during the Vercel build process and ensures both 
# client and server are properly built and configured

echo "Starting Fundamenta build process for Vercel deployment..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build client
echo "Building client..."
npm run build

# Build server standalone for Vercel
echo "Building server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server

# Create a Vercel-friendly server entry point
echo "Creating server entry point..."
cat > dist/server/index.js <<EOL
import { createServer } from 'http';
import { parse } from 'url';
import nextServer from './server.js';

const server = createServer(async (req, res) => {
  try {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    
    // Handle API routes
    if (pathname.startsWith('/api/')) {
      await nextServer(req, res);
      return;
    }

    // Serve static files
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end('Fundamenta is running!');
  } catch (err) {
    console.error('Error occurred handling request:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
EOL

echo "Creating health check endpoint..."
mkdir -p dist/api
cat > dist/api/health.js <<EOL
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || 'unknown'
  });
}
EOL

echo "Build completed successfully!"