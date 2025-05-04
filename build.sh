#!/bin/bash

# This script properly prepares data files for deployment

echo "Starting build preparation..."

# Create data directories
mkdir -p /home/runner/workspace/data
mkdir -p dist/data

# Copy exercise data
if [ -f server/data/exercises.json ]; then
  echo "Copying exercises.json to workspace data directory"
  cp server/data/exercises.json /home/runner/workspace/data/
  
  echo "Copying exercises.json to dist/data for deployment"
  cp server/data/exercises.json dist/data/
else
  echo "Warning: exercises.json not found in server/data/"
fi

# Copy any other data files needed for fitness features
if [ -d server/data ]; then
  echo "Copying all server data files to dist/data for deployment"
  cp -r server/data/* dist/data/
else
  echo "Warning: server/data directory not found"
fi

# Copy client data files if any (like yoga poses)
if [ -d client/src/data ]; then
  echo "Copying client data files to dist/data for deployment"
  cp -r client/src/data/* dist/data/
else
  echo "Warning: client/src/data directory not found"
fi

echo "Build preparation complete!"

# Run the regular build
npm run build