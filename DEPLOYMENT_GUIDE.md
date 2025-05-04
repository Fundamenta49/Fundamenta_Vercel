# Fundamenta Deployment Guide

This guide explains how to deploy the Fundamenta application to Replit CloudRun.

## Prerequisites

1. A Replit account
2. The Fundamenta project cloned to your Replit workspace
3. Required secrets and API keys configured in your Replit environment

## Deployment Steps

### 1. Prepare Your Application

Make sure your application is properly configured for production:

- Check that all necessary dependencies are installed
- Verify that environment variables are correctly set up
- Ensure your database is properly configured

### 2. CloudRun Deployment

#### Special Note on Health Checks

CloudRun requires an endpoint that responds to health checks at the `/` path. We've implemented multiple approaches to ensure CloudRun health checks work:

1. **Primary Health Check**: The application handles GET requests to `/` with the appropriate response when it detects a health check request
2. **Bare Health Check**: A low-level health check implementation that intercepts HTTP requests before Express
3. **Direct Health Check**: A middleware that specifically handles health check requests
4. **Standalone Health Check**: If needed, you can deploy a standalone health check server

#### Handling Health Check Fallback

If the deployed application is still failing health checks, you can try the following:

1. Run the standalone health check server on port 8080:
   ```
   node server/standalone-health.js
   ```

2. Alternatively, you can modify `.replit.deployments` to include the health check property:
   ```json
   {
     "healthCheckPath": "/_health", 
     "healthCheckTimeout": 5
   }
   ```

### 3. Deploy Using Replit UI

To deploy your application:

1. Click the **Deploy** button in the Replit UI
2. Follow the on-screen instructions to configure your deployment
3. Select the appropriate scaling options for your needs
4. Complete the deployment process

### 4. Verify Deployment

Once deployed, verify that your application is properly serving:

1. Check the deployment logs for any errors
2. Visit the deployed URL to ensure the frontend loads correctly
3. Test critical functionality to ensure everything works as expected

### Troubleshooting

If you encounter issues during deployment:

#### Health Check Failures

If CloudRun can't detect your health check:

1. Verify that the `/` endpoint responds with `{"status":"ok"}` for health check requests
2. Check server logs for any health check related errors
3. Try using the standalone health check server approach
4. Make sure the application starts and binds to the correct port (PORT environment variable)

#### Database Connection Issues

If the application can't connect to the database:

1. Verify database URL and credentials in environment variables
2. Check for database connection timeout errors in the logs
3. Ensure database migrations are running correctly

#### General Troubleshooting Steps

1. Check deployment logs for any errors
2. Verify environment variables are correctly set
3. Test the application locally before deploying
4. Try the minimal standalone health check server if all else fails

## Maintenance

To keep your deployment running smoothly:

1. Regularly update dependencies
2. Monitor server logs for errors
3. Set up monitoring for critical endpoints
4. Implement automated database maintenance tasks

## Additional Resources

- CloudRun Documentation: [https://cloud.google.com/run/docs](https://cloud.google.com/run/docs)
- Replit Deployments: [https://docs.replit.com/hosting/deployments](https://docs.replit.com/hosting/deployments)
- Express.js Production Best Practices: [https://expressjs.com/en/advanced/best-practice-performance.html](https://expressjs.com/en/advanced/best-practice-performance.html)