# Engagement Engine Testing Guide

This document explains how to test the Engagement Engine implementation to ensure it's working correctly before integrating it with the frontend.

## Available Test Tools

We've created three separate tools for testing:

1. **API Endpoint Tester** (`test-engagement-api.js`)
   - Tests the HTTP endpoints through the API
   - Requires authentication (session cookie)
   - Validates response formats and structures

2. **Direct Storage Tester** (`test-engagement-storage.js`)
   - Tests the database layer functions directly
   - Doesn't require authentication
   - Great for verifying database connectivity and function behavior
   - Can test both read and write operations

3. **Schema Verification Tool** (`verify-engagement-schema.js`)
   - Verifies the schema definitions match the actual database structure
   - Checks if all required functions are implemented
   - Help catch inconsistencies between code and database

## Prerequisites

Before running the tests, make sure you have installed the required dependencies:

```bash
npm install axios chalk dotenv
```

## Testing Process

### 1. Verify Schema

First, verify that the schema definitions match the database structure:

```bash
node verify-engagement-schema.js
```

This will:
- Connect to the database
- Compare code schema definitions with database tables
- Verify all required storage functions are implemented

### 2. Test Storage Functions Directly

Next, test the storage layer functions:

```bash
node test-engagement-storage.js
```

For more comprehensive testing including functions that modify data:

```bash
node test-engagement-storage.js --advanced
```

To test with a specific user ID:

```bash
node test-engagement-storage.js --user=123
```

### 3. Test API Endpoints

Finally, test the API endpoints:

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

## Next Steps

After verifying the backend functionality works correctly, you can proceed with implementing the frontend components that will use these API endpoints.