# Fundamenta Deployment Guide

This guide covers how to deploy the Fundamenta application to CloudRun via Replit Deployments.

## Pre-Deployment Checklist

1. **Database Setup**
   - Ensure PostgreSQL database is provisioned and accessible
   - Verify DATABASE_URL environment variable is set correctly
   - Verify all migrations have been run

2. **Environment Variables**
   - Ensure the following variables are set:
     - `DATABASE_URL`: Connection string for PostgreSQL
     - `NODE_ENV`: Set to "production" for deployment
     - `SESSION_SECRET`: Secure random string for session encryption

3. **Build Process**
   - Run `npm run build` to build both frontend and backend
   - Verify the `dist` directory is created with all required files
   - Run the verification script: `node verify-deployment.js`

## Deploying with Replit

1. Click the **Deploy** button in the Replit interface
2. Follow the prompts to configure your deployment
3. Choose the CloudRun option when available

## CloudRun Health Check Configuration

The application has been specially configured to work with CloudRun's health checking requirements:

1. **Root Health Check Endpoint**
   - The application responds to GET requests at the root path (/) with a simple JSON response: `{"status":"ok"}`
   - This is required for CloudRun to consider the service healthy

2. **Multiple Levels of Protection**
   - Three levels of health check handlers are implemented:
     1. First-priority middleware to catch requests before any other handlers
     2. Dedicated health check router mounted at the root path
     3. Direct Express route handler as a fallback

3. **Production Optimization**
   - When `NODE_ENV` is set to "production", specialized CloudRun-specific health checks are enabled
   - The response format is minimized to reduce overhead

## Troubleshooting Deployment Issues

If deployment fails, check the following:

1. **Health Check Failures**
   - Verify that the root path (/) returns `{"status":"ok"}` with a 200 status code
   - Check logs for any errors in the health check handlers

2. **Database Connection Issues**
   - Verify DATABASE_URL is correctly set in environment variables
   - Test database connectivity using `check_database_status` tool
   - Ensure IP allowlist includes CloudRun service IP ranges

3. **Build Errors**
   - Check if frontend and backend were successfully built
   - Verify all required files exist in the `dist` directory
   - Run verification script to identify potential issues

## Post-Deployment Verification

After deployment completes, verify the application by:

1. Accessing the root URL to ensure it loads properly
2. Checking CloudRun logs for any startup errors
3. Testing key functionality to ensure everything works as expected

## Maintenance and Updates

For future updates:

1. Make your changes to the codebase
2. Run `npm run build` to rebuild the application
3. Run verification script to check for potential issues
4. Deploy using the Replit Deploy button