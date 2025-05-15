/**
 * Security Test Script
 * 
 * This script tests the JWT token creation, verification, 
 * and the cookie-based authentication system.
 */

import jwt from 'jsonwebtoken';
import { db } from './db.js';
import * as schema from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import { createToken, clearAuthCookies } from './auth/auth-middleware.js';

// Mock objects
const mockResponse = {
  cookies: {},
  cookie: function(name, value, options) {
    this.cookies[name] = { value, options };
    console.log(`Cookie set: ${name}`);
    return this;
  },
  clearCookie: function(name) {
    delete this.cookies[name];
    console.log(`Cookie cleared: ${name}`);
    return this;
  },
  json: function(data) {
    console.log('Response data:', data);
    return this;
  },
  status: function(code) {
    console.log(`Status code: ${code}`);
    return this;
  }
};

// Test functions
async function testTokenCreation() {
  console.log('\n--- Testing Token Creation ---');
  try {
    const token = createToken(1001);
    console.log('Token created successfully');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    console.log('Token verified:', decoded);
    
    return true;
  } catch (error) {
    console.error('Token creation/verification failed:', error);
    return false;
  }
}

async function testCookieClearing() {
  console.log('\n--- Testing Cookie Clearing ---');
  try {
    // Set mock cookies
    mockResponse.cookie('access_token', 'test-access-token', {});
    mockResponse.cookie('refresh_token', 'test-refresh-token', {});
    
    console.log('Before clearing:', Object.keys(mockResponse.cookies));
    
    // Clear cookies
    clearAuthCookies(mockResponse);
    
    console.log('After clearing:', Object.keys(mockResponse.cookies));
    
    return Object.keys(mockResponse.cookies).length === 0;
  } catch (error) {
    console.error('Cookie clearing failed:', error);
    return false;
  }
}

async function testDatabaseAccess() {
  console.log('\n--- Testing Database Access ---');
  try {
    // Test secure parameterized query
    const users = await db.select({
      id: schema.users.id,
      name: schema.users.name,
      role: schema.users.role
    })
    .from(schema.users)
    .limit(2);
    
    console.log(`Found ${users.length} users`);
    console.log('Database query successful');
    
    return true;
  } catch (error) {
    console.error('Database query failed:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== Starting Security Tests ===');
  
  const results = {
    tokenCreation: await testTokenCreation(),
    cookieClearing: await testCookieClearing(),
    databaseAccess: await testDatabaseAccess()
  };
  
  console.log('\n=== Test Results ===');
  for (const [test, passed] of Object.entries(results)) {
    console.log(`${test}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  }
  
  const allPassed = Object.values(results).every(r => r);
  console.log(`\nOverall result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
}

// Run tests if this file is executed directly
if (process.argv[1].endsWith('test-security.js')) {
  runTests().catch(console.error);
}

export { runTests };