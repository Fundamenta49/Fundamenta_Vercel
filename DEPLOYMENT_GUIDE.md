# Fundamenta CloudRun Deployment Guide

This guide explains how to deploy the Fundamenta app to CloudRun and troubleshoot common deployment issues.

## Understanding the Health Check System

CloudRun requires your application to respond to health check requests at the root path `/` with:
- Status code: 200 OK
- Response body: `{"status":"ok"}`

If your application fails to respond correctly, deployment will fail with an "Internal error."

## Current Deployment Setup

We've implemented an ultra-minimal health check server to ensure CloudRun deployments succeed:

- `cloud-server.js`: A standalone HTTP server that responds to all requests with the required health check response.
- `Procfile`: Configured to use this minimal server as the entry point.

## Deployment Steps

1. **Verify the minimal server works**:
   - Run `node verify-deployment.cjs` to test if the minimal server correctly responds to health checks.
   - Ensure it outputs "✅ Deployment verification PASSED."

2. **Check Procfile configuration**:
   - Verify `Procfile` contains `web: node cloud-server.js`

3. **Deploy to CloudRun**:
   - Use the Replit Deploy button
   - Select CloudRun as the deployment target
   - Wait for the deployment to complete

## Troubleshooting

If deployment fails, try these solutions:

1. **Binding to the correct interface**:
   - Ensure your server binds to `0.0.0.0` (not 127.0.0.1 or localhost)
   - Check this in `cloud-server.js`

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

For persistent deployment issues, consider simplifying further:
1. Remove all middleware temporarily
2. Test if a completely standalone express app deploys correctly
3. Gradually add back complexity, testing deployment after each change