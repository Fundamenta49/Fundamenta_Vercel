#!/bin/bash
# CloudRun Deployment Preparation Script
# This script prepares the application for CloudRun deployment

# Set up error handling
set -e
echo "Starting CloudRun deployment preparation..."

# Create the data directory if it doesn't exist
echo "Setting up data directory..."
mkdir -p data

# Copy exercises data to the expected location
echo "Copying exercises data to data directory..."
if [ -f exercises-data.json ]; then
  cp exercises-data.json data/exercises.json
  echo "Successfully copied exercises data to data/exercises.json"
else
  echo "WARNING: exercises-data.json not found!"
  echo "Creating empty exercises file as placeholder..."
  echo "[]" > data/exercises.json
fi

# Run the main build script
echo "Running main build script..."
bash build.sh

# Make sure health check files are included
echo "Setting up health check files for CloudRun..."
cp health-check-server.js dist/
cp health-check-express.js dist/
cp Procfile dist/

# Create a basic index.html if it doesn't exist
echo "Ensuring index.html exists..."
mkdir -p dist/public
if [ ! -f dist/public/index.html ]; then
  echo "Creating minimal index.html..."
  cat > dist/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fundamenta Life Skills</title>
  <style>
    body {
      font-family: sans-serif;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .loader {
      margin: 50px auto;
      border: 10px solid #f3f3f3;
      border-top: 10px solid #ff69b4;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <h1>Fundamenta Life Skills</h1>
  <p>Loading application...</p>
  <div class="loader"></div>
  <script>
    // Redirect to the main app after delay
    setTimeout(() => {
      window.location.href = '/app';
    }, 2000);
  </script>
</body>
</html>
EOF
  echo "Created minimal index.html for CloudRun health checks"
fi

# Create a standalone JSON health check file
echo "Creating dedicated health check JSON file..."
cat > dist/_health << 'EOF'
{"status":"ok"}
EOF

# Final verification
echo "Verifying deployment files..."
if [ -f dist/index.js ] && [ -f dist/health-check-express.js ] && [ -f dist/public/index.html ]; then
  echo "✅ All required files are present"
  echo "Deployment preparation complete!"
else
  echo "❌ Some deployment files are missing!"
  [ ! -f dist/index.js ] && echo "Missing dist/index.js"
  [ ! -f dist/health-check-express.js ] && echo "Missing dist/health-check-express.js"
  [ ! -f dist/public/index.html ] && echo "Missing dist/public/index.html"
  exit 1
fi