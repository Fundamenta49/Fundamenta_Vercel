# Essential Files for Vercel Deployment

This document lists the essential files required for deploying Fundamenta to Vercel with Supabase.

## Configuration Files
- `vercel.json` - Main Vercel configuration file
- `vercel.js` - Helper configuration for Vercel routing
- `package.json` - Project dependencies and scripts

## Database Integration
- `server/db-adapter.ts` - Database connection adapter
- `server/db-vercel.ts` - Vercel-specific database configuration
- `shared/schema.ts` - Database schema definitions

## Application Code
- `client/` directory - Frontend code
- `server/` directory - Backend API and server code
- `shared/` directory - Shared types and utilities

## Documentation
- `VERCEL_DEPLOYMENT_GUIDE.md` - Detailed deployment steps
- `DEPLOYMENT_CHECKLIST.md` - Deployment checklist
- `SUPABASE_MIGRATION_GUIDE.md` - Database migration guide

## Build Scripts
- `vercel-build.sh` - Optional build script for Vercel

## Environment Setup
- `.env.example` - Example environment variables (no secrets)

## Ignored Files
The following types of files are excluded via .gitignore:
- Temporary files (temp_*)
- Backup files (*.bak)
- Test files (test-*.js)
- Log files (*.log)
- Environment files with secrets (.env)
- Backup directories (backups/, temp_audio/, etc.)
- Build artifacts (dist/)
- Dependencies (node_modules/)