/**
 * Engagement API Test Script
 * 
 * This script tests the engagement engine API endpoints to verify they're working correctly.
 * It requires a valid user session cookie to work with authenticated endpoints.
 * 
 * Run with: node test-engagement-api.js
 */

import axios from 'axios';
import chalk from 'chalk'; // For colored console output
import { createInterface } from 'readline';

// Configuration
const BASE_URL = 'http://localhost:3000';
const ENDPOINTS = [
  { 
    name: 'Get User Engagement', 
    method: 'GET', 
    path: '/api/engagement/',
    expectedProps: ['id', 'userId', 'currentStreak', 'totalPoints', 'level']
  },
  { 
    name: 'Get User Streak', 
    method: 'GET', 
    path: '/api/engagement/streak',
    expectedProps: ['streak']
  },
  { 
    name: 'Get User Achievements', 
    method: 'GET', 
    path: '/api/engagement/achievements',
    isArray: true,
    itemProps: ['id', 'userId', 'achievementId', 'type', 'name', 'description']
  },
  { 
    name: 'Get Achievement Summary', 
    method: 'GET', 
    path: '/api/engagement/achievement-summary',
    expectedProps: ['summary', 'totalAchievements', 'totalPoints', 'recentAchievements']
  },
  { 
    name: 'Get User Activities', 
    method: 'GET', 
    path: '/api/engagement/activities',
    isArray: true,
    itemProps: ['id', 'userId', 'type', 'data', 'pointsEarned', 'timestamp']
  },
  { 
    name: 'Get Activity Stats', 
    method: 'GET', 
    path: '/api/engagement/activity-stats',
    expectedProps: ['activityStats', 'totalActivities', 'totalPoints', 'distinctActivityTypes']
  },
  { 
    name: 'Get Comprehensive Summary', 
    method: 'GET', 
    path: '/api/engagement/summary',
    expectedProps: ['user', 'streak', 'achievements', 'activities', 'levelProgress']
  },
  { 
    name: 'Record Activity', 
    method: 'POST', 
    path: '/api/engagement/activity',
    data: {
      type: 'test_activity',
      data: { source: 'test_script', action: 'verify_api' },
      pointsEarned: 5
    },
    expectedProps: ['id', 'userId', 'type', 'data', 'pointsEarned', 'timestamp']
  },
  { 
    name: 'Daily Check-in', 
    method: 'POST', 
    path: '/api/engagement/check-in',
    expectedProps: ['id', 'userId', 'currentStreak', 'lastCheckIn']
  }
];

// You'll need to replace this with a valid session cookie from the browser
// Get this by logging in through the browser and copying the cookie
const SESSION_COOKIE = 'connect.sid=YOUR_SESSION_COOKIE'; 

// Test runner
async function runTests() {
  console.log(chalk.blue.bold('🧪 Starting Engagement API Tests'));
  console.log(chalk.blue('=================================\n'));
  
  let passCount = 0;
  let failCount = 0;
  
  // Create axios instance with cookie
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Cookie': SESSION_COOKIE
    }
  });
  
  for (const endpoint of ENDPOINTS) {
    console.log(chalk.cyan(`Testing: ${endpoint.name} (${endpoint.method} ${endpoint.path})`));
    
    try {
      let response;
      
      // Make the request
      if (endpoint.method === 'GET') {
        response = await api.get(endpoint.path);
      } else if (endpoint.method === 'POST') {
        response = await api.post(endpoint.path, endpoint.data || {});
      }
      
      // Check if response exists
      if (!response || !response.data) {
        throw new Error('No response data returned');
      }
      
      // Check response structure
      const data = response.data;
      
      // For array responses
      if (endpoint.isArray) {
        if (!Array.isArray(data)) {
          throw new Error(`Expected an array response, got: ${typeof data}`);
        }
        
        if (data.length > 0 && endpoint.itemProps) {
          // Check first item for expected properties
          for (const prop of endpoint.itemProps) {
            if (!(prop in data[0])) {
              throw new Error(`Expected property '${prop}' missing from array item`);
            }
          }
        }
        
        console.log(chalk.green(`  ✓ Received array with ${data.length} items`));
      } 
      // For object responses
      else if (endpoint.expectedProps) {
        for (const prop of endpoint.expectedProps) {
          if (!(prop in data)) {
            throw new Error(`Expected property '${prop}' missing from response`);
          }
        }
        
        console.log(chalk.green(`  ✓ Response contains all expected properties`));
      }
      
      // Log response data (preview)
      const preview = JSON.stringify(data).substring(0, 100) + 
        (JSON.stringify(data).length > 100 ? '...' : '');
      console.log(chalk.gray(`  Response preview: ${preview}`));
      
      console.log(chalk.green.bold(`  ✓ TEST PASSED`));
      passCount++;
      
    } catch (error) {
      console.log(chalk.red(`  ✗ ERROR: ${error.message}`));
      
      // Show response error if available
      if (error.response) {
        console.log(chalk.red(`  Status: ${error.response.status}`));
        console.log(chalk.red(`  Data: ${JSON.stringify(error.response.data)}`));
      }
      
      console.log(chalk.red.bold(`  ✗ TEST FAILED`));
      failCount++;
    }
    
    console.log(''); // Empty line between tests
  }
  
  // Summary
  console.log(chalk.blue('================================='));
  console.log(chalk.blue.bold(`📊 Test Summary:`));
  console.log(chalk.green(`  ✓ Passed: ${passCount}`));
  console.log(chalk.red(`  ✗ Failed: ${failCount}`));
  console.log(chalk.blue(`  Total: ${ENDPOINTS.length}`));
  
  // Warning about authentication
  if (SESSION_COOKIE.includes('YOUR_SESSION_COOKIE')) {
    console.log(chalk.yellow(`\n⚠️  WARNING: You're using a placeholder session cookie.`));
    console.log(chalk.yellow(`   To properly test authenticated endpoints, replace the SESSION_COOKIE`));
    console.log(chalk.yellow(`   value with a valid cookie from your browser after logging in.`));
  }
}

// Manual authentication notice
console.log(chalk.yellow(`\n⚠️  IMPORTANT: This test script requires authentication.`));
console.log(chalk.yellow(`   Before running the tests, please:`));
console.log(chalk.yellow(`   1. Log in through the browser`));
console.log(chalk.yellow(`   2. Copy your session cookie (connect.sid=...)`));
console.log(chalk.yellow(`   3. Update the SESSION_COOKIE value in this script\n`));

console.log(chalk.gray(`   To continue with the placeholder cookie (will likely fail),`));
console.log(chalk.gray(`   press Enter, or Ctrl+C to cancel and update the cookie.`));

// Wait for user confirmation or update

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('', () => {
  readline.close();
  runTests().catch(err => {
    console.error(chalk.red.bold('Test execution error:'), err);
  });
});