# Vercel Deployment Guide for Fundamenta

This guide provides detailed step-by-step instructions for deploying the Fundamenta application to Vercel with Supabase as the database.

## Step 1: Push Repository to GitHub

1. Create a new GitHub repository (if not already done)
2. Add your GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   ```
3. Push your code:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push -u origin main
   ```

## Step 2: Configure Supabase Database

1. Log in to your [Supabase dashboard](https://supabase.com/dashboard)
2. Create a new project if you haven't already
3. From your project page, navigate to Project Settings > Database
4. Get your Postgres connection string by clicking the "Connection string" tab and selecting "URI"
5. Copy the connection string which looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
   (Make sure to replace `[YOUR-PASSWORD]` with your actual database password)

## Step 3: Set Up Vercel Project

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. On the configuration page:
   - Framework Preset: Select "Other" (not auto-detected)
   - Build and Output Settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: Leave as default
   - Root Directory: Leave as `./`

## Step 4: Configure Environment Variables

Add the following environment variables to your Vercel project:

1. `DATABASE_URL`: Your Supabase connection string from Step 2
2. `USE_SUPABASE`: Set to `true` 
3. `OPENAI_API_KEY`: Your OpenAI API key
4. `SESSION_SECRET`: A secure random string (use a password generator)
5. Any other environment variables from your local `.env` file

To add environment variables:
1. In your Vercel project settings, go to "Environment Variables"
2. Add each variable one by one
3. Make sure to check "Production" and optionally "Preview" environments

## Step 5: Deploy Your Application

1. After configuring all settings, click "Deploy"
2. Watch the build logs for any errors
3. Once deployment is complete, Vercel will provide a URL to your application

## Step 6: Run Database Migrations

After the first deployment, you'll need to run database migrations to set up your schema:

1. From your local development environment:
   ```bash
   # Make sure your .env file has the correct Supabase DATABASE_URL
   npm run db:push
   ```

## Step 7: Verify Deployment

Test these key aspects of your application:

1. Frontend loads correctly
2. API endpoints respond as expected (try `/api/health`)
3. Database connections work
4. Authentication system functions properly
5. OpenAI integration works

## Step 8: Configure Domain (Optional)

1. In your Vercel project, go to "Settings" > "Domains"
2. Add your custom domain
3. Follow Vercel's instructions for DNS configuration

## Troubleshooting Common Issues

### Database Connection Issues

- Verify that `DATABASE_URL` is correctly formatted with `?pgbouncer=true` at the end
- Check that your IP address isn't blocked by Supabase
- Verify your database password is correctly URL-encoded in the connection string

### Build Failures

- Check Vercel build logs for specific errors
- Ensure all dependencies are correctly listed in your package.json
- Verify that the build command works in your local environment

### Runtime Errors

- Check Function Logs in Vercel dashboard
- Verify all environment variables are set
- Test API endpoints using the Vercel URL + /api/endpoint

## Ongoing Maintenance

- Set up Vercel GitHub integration for automatic deployments
- Configure branch preview deployments for testing
- Set up monitoring and error tracking