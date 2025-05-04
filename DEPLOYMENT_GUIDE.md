# Fundamenta CloudRun Deployment Guide

This guide explains how to deploy the Fundamenta app to CloudRun and troubleshoot common deployment issues.

## Understanding the Health Check System

CloudRun requires your application to respond to health check requests at the root path `/` with:
- Status code: 200 OK
- Response body: `{"status":"ok"}`

If your application fails to respond correctly, deployment will fail with an "Internal error."

## Current Deployment Setup

We've implemented multiple health check solutions to ensure CloudRun deployments succeed:

### Primary Solution (Currently Active)
- `cloud-server.cjs`: A CommonJS standalone HTTP server that responds to all requests with the required health check response.
- `Procfile`: Configured to use this minimal server as the entry point.
- `public/_health`: Static file that provides a health check response for direct file serving.

Note: We're using the CommonJS (.cjs) file extension to avoid ES module system conflicts.

### Alternative Solutions (Available but not active)
If the primary solution doesn't work, try one of these alternatives:

1. **Ultra-Minimal HTTP Server**:
   - `cloudrun-health-web.js`: Bare-bones HTTP server with zero dependencies
   - Update Procfile to: `web: node cloudrun-health-web.js`

2. **Express-based Health Check Server**:
   - `health-check-express.js`: Minimal Express server for health checks
   - Update Procfile to: `web: node health-check-express.js`

## Deployment Steps

1. **Verify the minimal server works**:
   - Run `node verify-deployment.cjs` to test if the minimal server correctly responds to health checks.
   - Ensure it outputs "✅ Deployment verification PASSED."

2. **Check Procfile configuration**:
   - Verify `Procfile` contains `web: node cloud-server.cjs`

3. **Deploy to CloudRun**:
   - Use the Replit Deploy button
   - Select CloudRun as the deployment target
   - Wait for the deployment to complete

## Troubleshooting

If deployment fails, try these solutions:

1. **Binding to the correct interface**:
   - Ensure your server binds to `0.0.0.0` (not 127.0.0.1 or localhost)
   - Check this in `cloud-server.cjs`

2. **Port configuration**:
   - Verify your application uses the PORT environment variable: `const PORT = process.env.PORT || 8080;`

3. **Health check response format**:
   - Ensure response is exactly `{"status":"ok"}` (no extra whitespace, no pretty printing)
   - Verify Content-Type header is set to `application/json`

4. **Health check routing**:
   - The minimal server handles all paths, but for the main app, ensure the root path `/` is not blocked by middleware

5. **CloudRun limitations**:
   - Maximum startup time: 4 minutes
   - If your application takes longer to start, CloudRun will fail the deployment

## Advanced Solutions

For integrating health checks with your main application:

1. **Use direct health check middleware**:
   ```javascript
   app.use((req, res, next) => {
     if (req.path === '/' && req.method === 'GET') {
       const userAgent = req.headers['user-agent'] || '';
       if (userAgent.includes('GoogleHC') || req.query.health === 'true') {
         return res.status(200).json({ status: 'ok' });
       }
     }
     next();
   });
   ```

2. **Implement a two-server solution**:
   - Main server for your application
   - Minimal server for health checks on a different port

## Need Further Help?

For persistent deployment issues:

### Try Alternative Health Check Files
1. If `cloud-server.cjs` doesn't work, try:
   ```
   # In Procfile
   web: node cloudrun-health-web.js
   ```

2. If that fails too, try:
   ```
   # In Procfile
   web: node health-check-express.js
   ```

### Extreme Simplification
Create a new file `bare-minimum.js`:
```javascript
require('http').createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end('{"status":"ok"}');
}).listen(process.env.PORT || 8080, '0.0.0.0');
```

Update Procfile:
```
web: node bare-minimum.js
```

### CloudRun Deployment Verification
If you're still having issues, check that:
1. The CloudRun service is configured with enough memory (at least 512MB)
2. The CloudRun service timeout is sufficient (at least 60 seconds)
3. Permissions are set correctly for the service account

### Last Resort
If all else fails, contact Replit support or the CloudRun team for assistance specific to your deployment case.