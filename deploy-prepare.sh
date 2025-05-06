#!/bin/bash
set -e

# Deploy preparation script
# This script prepares the application for deployment to CloudRun

echo "Starting deployment preparation..."

# Environment detection
echo "Detecting environment..."
if [ "$NODE_ENV" = "production" ]; then
    echo "Running in production mode"
else
    echo "Setting NODE_ENV to production"
    export NODE_ENV=production
fi

# Install dependencies if needed
echo "Checking for node_modules..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed."
fi

# Clean up previous build
echo "Cleaning up previous build..."
rm -rf dist || true
mkdir -p dist

# Build the application
echo "Building frontend with Vite..."
npm run build

# Check if the build was successful
if [ ! -d "dist/client" ]; then
    echo "Build failed: dist/client directory not found"
    exit 1
fi

# Copy client files to dist root for easier serving
echo "Copying client files to dist root..."
cp -r dist/client/* dist/ || true

# Ensure index.html exists in the dist root
if [ ! -f "dist/index.html" ]; then
    echo "Warning: index.html not found in dist root"
    
    # Try to find it elsewhere
    if [ -f "dist/client/index.html" ]; then
        echo "Copying index.html from dist/client..."
        cp dist/client/index.html dist/
    elif [ -f "client/dist/index.html" ]; then
        echo "Copying index.html from client/dist..."
        cp client/dist/index.html dist/
    else
        echo "Creating a basic index.html as fallback..."
        cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fundamenta Life Skills</title>
    <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/assets/index.js"></script>
</body>
</html>
EOF
    fi
fi

echo "Checking assets directory..."
if [ ! -d "dist/assets" ] && [ -d "dist/client/assets" ]; then
    echo "Copying assets from dist/client..."
    mkdir -p dist/assets
    cp -r dist/client/assets/* dist/assets/ || true
fi

echo "Adding essential files for CloudRun deployment..."
# Create a health check handler at the root
cat > dist/api-health.js << 'EOF'
// Health check handler for CloudRun
export function handleHealthCheck(req, res) {
  if (req.path === '/' && 
      (req.headers['user-agent']?.includes('GoogleHC') || 
       req.query['health-check'] === 'true')) {
    return res.status(200).json({ status: 'ok' });
  }
  return false;
}
EOF

echo "Deployment preparation complete!"