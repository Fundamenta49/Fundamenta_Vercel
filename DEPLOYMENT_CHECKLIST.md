# Fundamenta Vercel Deployment Checklist

## 1. Prerequisites
- [x] GitHub repository setup
- [x] Supabase project created
- [x] Vercel account ready

## 2. Environment Variables Setup
- [ ] `DATABASE_URL` - Supabase connection string with the format:
      `postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- [ ] `USE_SUPABASE` - Set to "true"
- [ ] `OPENAI_API_KEY` - Your OpenAI API key 
- [ ] `SESSION_SECRET` - A secure random string for session encryption
- [ ] Other application-specific variables from .env

## 3. Configuration Files
- [x] vercel.json created
- [x] Database adapter files updated

## 4. Build Configuration
- [ ] Framework set to "Other" (not auto-detected)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Node.js Version: 18.x or later

## 5. Database Setup
- [ ] Run migrations with `npm run db:push` before deploying
- [ ] Test database connection with test deploy

## 6. Project Repository
- [ ] Push all changes to GitHub
- [ ] Connect GitHub repository to Vercel project

## 7. Deployment Process
- [ ] Import project in Vercel dashboard
- [ ] Configure build settings according to step 4
- [ ] Add all environment variables from step 2
- [ ] Click "Deploy" to start the deployment

## 8. Post-Deployment Verification
- [ ] Test API endpoints (GET /api/health)
- [ ] Verify database connection
- [ ] Check all major application features
- [ ] Test user authentication
- [ ] Review application logs for errors

## 9. Domain Configuration (Optional)
- [ ] Add custom domain in Vercel project settings
- [ ] Configure DNS settings according to Vercel instructions

## 10. CI/CD Setup (Optional)
- [ ] Configure pull request previews
- [ ] Set up branch deployment rules

## 11. Monitoring and Analytics
- [ ] Set up Vercel Analytics
- [ ] Configure error monitoring