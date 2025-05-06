# Deployment Guide for Fundamenta Life Skills

This guide provides instructions for deploying the Fundamenta Life Skills application to various environments.

## Preparation

Before deploying, ensure your application is ready:

1. All tests pass (`npm test`)
2. The application builds successfully (`npm run build`)
3. Required environment variables are configured 

## Required Environment Variables

The following environment variables are required for deployment:

- `DATABASE_URL`: Connection string for PostgreSQL database
- `PORT`: Port on which the server will listen (default: 8080)
- `NODE_ENV`: Set to "production" for deployment
- `OPENAI_API_KEY`: Required for AI features 

## Deployment Options

### 1. Replit Deployment

To deploy using Replit Deployments:

1. Prepare the deployment configuration:
   ```
   node deployment/replit-deployment.js
   ```

2. Click the "Deploy" button in the Replit interface

3. Select your deployment configuration in the deployment interface

4. Deploy the application

### 2. Docker Deployment (e.g. Cloud Run)

For containerized deployment:

1. Build the Docker image:
   ```
   docker build -f deployment/cloudrun.Dockerfile -t fundamenta-app .
   ```

2. Test the container locally:
   ```
   docker run -p 8080:8080 --env-file .env fundamenta-app
   ```

3. Deploy to your container platform (e.g., Google Cloud Run, AWS ECS)

### 3. Traditional Node.js Deployment

For traditional Node.js hosting:

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   NODE_ENV=production node deployment/production-server.js
   ```

## Post-Deployment Verification

After deployment, verify:

1. The application is accessible at the deployment URL
2. Health checks are passing (`/health` endpoint returns `{"status":"ok"}`)
3. Database connections are working
4. Authentication is functioning

## Troubleshooting

If deployment fails:

1. Check server logs for error messages
2. Verify all environment variables are set correctly
3. Confirm database connection is working
4. Run the validation script: `node deploy-validation.js`

## Rollback Procedure

If a deployment fails and needs to be rolled back:

1. Identify the last stable deployment
2. Redeploy the previous version using the same deployment process
3. Verify the rollback is successful using the verification steps above