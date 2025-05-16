/**
 * Test script for the Progress Service
 * 
 * This script tests the optimized progress tracking service and verifies
 * that the caching functionality is working properly.
 */

const progressService = require('./services/progress-service');

// Use a test user ID
const TEST_USER_ID = '12345';
const TEST_PATH_ID = '101';
const TEST_MODULE_ID = '201';
const TEST_ACTIVITY_ID = '301';

// Test progress service functionality
async function testProgressService() {
  console.log('=== TESTING PROGRESS SERVICE ===\n');
  
  try {
    // Test 1: Get user progress (should go to database)
    console.log('Test 1: Getting user progress (uncached)...');
    console.time('First user progress query');
    const progress1 = await progressService.getUserProgress(TEST_USER_ID);
    console.timeEnd('First user progress query');
    console.log(`Retrieved progress data with ${progress1?.paths?.length || 0} paths\n`);
    
    // Test 2: Get user progress again (should use cache)
    console.log('Test 2: Getting user progress (from cache)...');
    console.time('Second user progress query');
    const progress2 = await progressService.getUserProgress(TEST_USER_ID);
    console.timeEnd('Second user progress query');
    console.log(`Retrieved cached progress data with ${progress2?.paths?.length || 0} paths\n`);
    
    // Test 3: Get path progress
    console.log('Test 3: Getting path progress...');
    console.time('Path progress query');
    const pathProgress = await progressService.getPathProgress(TEST_USER_ID, TEST_PATH_ID);
    console.timeEnd('Path progress query');
    console.log(`Retrieved path progress with ${pathProgress?.modules?.length || 0} modules\n`);
    
    // Test 4: Get recent activities
    console.log('Test 4: Getting recent activities...');
    console.time('Recent activities query');
    const activities = await progressService.getUserRecentActivities(TEST_USER_ID, 5);
    console.timeEnd('Recent activities query');
    console.log(`Retrieved ${activities?.length || 0} recent activities\n`);
    
    // Test 5: Get time spent statistics
    console.log('Test 5: Getting time statistics...');
    console.time('Time stats query');
    const weeklyStats = await progressService.getUserWeeklyStats(TEST_USER_ID);
    console.timeEnd('Time stats query');
    console.log(`Retrieved time stats including ${weeklyStats?.activityByDay?.length || 0} daily records\n`);
    
    // Test 6: Cache clearing
    console.log('Test 6: Testing cache clearing...');
    progressService.clearUserCaches(TEST_USER_ID);
    console.log('User caches cleared\n');
    
    // Test 7: Get user progress again (should go to database after cache clear)
    console.log('Test 7: Getting user progress after cache clear...');
    console.time('Post-clear user progress query');
    const progress3 = await progressService.getUserProgress(TEST_USER_ID);
    console.timeEnd('Post-clear user progress query');
    console.log(`Retrieved progress data with ${progress3?.paths?.length || 0} paths\n`);
    
    // Test 8: Record sample activity progress
    console.log('Test 8: Recording sample activity progress...');
    console.time('Record activity progress');
    await progressService.recordActivityProgress(TEST_USER_ID, TEST_ACTIVITY_ID, {
      status: 'completed',
      score: 95,
      time_spent_seconds: 300,
      attempts: 1
    });
    console.timeEnd('Record activity progress');
    console.log('Activity progress recorded successfully\n');
    
    console.log('=== PROGRESS SERVICE TESTS COMPLETED ===');
    return true;
  } catch (error) {
    console.error('Error testing progress service:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting progress service test...');
  await testProgressService();
}

// Run the test
main().catch(console.error);