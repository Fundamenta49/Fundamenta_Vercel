# Supabase Migration Guide for Fundamenta

This guide outlines the steps needed to migrate the Fundamenta platform database from Replit/Neon to Supabase.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new Supabase project
3. Have access to your current database for data migration

## Step 1: Get your Supabase Connection String

1. Go to the [Supabase dashboard](https://supabase.com/dashboard/projects)
2. Create a new project if you haven't already
3. Once in the project page, click the "Connect" button on the top toolbar
4. Copy URI value under "Connection string" -> "Transaction pooler"
5. Replace `[YOUR-PASSWORD]` with the database password you set for the project

## Step 2: Configure Environment Variables

Update your environment variables with the new Supabase connection details:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:6543/postgres?pgbouncer=true
USE_SUPABASE=true
```

## Step 3: Run Database Migrations

The database adapter we've built will automatically detect that you're using Supabase and adapt its connection configuration accordingly.

To initialize your Supabase database schema, run:

```bash
npm run db:push
```

This will use Drizzle to create all the required tables on your Supabase database.

## Step 4: Migrate Data (Optional)

If you need to migrate existing data from your current database to Supabase:

1. Use the Postgres `pg_dump` command to export your current database:

```bash
pg_dump -h [YOUR_CURRENT_DB_HOST] -U [YOUR_CURRENT_DB_USER] -d [YOUR_CURRENT_DB_NAME] -F c -f fundamenta_backup.dump
```

2. Restore this dump to your Supabase database:

```bash
pg_restore -h db.[YOUR-PROJECT-ID].supabase.co -U postgres -d postgres -f fundamenta_backup.dump
```

## Step 5: Update Vercel Project Settings

If deploying to Vercel, add the following environment variables to your Vercel project:

1. `DATABASE_URL` - Your Supabase connection string
2. `USE_SUPABASE` - Set to "true"
3. Copy all other environment variables from your .env file

## Step 6: Deploy to Vercel

1. Push your project to GitHub
2. Connect your GitHub repository to Vercel
3. Configure the build settings using the included `vercel.json`
4. Deploy your application

## Troubleshooting

### Connection Issues

If you're having trouble connecting to Supabase, check:

1. That your password in the connection string is URL-encoded
2. That your IP address is allowed in the Supabase dashboard settings
3. That you're using the right connection string format with `?pgbouncer=true` at the end

### Migration Issues

If you're having issues with the Drizzle schema push:

1. Try running migrations manually using the SQL statements in `drizzle/migrations/`
2. Check Supabase logs for any errors
3. Make sure your Supabase database user has the necessary permissions

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Vercel Documentation](https://vercel.com/docs)