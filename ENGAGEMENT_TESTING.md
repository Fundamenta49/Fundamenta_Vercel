# Engagement Engine Testing Guide

This document explains how to test the Engagement Engine implementation to ensure it's working correctly before integrating it with the frontend.

## Available Test Tools

We've created four separate tools for testing:

1. **API Endpoint Tester** (`test-engagement-api.js`)
   - Tests the HTTP endpoints through the API
   - Requires authentication (session cookie)
   - Validates response formats and structures

2. **Direct Storage Tester** (`test-engagement-storage.js`)
   - Tests the database layer functions directly
   - Doesn't require authentication
   - Great for verifying database connectivity and function behavior
   - Can test both read and write operations

3. **Direct DB Functions Tester** (`test-db-functions.js`)
   - Alternative approach that doesn't require TypeScript imports
   - Tests database functionality directly with SQL
   - More reliable if you encounter issues with TypeScript ESM imports
   - Provides the same functionality testing as the storage tester

4. **Schema Verification Tool** (`verify-engagement-schema.js`)
   - Verifies the schema definitions match the actual database structure
   - Checks if all required functions are implemented
   - Help catch inconsistencies between code and database

## Prerequisites

Before running the tests, make sure you have installed the required dependencies:

```bash
npm install axios chalk dotenv
```

## Testing Process

### 1. Create Database Tables

If this is the first time running the tests, you need to create the database tables:

```bash
npm run db:push
```

If the migration is interactive and asks questions, you can create the tables manually with SQL:

```sql
CREATE TABLE IF NOT EXISTS user_engagement (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_check_in TIMESTAMP,
  streak_updated_at TIMESTAMP,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  achievement_id TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  points_earned INTEGER NOT NULL DEFAULT 0,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2. Verify Schema

Next, verify that the schema definitions match the database structure:

```bash
node verify-engagement-schema.js
```

This will:
- Connect to the database
- Compare code schema definitions with database tables
- Verify all required storage functions are implemented

### 3. Test Database Functions Directly

Use the direct database functions test:

```bash
node test-db-functions.js
```

For more comprehensive testing including functions that modify data:

```bash
node test-db-functions.js --advanced
```

To test with a specific user ID:

```bash
node test-db-functions.js --user=123
```

### 4. Test API Endpoints (Optional)

If you want to test the API endpoints:

```bash
node test-engagement-api.js
```

**Important**: Before running this test, you'll need to:
1. Log in through the browser
2. Copy your session cookie (inspect network requests, find the `connect.sid` cookie)
3. Update the `SESSION_COOKIE` value in the script

## Interpreting Test Results

Each test tool provides:
- Colored output showing pass/fail status
- Details about any errors encountered
- A summary of test results at the end

Green checkmarks (✓) indicate passing tests, while red Xs (✗) indicate failures.

## Troubleshooting

If tests fail, check the following:

1. **Database Connection**: Make sure your DATABASE_URL environment variable is set and correct
2. **Authentication**: For API tests, verify your session cookie is valid and up-to-date
3. **Database Schema**: If schema verification fails, you may need to run migrations
4. **User ID**: Make sure you're using a valid user ID that exists in the database
5. **Import Errors**: If you get ES module import errors, try using the `test-db-functions.js` script instead

## Automated Testing Script

We've created a shell script that runs all tests in sequence to make it easy to verify the Engagement Engine functionality after any code changes:

```bash
./test-engagement.sh
```

This script will:
1. Verify the schema matches the database structure
2. Run the basic database function tests
3. Ask if you want to run advanced tests (which modify data)

### Setting Up Regular Testing

To ensure consistent quality as the codebase evolves, we've created several options:

#### 1. Manual Testing

Run the test script manually after making changes:

```bash
./test-engagement.sh
```

#### 2. Automated Watching

We've created a script that watches for changes and automatically runs tests:

```bash
./schedule-engagement-tests.sh
```

This will:
- Monitor all JS and TS files in the project
- Automatically run the basic tests whenever a file changes
- Skip the advanced tests to avoid modifying data unnecessarily

You can specify a specific directory to watch:

```bash
./schedule-engagement-tests.sh ./server
```

#### 3. Git Pre-commit Hook

Add this to your `.git/hooks/pre-commit` file to prevent committing code that doesn't pass tests:

```bash
#!/bin/bash
./test-engagement.sh
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

#### 4. CI/CD Integration

Include the test script in your continuous integration pipeline to ensure all pushed code maintains quality.

## Next Steps

After verifying the backend functionality works correctly, you can proceed with implementing the frontend components that will use these API endpoints.