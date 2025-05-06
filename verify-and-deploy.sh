#!/bin/bash
set -e

# Verify and Deploy Script for Fundamenta
# This script performs pre-deployment checks and prepares the application

echo "=== Fundamenta Deployment Verification ==="
echo "Running pre-deployment checks..."

# Check if Node.js is installed
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    exit 1
fi
node_version=$(node -v)
echo "Node.js version: $node_version"

# Check if npm is installed
echo "Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed or not in PATH"
    exit 1
fi
npm_version=$(npm -v)
echo "npm version: $npm_version"

# Check for required files
echo "Checking for required files..."
required_files=("package.json" "tsconfig.json" "vite.config.ts" "server/index.ts" "cloudrun-health-web.cjs")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Error: Required file $file not found"
        exit 1
    fi
    echo "✓ $file exists"
done

# Check build script in package.json
echo "Checking build script in package.json..."
if ! grep -q "\"build\":" package.json; then
    echo "Error: No build script found in package.json"
    exit 1
fi
echo "✓ Build script found in package.json"

# Run the build
echo "Running a test build..."
npm run build

# Check if deploy-prepare.sh exists and is executable
echo "Checking deploy-prepare.sh..."
if [ ! -f "deploy-prepare.sh" ]; then
    echo "Error: deploy-prepare.sh not found"
    exit 1
fi
if [ ! -x "deploy-prepare.sh" ]; then
    echo "Making deploy-prepare.sh executable..."
    chmod +x deploy-prepare.sh
fi
echo "✓ deploy-prepare.sh exists and is executable"

# Verify .replit file
echo "Verifying .replit deployment configuration..."
if ! grep -q "deploymentTarget = \"cloudrun\"" .replit; then
    echo "Warning: CloudRun deployment target not found in .replit"
else
    echo "✓ CloudRun deployment target found in .replit"
fi

# Verify dist directory structure after build
echo "Verifying dist directory structure..."
if [ ! -d "dist" ]; then
    echo "Error: dist directory not found after build"
    exit 1
fi
echo "✓ dist directory exists"

if [ ! -d "dist/client" ]; then
    echo "Warning: dist/client directory not found"
else
    echo "✓ dist/client directory exists"
fi

# Check for index.html
if [ ! -f "dist/index.html" ] && [ ! -f "dist/client/index.html" ]; then
    echo "Error: No index.html found in dist or dist/client"
    exit 1
fi
echo "✓ index.html found"

# Check for assets
if [ ! -d "dist/assets" ] && [ ! -d "dist/client/assets" ]; then
    echo "Warning: No assets directory found in dist or dist/client"
else
    echo "✓ Assets directory found"
fi

echo
echo "=== Verification Complete ==="
echo "All checks passed. Your application is ready for deployment."
echo "To deploy your application to CloudRun, click the 'Deploy' button in the Replit interface."
echo