# Fundamenta Deployment Guide

This guide will walk you through deploying the Fundamenta platform using Vercel for hosting and Supabase for the database.

## Step 1: Prepare Your Supabase Database

1. **Set up your Supabase project**:
   - Go to your Supabase dashboard and select your project
   - Navigate to Project Settings → Database to find your connection string
   - Replace `[YOUR-PASSWORD]` in the connection string with your actual database password

2. **Initialize database schema**:
   - After deployment, Vercel will automatically run the database migrations

## Step 2: Deploy to Vercel

1. **Push your code to GitHub**:
   - Make sure all your code is committed and pushed to GitHub

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New" → "Project"
   - Connect to your GitHub repository
   - Select "Other" as the framework preset

3. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set up environment variables**:
   Add the following environment variables from your `.env.vercel` file:
   
   - `DATABASE_URL` - Your Supabase connection string
   - `USE_SUPABASE` - Set to `true`
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_KEY` - Your Supabase service role key
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `SESSION_SECRET` - A strong random string for session encryption
   - `NODE_ENV` - Set to `production`

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

## Step 3: Verify Deployment

1. **Check your deployed application**:
   - Once deployment is complete, Vercel will provide a URL to your application
   - Visit the URL and verify that the application is working correctly

2. **Test critical features**:
   - Authentication
   - Database operations
   - OpenAI integration
   - Visuals and styling

## Step 4: Set Up Custom Domain (Optional)

1. Navigate to your project settings in Vercel
2. Go to "Domains"
3. Add your custom domain and follow the verification steps

## Troubleshooting

### Database Connection Issues

If you experience database connection problems:

1. Verify your `DATABASE_URL` is correct and includes `?pgbouncer=true` at the end
2. Check that your IP is allowed in the Supabase dashboard
3. Make sure your database password is URL-encoded if it contains special characters

### Build Failures

If the build fails:

1. Check the build logs in Vercel
2. Make sure all dependencies are listed in `package.json`
3. Verify that the build commands work locally

### Runtime Errors

For errors after deployment:

1. Check Function Logs in your Vercel dashboard
2. Verify all environment variables are correctly set
3. Make sure your API keys have the proper permissions