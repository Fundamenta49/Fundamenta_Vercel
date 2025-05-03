/**
 * Direct Storage Test Utility for Engagement Engine
 * 
 * This script directly tests the storage layer functions for the Engagement Engine
 * without going through the API endpoints, which allows for testing without authentication.
 * 
 * Run with: node test-engagement-storage.js
 */

// Import required modules
require('dotenv').config(); // Load environment variables

// These imports would need to be adjusted based on your project structure
// Since this is a script run from the command line, we need to use require
const { storage } = require('./server/storage');
const { Pool } = require('pg');
const chalk = require('chalk'); // For colored output

// Configuration
const TEST_USER_ID = 1; // Replace with a valid user ID from your database

// Test functions 
const tests = [
  {
    name: 'getUserEngagement',
    func: async () => await storage.getUserEngagement(TEST_USER_ID),
    expectedProps: ['id', 'userId', 'currentStreak', 'totalPoints', 'level']
  },
  {
    name: 'getStreak',
    func: async () => await storage.getStreak(TEST_USER_ID),
    validate: (result) => typeof result === 'number',
    customSuccessMessage: (result) => `User has a streak of ${result} days`
  },
  {
    name: 'getUserAchievements',
    func: async () => await storage.getUserAchievements(TEST_USER_ID),
    isArray: true,
    itemProps: ['id', 'userId', 'achievementId', 'type', 'name']
  },
  {
    name: 'getUserActivities',
    func: async () => await storage.getUserActivities(TEST_USER_ID, 5),
    isArray: true,
    itemProps: ['id', 'userId', 'type', 'pointsEarned', 'timestamp']
  },
  {
    name: 'recordUserActivity',
    func: async () => await storage.recordUserActivity(
      TEST_USER_ID, 
      'test_activity', 
      { source: 'direct_test', timestamp: new Date().toISOString() }, 
      1
    ),
    expectedProps: ['id', 'userId', 'type', 'data', 'pointsEarned', 'timestamp']
  }
];

// Optional tests that modify data more significantly
const advancedTests = [
  {
    name: 'checkInUser',
    func: async () => await storage.checkInUser(TEST_USER_ID),
    expectedProps: ['id', 'userId', 'currentStreak', 'lastCheckIn', 'totalPoints'],
    warning: 'This will perform a daily check-in and may advance the user streak'
  },
  {
    name: 'addUserAchievement',
    func: async () => await storage.addUserAchievement({
      userId: TEST_USER_ID,
      achievementId: 'test_achievement_' + Date.now(),
      achievementName: 'Test Achievement',
      achievementDescription: 'Created during direct storage testing',
      achievementType: 'test',
      points: 1
    }),
    expectedProps: ['id', 'userId', 'achievementId', 'name', 'description', 'points'],
    warning: 'This will add a new achievement to the user record'
  }
];

// Test runner
async function runTests(testList, runAdvanced = false) {
  console.log(chalk.blue.bold('🧪 Starting Direct Storage Tests'));
  console.log(chalk.blue('=================================\n'));
  
  let passCount = 0;
  let failCount = 0;
  
  for (const test of testList) {
    if (test.warning && !runAdvanced) {
      console.log(chalk.yellow(`Skipping ${test.name} (advanced test)`));
      continue;
    }
    
    console.log(chalk.cyan(`Testing: ${test.name}`));
    
    if (test.warning) {
      console.log(chalk.yellow(`⚠️  Warning: ${test.warning}`));
    }
    
    try {
      const result = await test.func();
      
      // Validate result
      if (test.validate) {
        if (!test.validate(result)) {
          throw new Error('Custom validation failed');
        }
      } 
      else if (test.isArray) {
        if (!Array.isArray(result)) {
          throw new Error(`Expected array result, got ${typeof result}`);
        }
        
        if (result.length > 0 && test.itemProps) {
          for (const prop of test.itemProps) {
            if (!(prop in result[0])) {
              throw new Error(`Expected property '${prop}' missing in array item`);
            }
          }
        }
        
        console.log(chalk.green(`  ✓ Received array with ${result.length} items`));
      }
      else if (test.expectedProps) {
        for (const prop of test.expectedProps) {
          if (!(prop in result)) {
            throw new Error(`Expected property '${prop}' missing in result`);
          }
        }
        
        console.log(chalk.green(`  ✓ Result contains all expected properties`));
      }
      
      // Log result
      if (test.customSuccessMessage) {
        console.log(chalk.green(`  ${test.customSuccessMessage(result)}`));
      } else {
        const preview = JSON.stringify(result).substring(0, 100) + 
          (JSON.stringify(result).length > 100 ? '...' : '');
        console.log(chalk.gray(`  Result: ${preview}`));
      }
      
      console.log(chalk.green.bold(`  ✓ TEST PASSED`));
      passCount++;
    } catch (error) {
      console.log(chalk.red(`  ✗ ERROR: ${error.message}`));
      console.log(chalk.red.bold(`  ✗ TEST FAILED`));
      failCount++;
    }
    
    console.log(''); // Add a blank line between tests
  }
  
  // Summary
  console.log(chalk.blue('================================='));
  console.log(chalk.blue.bold(`📊 Test Summary:`));
  console.log(chalk.green(`  ✓ Passed: ${passCount}`));
  console.log(chalk.red(`  ✗ Failed: ${failCount}`));
  console.log(chalk.blue(`  Total: ${passCount + failCount}`));
  
  if (!runAdvanced) {
    console.log(chalk.yellow(`\n⚠️  Advanced tests were skipped. Run with --advanced flag to include all tests.`));
  }
}

// Check database connection before running tests
async function checkDbConnection() {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    console.log(chalk.green('✓ Database connection successful'));
    
    return true;
  } catch (err) {
    console.error(chalk.red(`✗ Database connection error: ${err.message}`));
    console.error(chalk.yellow('Make sure your DATABASE_URL environment variable is set correctly.'));
    return false;
  }
}

// Main function
async function main() {
  // Check for command line flags
  const runAdvanced = process.argv.includes('--advanced');
  const testUserId = process.argv.find(arg => arg.startsWith('--user='));
  
  if (testUserId) {
    const userId = parseInt(testUserId.split('=')[1]);
    if (!isNaN(userId)) {
      TEST_USER_ID = userId;
    }
  }
  
  console.log(chalk.cyan(`Using test user ID: ${TEST_USER_ID}`));
  
  if (runAdvanced) {
    console.log(chalk.yellow('Running in advanced mode - all tests will be executed'));
  }
  
  // Check DB connection
  const dbConnected = await checkDbConnection();
  
  if (!dbConnected) {
    console.log(chalk.red('Exiting due to database connection failure'));
    process.exit(1);
  }
  
  // All tests 
  const allTests = [...tests, ...(runAdvanced ? advancedTests : [])];
  
  // Run the tests
  await runTests(allTests, runAdvanced);
}

// Run the main function
main().catch(err => {
  console.error(chalk.red('Test execution error:'), err);
});