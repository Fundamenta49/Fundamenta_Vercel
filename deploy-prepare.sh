#!/bin/bash
# deploy-prepare.sh - Script to prepare the application for deployment

echo "=== Fundamenta Deployment Preparation Script ==="
echo "Starting deployment preparation at $(date)"

# Step 1: Print environment for debugging
echo "ENVIRONMENT VARIABLES:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "PWD: $PWD"

# Step 2: Ensure proper TypeScript config for ES Modules
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
    "jsx": "react-jsx",
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

# Step 3: Make sure node_modules is available for building
if [ ! -d "node_modules" ]; then
  echo "Warning: node_modules directory not found, installing dependencies..."
  npm install --production=false
fi

# Step 4: Verify critical dependencies are installed
echo "Verifying critical dependencies..."
if [ ! -f "./node_modules/.bin/tsc" ]; then
  echo "TypeScript not found, installing..."
  npm install typescript --no-save
fi

if [ ! -f "./node_modules/.bin/vite" ]; then
  echo "Vite not found, installing..."
  npm install vite --no-save
fi

# Step 5: Build TypeScript files
echo "Building TypeScript files..."
NODE_OPTIONS="--max-old-space-size=2048" ./node_modules/.bin/tsc

# Step 6: Build frontend with Vite
echo "Building frontend with Vite..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Step 7: Copy static files
echo "Copying static files..."
mkdir -p dist/public
if [ -d "public" ]; then
  cp -r public/* dist/public/ 2>/dev/null || true
fi

# Step 8: Copy client build
echo "Copying client build to dist..."
if [ -d "dist/client" ]; then
  echo "Client already in dist"
else
  mkdir -p dist/client
  cp -r client/dist/* dist/client/ 2>/dev/null || true
fi

# Step 9: Create special production startup file
echo "Creating production bootstrap script..."

# Just copy our production bootstrap file instead of generating it inline
if [ -f "./server/production-bootstrap.js" ]; then
  echo "Using existing production bootstrap file"
  mkdir -p dist/server
  cp ./server/production-bootstrap.js ./dist/server/
  
  # Create a simple startup script that imports the bootstrap
  cat > ./dist/start.js <<EOF
// Production entry point
console.log('Starting Fundamenta Life Skills application...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('Current directory:', process.cwd());

// Import the production bootstrap file
import('./server/production-bootstrap.js')
  .then(() => {
    console.log('Bootstrap successfully imported');
  })
  .catch(err => {
    console.error('Failed to import bootstrap:', err);
    process.exit(1);
  });
EOF
else
  echo "WARNING: Production bootstrap file not found, creating a minimal one"
  cat > ./dist/start.js <<EOF
// Minimal CloudRun startup script
import express from 'express';

// Create an Express application
const app = express();

// Handle all requests
app.use((req, res, next) => {
  console.log(\`Request: \${req.method} \${req.url}\`);
  
  // Handle health checks
  if (req.path === '/' && 
      (req.query['health-check'] !== undefined || 
       req.headers['user-agent']?.includes('GoogleHC'))) {
    return res.status(200).json({ status: 'ok' });
  }
  
  // For non-health check requests, show an info page
  res.status(200).send(\`
    <html>
      <head>
        <title>Fundamenta Application</title>
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem;
            line-height: 1.6;
          }
          h1 { color: #4B5563; }
          .message { 
            padding: 1rem; 
            background: #f3f4f6; 
            border-radius: 0.5rem;
            margin: 1rem 0;
          }
        </style>
      </head>
      <body>
        <h1>Fundamenta Life Skills Application</h1>
        <div class="message">
          <p>The application is being deployed with minimal configuration.</p>
          <p>Please check the deployment logs for more information.</p>
        </div>
      </body>
    </html>
  \`);
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(\`Server running on port \${port}\`);
});
EOF
fi

# Step 10: Verify the build output
if [ -d "./dist" ] && [ -f "./dist/server/index.js" ]; then
  echo "✅ Build successful!"
else
  echo "❌ Build verification failed. The dist/server/index.js file is missing."
  echo "Please check the build output for errors."
  ls -la ./dist/server/ || echo "Server directory not found"
  exit 1
fi

# Step 11: Update package.json for CloudRun (if needed)
echo "Creating minimal package.json for the production build..."
cat > ./dist/package.json <<EOF
{
  "name": "fundamenta-life-skills",
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": ">=16.0.0"
  },
  "main": "start.js"
}
EOF

echo "Deployment preparation completed at $(date)"
echo "You can now deploy the application with: NODE_ENV=production node dist/start.js"