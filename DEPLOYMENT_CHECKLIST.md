# Fundamenta Deployment Checklist

Use this checklist to ensure a successful deployment of the Fundamenta Life Skills platform.

## Pre-Deployment Checks

- [ ] **Environment Variables**
  - [ ] `DATABASE_URL` is set correctly
  - [ ] `SESSION_SECRET` is set
  - [ ] `OPENAI_API_KEY` is set
  - [ ] Other API keys are set as needed (Stripe, Adzuna, Spoonacular)

- [ ] **Database**
  - [ ] PostgreSQL database is created and accessible
  - [ ] Database migrations can run successfully
  - [ ] Test database connection with `node deploy-validation.js`

- [ ] **Build Process**
  - [ ] TypeScript compilation succeeds with `npm run check`
  - [ ] Build completes successfully with `npm run build`
  - [ ] Client assets are generated in the expected location

- [ ] **Health Checks**
  - [ ] Health endpoints respond correctly in development
  - [ ] Verify health checks with `node deployment/verify-health.js`

## Deployment Process

- [ ] **Choose Deployment Method**
  - [ ] Replit Deployment (easiest)
  - [ ] Docker/CloudRun Deployment
  - [ ] Traditional Node.js Deployment

- [ ] **Replit Deployment**
  - [ ] Run `node deployment/replit-deployment.js`
  - [ ] Verify `deployment.json` is created
  - [ ] Click the Deploy button in Replit interface

- [ ] **Docker Deployment**
  - [ ] Build Docker image with `docker build -f deployment/cloudrun.Dockerfile -t fundamenta-app .`
  - [ ] Test locally with `docker run -p 8080:8080 --env-file .env fundamenta-app`
  - [ ] Push to container registry
  - [ ] Deploy to cloud platform

- [ ] **Traditional Node.js Deployment**
  - [ ] Run `npm run build`
  - [ ] Copy dist directory to production server
  - [ ] Set up environment variables on production server
  - [ ] Start with `NODE_ENV=production node deployment/production-server.js`

## Post-Deployment Verification

- [ ] **Basic Checks**
  - [ ] Application is accessible at deployment URL
  - [ ] `/health` endpoint returns `{"status":"ok"}`
  - [ ] Login and authentication work

- [ ] **Functionality Checks**
  - [ ] Navigation works correctly
  - [ ] AI features function properly
  - [ ] Exercise recommendations load
  - [ ] Nutrition features work
  - [ ] Job search features work

- [ ] **Performance Checks**
  - [ ] Page load times are acceptable
  - [ ] API responses are timely
  - [ ] No console errors in browser

## Troubleshooting Common Issues

- **Health Check Fails**
  - Verify the application is running
  - Check server logs for errors
  - Ensure port configuration is correct

- **Database Connection Issues**
  - Verify `DATABASE_URL` is correct
  - Check for network/firewall restrictions
  - Confirm PostgreSQL instance is running

- **API Features Not Working**
  - Verify API keys are set correctly
  - Check for rate limiting issues
  - Confirm API endpoints are accessible from deployment environment

- **Client Assets Missing**
  - Verify build process completed
  - Check static file paths
  - Ensure proper distribution directory is configured