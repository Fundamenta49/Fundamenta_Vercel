# Fundamenta CloudRun Deployment Guide

This document outlines the deployment process for the Fundamenta Life Skills application to Replit's CloudRun service.

## Health Check Implementation

CloudRun requires a functioning health check endpoint at the root `/` path that returns `{"status":"ok"}`. Our application implements multiple redundant health check mechanisms to ensure deployment success:

1. **Static Health Check Files:**
   - `/_health`
   - `/health`
   - `/index.json`
   
2. **Dynamic Health Check Servers:**
   - `cloudrun-health-web.js`: Pure Node.js lightweight HTTP server
   - `health-check-express.js`: Express-based health check server

3. **Health Check Detection Methods:**
   - Path-based detection (`/`, `/_health`, `/health`)
   - User-agent detection (GoogleHC, kube-probe)
   - Query parameter detection (`?health=true`, `?health-check=true`)
   - Request Accept header detection (`application/json`)

## Deployment Configuration

The deployment is configured in `.replit.deployments` with the following settings:

```json
{
  "deploymentId": "db52ba45-0ef8-411f-af31-4b71e7f22e4c",
  "restartPolicyType": "NEVER", 
  "restartPolicyValue": 1,
  "healthCheckPath": "/",
  "healthCheckType": "HTTP",
  "healthCheckTimeout": 10,
  "startCommand": "node cloudrun-health-web.js",
  "env": {
    "NODE_ENV": "production"
  },
  "nixPackages": {
    "nodejs-20_x": "nodejs_20"
  }
}
```

## Deployment Process

1. **Prepare the Application:**
   - Ensure all static files are generated with `npm run build`
   - Verify data files exist (`data/exercises.json`)
   - Test health check endpoints locally

2. **Deploy on Replit:**
   - Click the "Deploy" button in the Replit UI
   - Deployment will use the specified CloudRun configuration
   - Monitor deployment logs for any issues

3. **Verify Deployment:**
   - Check health endpoint at the deployment URL
   - Verify the application is functioning correctly

## Troubleshooting

If deployment fails due to health check issues:

1. **Check the logs** to see if the health check server is responding correctly
2. **Verify static health files** exist in the deployment
3. **Test the health endpoint** directly using curl from the deployment shell
4. **Try alternative health server** by modifying the `startCommand` in `.replit.deployments`

## Static Files

The deployment includes the following static health check files:

- `_health`: Root level health check file
- `public/_health`: Public directory health check file
- `health`: Alternative health check file name
- `public/health`: Alternative health check in public directory
- `public/index.json`: JSON file at root of public directory

## Data Files

For proper operation, the application requires:

- `data/exercises.json`: Exercise database (copied from `exercises-data.json` during startup)

## Environment Variables

The following environment variables are used during deployment:

- `NODE_ENV`: Set to "production" for deployment
- `PORT`: Automatically set by CloudRun (typically 8080)

## Additional Notes

- The health check server will respond to all health check requests with `{"status":"ok"}`
- For non-health-check requests, the main application will handle the response
- Both servers bind to `0.0.0.0` to ensure CloudRun can reach the service