# Fundamenta Deployment Guide

This guide explains how to deploy the Fundamenta platform on Replit CloudRun.

## Deployment Prerequisites

1. The application must respond with a 200 OK status code at the root path (/).
2. The deployment configuration must be set up in `.replit.deployments` file.
3. The build script must be executable (`chmod +x build.sh`).

## Verification

Run the verification script to check if your application is ready for deployment:

```bash
node verify-deployment.js
```

This script will check:
- Your `.replit.deployments` configuration
- The build script
- Health check implementation
- Server response at the root path

## Key Files

- `server/health-checks.ts`: Contains the middleware for serving the root path health check
- `build.sh`: Handles the build process for deployment
- `.replit.deployments`: Configuration for CloudRun deployment

## Deployment Process

1. Make sure all verification checks pass
2. Click the "Deploy" button in the Replit UI
3. Wait for the build and deployment to complete
4. Verify the application is running correctly at the provided URL

## Troubleshooting

If deployment fails, check:

1. The logs in the deployment panel
2. The health check endpoint (root path) is returning a 200 status code
3. The build script ran successfully
4. Environment variables are properly set

If the root health check is failing, check:
- The health check middleware is registered first in the Express application
- The health check middleware is correctly filtering for the root path

## Environment Variables

The following environment variables should be set up in the Replit Secrets panel:

- `DATABASE_URL`: PostgreSQL database connection string
- `SESSION_SECRET`: Secret for session encryption
- `NODE_ENV`: Should be set to `production` for deployment

## Post-Deployment Verification

After deployment, verify that:

1. The root path (/) returns a proper JSON response
2. The application is accessible at the deployed URL
3. All API endpoints are working correctly
4. Database connections are working
5. Static assets are being served properly

## Common Deployment Issues

1. **Health Check Fails**: Make sure the health check returns a 200 status code at the root path
2. **Missing Assets**: Ensure all static assets are being included in the build
3. **Environment Variables**: Check that all required environment variables are set
4. **Database Connection**: Verify the database connection is working in the deployed environment
5. **Resource Limits**: Monitor resource usage, especially memory and CPU

## Deployment Architecture

The Fundamenta application uses:
- Express.js backend
- React frontend built with Vite
- PostgreSQL database
- CloudRun for hosting

The build process:
1. Builds the frontend with Vite
2. Builds the backend with esbuild
3. Copies all necessary data files and assets
4. Verifies health check middleware is in place

## Maintenance

To update the deployed application:
1. Make your changes
2. Run the verification script
3. Click "Deploy" again in the Replit UI