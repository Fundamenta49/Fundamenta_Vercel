# Fundamenta Life Skills Platform - Deployment Guide

## Deployment Package

This deployment package includes:

1. Enhanced health check system for cloud providers
2. Production-optimized server configuration
3. Multiple deployment options (Replit, Docker, Traditional Node.js)
4. Environment variable configuration
5. Database connection setup

## Quick Deployment (Replit)

1. Use the Deploy button in the Replit interface
2. All configuration is already set up in `deployment.json`

## Manual Deployment Steps

### Option 1: Replit Deployment

1. Ensure all environment variables are set in Replit Secrets
2. Run: `node deployment/replit-deployment.js` (already done)
3. Use the Deploy button in Replit

### Option 2: Docker Deployment (e.g., Cloud Run)

1. Build the Docker image:
   ```
   docker build -f deployment/cloudrun.Dockerfile -t fundamenta-app .
   ```

2. Run locally to test:
   ```
   docker run -p 8080:8080 --env-file .env fundamenta-app
   ```

3. Deploy to your container platform

### Option 3: Traditional Node.js Deployment

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   NODE_ENV=production node deployment/production-server.js
   ```

## Required Environment Variables

Make sure these environment variables are set in your deployment environment:

- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `OPENAI_API_KEY`: API key for OpenAI features

## Optional Environment Variables

These variables are optional but enhance functionality:

- `PORT`: Server port (default: 8080 in production)
- `NODE_ENV`: Set to "production" for deployment
- `STRIPE_SECRET_KEY`: For payment features
- `ADZUNA_APP_ID` and `ADZUNA_API_KEY`: For job search features
- `SPOONACULAR_API_KEY`: For nutrition features

## Post-Deployment Verification

After deployment, verify:

1. The application responds correctly at the deployment URL
2. The `/health` endpoint returns `{"status":"ok"}`
3. Database connection is working
4. Authentication is functioning

## Troubleshooting

If you encounter issues:

1. Check the logs for error messages
2. Verify environment variables are set correctly
3. Test database connection
4. Run verification scripts:
   - `node deployment/verify-health.js`
   - `node deployment/verify-client-assets.js`
   - `node deployment/deployment-readiness-check.js`