#!/bin/bash
# deploy-prepare.sh - Script to prepare the application for deployment

echo "=== Fundamenta Deployment Preparation Script ==="
echo "Starting deployment preparation at $(date)"

# Step 1: Ensure proper TypeScript config for ES Modules
echo "Configuring TypeScript for ES Modules (Node.js compatibility)..."
cat > temp-tsconfig.json <<EOF
{
  "include": ["client/src/**/*", "shared/**/*", "server/**/*"],
  "exclude": ["node_modules", "build", "dist", "**/*.test.ts"],
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": ".",
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "jsx": "preserve",
    "lib": ["esnext", "dom", "dom.iterable"],
    "baseUrl": ".",
    "types": ["node", "vite/client"],
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
EOF
mv temp-tsconfig.json tsconfig.json
echo "TypeScript configuration updated"

# Step 2: Build TypeScript files
echo "Building TypeScript files..."
./node_modules/.bin/tsc

# Step 3: Build frontend with Vite
echo "Building frontend with Vite..."
npm run build

# Step 4: Copy static files
echo "Copying static files..."
mkdir -p dist/public
if [ -d "public" ]; then
  cp -r public/* dist/public/ 2>/dev/null || true
fi

# Step 5: Verify the build output
if [ -d "./dist" ] && [ -f "./dist/server/index.js" ]; then
  echo "✅ Build successful!"
else
  echo "❌ Build verification failed. The dist/server/index.js file is missing."
  echo "Please check the build output for errors."
  exit 1
fi

# Step 6: Update package.json for CloudRun (if needed)
if [ ! -f "./dist/package.json" ]; then
  echo "Creating minimal package.json for the production build..."
  cat > ./dist/package.json <<EOF
{
  "name": "fundamenta-life-skills",
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": ">=16.0.0"
  },
  "main": "server/index.js"
}
EOF
fi

echo "Deployment preparation completed at $(date)"
echo "You can now deploy the application with: NODE_ENV=production node dist/server/index.js"