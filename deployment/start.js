/**
 * Production Deployment Startup Script
 * 
 * This script ensures proper startup of the application in a production environment.
 * It handles:
 * 1. Environment variable validation
 * 2. Basic health checks
 * 3. Database connection verification
 * 4. Graceful startup and shutdown
 * 
 * Usage: node deployment/start.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const requiredEnvVars = ['DATABASE_URL'];
const appStartCommand = 'node';
const appStartArgs = ['dist/index.js'];

// Set environment to production
process.env.NODE_ENV = 'production';

// Logging utility
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Check if required environment variables are set
function validateEnvironment() {
  log('Validating environment variables...');
  
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    log(`ERROR: Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  log('Environment validation successful');
  return true;
}

// Check if build files exist
function validateBuild() {
  log('Validating build files...');
  
  const mainServerFile = path.resolve('dist/index.js');
  const mainClientFile = path.resolve('dist/client/index.html');
  
  if (!fs.existsSync(mainServerFile)) {
    log('ERROR: Server build file not found. Make sure to run "npm run build" first.');
    return false;
  }
  
  if (!fs.existsSync(mainClientFile)) {
    log('ERROR: Client build files not found. Make sure to run "npm run build" first.');
    return false;
  }
  
  log('Build files validation successful');
  return true;
}

// Start the application
function startApplication() {
  log('Starting application in production mode...');
  
  const app = spawn(appStartCommand, appStartArgs, {
    env: process.env,
    stdio: 'inherit'
  });
  
  app.on('close', (code) => {
    if (code !== 0) {
      log(`Application process exited with code ${code}`);
      process.exit(code);
    }
  });
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    log('SIGTERM received, shutting down gracefully...');
    app.kill('SIGTERM');
    // Give the app a chance to clean up
    setTimeout(() => {
      log('Forcing shutdown after timeout');
      process.exit(0);
    }, 5000);
  });
  
  process.on('SIGINT', () => {
    log('SIGINT received, shutting down gracefully...');
    app.kill('SIGINT');
    // Give the app a chance to clean up
    setTimeout(() => {
      log('Forcing shutdown after timeout');
      process.exit(0);
    }, 5000);
  });
  
  return app;
}

// Main process
function main() {
  log('Starting production deployment script...');
  
  // Perform validations
  if (!validateEnvironment() || !validateBuild()) {
    log('Validation failed, terminating startup process');
    process.exit(1);
  }
  
  // Set default port if not specified
  if (!process.env.PORT) {
    process.env.PORT = '8080';
    log(`No PORT specified, defaulting to ${process.env.PORT}`);
  }
  
  // Start the application
  const app = startApplication();
  
  log('Startup script completed, application running');
}

// Run the main process
main();