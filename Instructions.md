# Fundamenta Deployment Fix Plan

## Problem Diagnosis
The current deployment is passing health checks (showing "status ok") but not serving any application content. This is happening because:

1. The `.replit` deployment configuration is using `cloudrun-health-web.cjs` which only handles health checks
2. The TypeScript compilation process isn't completing correctly in the deployed environment
3. Static files are not being served properly from the correct directories
4. There are port configuration mismatches between development and production

## Comprehensive Fix Plan

### Step 1: Update cloudrun-health-web.cjs (Already Done)
We've already created an improved version that:
- Handles health checks properly
- Attempts to serve static files
- Provides detailed logging
- Runs the build process in the background

### Step 2: Prepare a Production Build Before Deployment

Before deploying, run:
```
npm run build
```

This will:
- Build the frontend with Vite
- Compile TypeScript files with proper module settings
- Put all necessary files in the correct directories

### Step 3: Verify Directory Structure After Build

The build should create:
- `dist/client/` - Contains the frontend Vite build
- `dist/server/` - Contains compiled TypeScript server files
- `dist/public/` - Contains static assets

### Step 4: Update `.replit` File for Deployment

The deployment section of `.replit` should be:

```
[deployment]
deploymentTarget = "cloudrun"
build = ["sh", "-c", "npm run build"]
run = ["node", "cloudrun-health-web.cjs"]
```

### Step 5: Proper Port Configuration

Ensure port 8080 is used for the deployed application:
- In `cloudrun-health-web.cjs`, we're already using `process.env.PORT || 8080`
- Make sure your server/index.ts also uses `process.env.PORT || 5000` (for local dev)

### Step 6: Enable Debugging in Production

Add these environment variables to your deployment:
```
[deployment.environment]
NODE_ENV = "production"
DEBUG = "app:*"
```

## Troubleshooting Steps After Deployment

If the application still only shows "status ok" after these changes:

1. Check deployment logs for errors:
   - TypeScript compilation errors
   - Directory not found errors
   - Module resolution errors

2. Try a minimal deployment:
   - Use just the static files with a basic Express server
   - Remove complex backend logic temporarily

3. Verify CloudRun configuration:
   - Check memory allocation (minimum 512MB)
   - Ensure proper CPU allocation

4. Test API endpoints separately:
   - Try accessing `/api/health` to see if the backend is working
   - Check if specific routes are accessible

## Long-Term Reliable Solution

For a more reliable deployment strategy:

1. Set up a dedicated build step that:
   - Compiles TypeScript with the correct settings
   - Builds frontend assets with Vite
   - Creates a clean production directory structure

2. Use a two-stage deployment process:
   - Health check handler that starts immediately
   - Full application bootstrap that initializes gradually

3. Implement comprehensive health checks that:
   - Verify database connections
   - Check API integrations
   - Monitor system resources

4. Add proper logging:
   - Structured JSON logs
   - Error tracking
   - Performance metrics