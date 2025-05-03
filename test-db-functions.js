/**
 * Direct Database Test Utility for Engagement Engine
 * 
 * This script tests the database functionality directly without importing the storage layer
 * This avoids the complications with TypeScript ESM imports
 * 
 * Run with: node test-db-functions.js
 */

import 'dotenv/config'; // Load environment variables
import pkg from 'pg';
const { Pool } = pkg;
import chalk from 'chalk'; // For colored output

// Configuration
const TEST_USER_ID = 1; // Admin User

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Check database connection
async function checkDbConnection() {
  try {
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

// Functions that mimic the storage.ts methods but work directly with SQL
async function getUserEngagement(userId) {
  try {
    const result = await pool.query(`
      SELECT * FROM user_engagement WHERE user_id = $1
    `, [userId]);
    
    if (result.rows.length === 0) {
      // Create user engagement entry if it doesn't exist
      const insertResult = await pool.query(`
        INSERT INTO user_engagement (user_id, current_streak, longest_streak, total_points, level)
        VALUES ($1, 0, 0, 0, 1)
        RETURNING *
      `, [userId]);
      
      return insertResult.rows[0];
    }
    
    return result.rows[0];
  } catch (err) {
    console.error(chalk.red(`Error in getUserEngagement: ${err.message}`));
    throw err;
  }
}

async function getStreak(userId) {
  try {
    const userEngagement = await getUserEngagement(userId);
    return userEngagement.current_streak;
  } catch (err) {
    console.error(chalk.red(`Error in getStreak: ${err.message}`));
    throw err;
  }
}

async function recordUserActivity(userId, activityType, activityData, pointsEarned) {
  try {
    const result = await pool.query(`
      INSERT INTO user_activities (user_id, type, data, points_earned)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [userId, activityType, activityData, pointsEarned]);
    
    // Also update user's total points
    await pool.query(`
      UPDATE user_engagement 
      SET total_points = total_points + $1
      WHERE user_id = $2
    `, [pointsEarned, userId]);
    
    return result.rows[0];
  } catch (err) {
    console.error(chalk.red(`Error in recordUserActivity: ${err.message}`));
    throw err;
  }
}

async function getUserActivities(userId, limit = 10) {
  try {
    const result = await pool.query(`
      SELECT * FROM user_activities
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `, [userId, limit]);
    
    return result.rows;
  } catch (err) {
    console.error(chalk.red(`Error in getUserActivities: ${err.message}`));
    throw err;
  }
}

async function getUserAchievements(userId) {
  try {
    const result = await pool.query(`
      SELECT * FROM user_achievements
      WHERE user_id = $1
      ORDER BY unlocked_at DESC
    `, [userId]);
    
    return result.rows;
  } catch (err) {
    console.error(chalk.red(`Error in getUserAchievements: ${err.message}`));
    throw err;
  }
}

async function addUserAchievement(achievementData) {
  try {
    const result = await pool.query(`
      INSERT INTO user_achievements (
        user_id, achievement_id, type, name, description, points
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      achievementData.userId,
      achievementData.achievementId,
      achievementData.achievementType,
      achievementData.achievementName,
      achievementData.achievementDescription,
      achievementData.points
    ]);
    
    // Also update user's total points
    await pool.query(`
      UPDATE user_engagement 
      SET total_points = total_points + $1
      WHERE user_id = $2
    `, [achievementData.points, achievementData.userId]);
    
    return result.rows[0];
  } catch (err) {
    console.error(chalk.red(`Error in addUserAchievement: ${err.message}`));
    throw err;
  }
}

async function checkInUser(userId) {
  try {
    // Get current user engagement data
    const userEngagement = await getUserEngagement(userId);
    
    // Check if last check-in was today
    const now = new Date();
    const lastCheckIn = userEngagement.last_check_in ? new Date(userEngagement.last_check_in) : null;
    
    // If last check-in was not today, increment streak
    let newStreak = userEngagement.current_streak;
    if (!lastCheckIn || !isSameDay(lastCheckIn, now)) {
      newStreak += 1;
    }
    
    // Update the longest streak if needed
    const longestStreak = Math.max(newStreak, userEngagement.longest_streak);
    
    // Update the user engagement record
    const result = await pool.query(`
      UPDATE user_engagement
      SET 
        current_streak = $1,
        longest_streak = $2,
        last_check_in = NOW(),
        streak_updated_at = NOW(),
        total_points = total_points + 5
      WHERE user_id = $3
      RETURNING *
    `, [newStreak, longestStreak, userId]);
    
    // Record the check-in activity
    await recordUserActivity(userId, 'check_in', { source: 'daily_check_in' }, 5);
    
    return result.rows[0];
  } catch (err) {
    console.error(chalk.red(`Error in checkInUser: ${err.message}`));
    throw err;
  }
}

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

// Tests definition
const tests = [
  {
    name: 'getUserEngagement',
    func: async () => await getUserEngagement(TEST_USER_ID),
    expectedProps: ['id', 'user_id', 'current_streak', 'total_points', 'level']
  },
  {
    name: 'getStreak',
    func: async () => await getStreak(TEST_USER_ID),
    validate: (result) => typeof result === 'number',
    customSuccessMessage: (result) => `User has a streak of ${result} days`
  },
  {
    name: 'recordUserActivity',
    func: async () => await recordUserActivity(
      TEST_USER_ID, 
      'test_activity', 
      { source: 'direct_test', timestamp: new Date().toISOString() }, 
      1
    ),
    expectedProps: ['id', 'user_id', 'type', 'data', 'points_earned', 'timestamp']
  },
  {
    name: 'getUserActivities',
    func: async () => await getUserActivities(TEST_USER_ID, 5),
    isArray: true,
    itemProps: ['id', 'user_id', 'type', 'points_earned', 'timestamp']
  },
  {
    name: 'getUserAchievements',
    func: async () => await getUserAchievements(TEST_USER_ID),
    isArray: true,
    itemProps: ['id', 'user_id', 'achievement_id', 'type', 'name']
  },
];

// Advanced tests
const advancedTests = [
  {
    name: 'addUserAchievement',
    func: async () => await addUserAchievement({
      userId: TEST_USER_ID,
      achievementId: 'test_achievement_' + Date.now(),
      achievementName: 'Test Achievement',
      achievementDescription: 'Created during direct DB testing',
      achievementType: 'test',
      points: 1
    }),
    expectedProps: ['id', 'user_id', 'achievement_id', 'name', 'description', 'points'],
    warning: 'This will add a new achievement to the user record'
  },
  {
    name: 'checkInUser',
    func: async () => await checkInUser(TEST_USER_ID),
    expectedProps: ['id', 'user_id', 'current_streak', 'last_check_in', 'total_points'],
    warning: 'This will perform a daily check-in and may advance the user streak'
  }
];

// Test runner
async function runTests(testList, runAdvanced = false) {
  console.log(chalk.blue.bold('🧪 Starting Direct Database Function Tests'));
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
  
  // Close the pool
  await pool.end();
}

// Run the main function
main().catch(err => {
  console.error(chalk.red('Test execution error:'), err);
  pool.end();
});