/**
 * Replit Deployment Helper
 * 
 * This script prepares and configures the application for 
 * deployment on Replit's deployment platform.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Start time for logging
const startTime = Date.now();

// Helpers
function log(message) {
  const elapsed = Date.now() - startTime;
  console.log(`[${elapsed}ms] ${message}`);
}

function createDeploymentConfig() {
  log('Creating deployment configuration...');
  
  // Check if a deployment.json already exists
  if (fs.existsSync('./deployment.json')) {
    log('deployment.json already exists, skipping creation');
    return;
  }
  
  // Create a basic deployment configuration
  const deploymentConfig = {
    name: "Fundamenta Life Skills",
    run: "npm run start",
    entrypoint: "server/index.js",
    fullframe: true, // Use the full browser window
    language: "node",
    deployments: [
      {
        environment: "production",
        buildCommand: "npm run build",
      }
    ]
  };
  
  // Write the configuration
  fs.writeFileSync('./deployment.json', JSON.stringify(deploymentConfig, null, 2));
  log('Created deployment.json configuration file');
}

function ensureProdScripts() {
  log('Ensuring production scripts in package.json...');
  
  // Read package.json
  const packagePath = './package.json';
  if (!fs.existsSync(packagePath)) {
    log('ERROR: package.json not found!');
    return;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Ensure we have the right scripts
    if (!packageJson.scripts.start) {
      log('Adding "start" script for production deployment');
      packageJson.scripts.start = 'NODE_ENV=production node deployment/production-server.js';
    }
    
    // Update the build script if needed
    if (!packageJson.scripts.build) {
      log('Adding "build" script for production deployment');
      packageJson.scripts.build = 'vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist';
    }
    
    // Write updated package.json
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    log('Updated package.json with production scripts');
  } catch (error) {
    log(`ERROR modifying package.json: ${error.message}`);
  }
}

function checkRequiredFiles() {
  log('Checking for required files...');
  
  const requiredFiles = [
    './server/index.ts',
    './client/index.html',
    './deployment/production-server.js'
  ];
  
  // Check each file
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    log(`WARNING: Missing required files: ${missingFiles.join(', ')}`);
    return false;
  }
  
  log('All required files exist');
  return true;
}

// Main function to prepare for deployment
async function prepareDeployment() {
  log('Starting deployment preparation...');
  
  // Check required files
  if (!checkRequiredFiles()) {
    log('WARNING: Not all required files exist. Deployment may fail.');
  }
  
  // Create deployment configuration
  createDeploymentConfig();
  
  // Ensure production scripts
  ensureProdScripts();
  
  log('Deployment preparation complete!');
  log('To deploy your application:');
  log('1. Commit your changes with "git add . && git commit -m \'Prepared for deployment\'"');
  log('2. Use the deployment button in Replit');
  log('3. Or run from command line: deployctl deploy');
}

// Run the preparation
prepareDeployment().catch(error => {
  log(`ERROR: ${error.message}`);
  process.exit(1);
});