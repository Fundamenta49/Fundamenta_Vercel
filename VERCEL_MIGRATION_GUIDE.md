# Vercel Migration Guide for Fundamenta

This guide outlines the steps to migrate the Fundamenta platform from Replit to Vercel.

## Prerequisites

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Have your project under Git version control
3. Complete the Supabase migration for your database (see SUPABASE_MIGRATION_GUIDE.md)

## Step 1: Prepare Your Repository

Ensure your project is properly organized for Vercel deployment:

1. Make sure your project has a clean Git history
2. The `vercel.json` configuration file is present (already added)
3. The build scripts in `package.json` are working properly

## Step 2: Connect Your Repository to Vercel

1. Log in to your Vercel dashboard
2. Click "Add New" → "Project"
3. Import your Git repository (from GitHub, GitLab, or Bitbucket)
4. Select "Other" as the framework preset when prompted

## Step 3: Configure Project Settings

On the configuration screen:

1. **Build and Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Environment Variables**:
   Add all required environment variables from your `.env` file, especially:

   ```
   DATABASE_URL=<your_supabase_connection_string>
   USE_SUPABASE=true
   OPENAI_API_KEY=<your_openai_api_key>
   SESSION_SECRET=<your_session_secret>
   ```

3. Click "Deploy"

## Step 4: Configure Custom Domain (Optional)

1. Navigate to your project settings in Vercel
2. Go to "Domains"
3. Add your custom domain and follow the verification steps

## Step 5: Set Up Deployment Protection (Optional but Recommended)

1. Go to project settings → "Git"
2. Enable "Protection for Production Branch" to prevent accidental deployments
3. Configure preview deployments for feature branches

## Step 6: Verify the Deployment

1. Once deployed, Vercel will provide a URL to your application
2. Test the major features of your application:
   - Authentication
   - Database operations
   - API interactions
   - File uploads
   
## Step 7: Set Up Monitoring and Logging

1. Go to "Monitoring" in your Vercel project
2. Enable the default integrations or connect to your preferred monitoring solution
3. Consider setting up error reporting with Sentry or similar services

## Troubleshooting

### Build Failures

If your build fails:

1. Check the build logs in Vercel
2. Make sure all dependencies are properly listed in `package.json`
3. Verify that your build command works locally

### Runtime Errors

For errors after deployment:

1. Check the Function Logs in your Vercel dashboard
2. Look for any environment variables that might be missing
3. Verify that your API keys are correctly set and have the proper permissions

### Database Connection Issues

If your app can't connect to Supabase:

1. Verify the `DATABASE_URL` is correct
2. Make sure the `USE_SUPABASE` environment variable is set to `true`
3. Check that your IP is allowed in the Supabase dashboard

## Next Steps

1. **Set up CI/CD pipeline**: Configure automated tests to run before deployment
2. **Performance optimization**: Use Vercel Analytics to identify bottlenecks
3. **Content Delivery**: Configure Vercel Edge Config for region-specific content

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli) - For local testing of Vercel configurations
- [Supabase Documentation](https://supabase.com/docs)