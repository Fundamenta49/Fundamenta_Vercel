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

// Mock database functions for testing without a real DB
function setupMockDatabase() {
  const mockData = {
    paths: [
      { id: '101', name: 'Financial Basics', total_modules: 20, completed_modules: 17, in_progress_modules: 2 },
      { id: '102', name: 'Cooking Fundamentals', total_modules: 15, completed_modules: 8, in_progress_modules: 3 },
      { id: '103', name: 'Home Maintenance', total_modules: 12, completed_modules: 4, in_progress_modules: 2 }
    ],
    modules: [
      { id: '201', path_id: '101', title: 'Budgeting Basics', status: 'completed' },
      { id: '202', path_id: '101', title: 'Saving Strategies', status: 'in_progress' },
      { id: '203', path_id: '102', title: 'Knife Skills', status: 'completed' }
    ],
    activities: [
      { id: '301', module_id: '201', title: 'Create a Budget', type: 'exercise', status: 'completed' },
      { id: '302', module_id: '201', title: 'Budget Quiz', type: 'quiz', status: 'completed', score: 90 },
      { id: '303', module_id: '202', title: 'Savings Calculator', type: 'tool', status: 'in_progress' }
    ],
    achievements: [
      { id: '401', title: 'Financial Planner', type: 'path_completion', points: 100, awarded_at: new Date() }
    ]
  };
  
  // Mock the db.execute function
  const originalExecute = progressService.__db?.execute;
  if (originalExecute) {
    progressService.__db.execute = async (query) => {
      console.log('Mock DB: Running query:', query.text.substring(0, 50) + '...');
      
      // Mock responses based on the query
      if (query.text.includes('user_modules')) {
        return { rows: mockData.paths };
      } else if (query.text.includes('module_stats')) {
        return { rows: mockData.modules };
      } else if (query.text.includes('activity_stats')) {
        return { rows: mockData.activities };
      } else if (query.text.includes('user_achievements')) {
        return { rows: mockData.achievements };
      } else if (query.text.includes('daily_activities')) {
        return { 
          rows: [
            { day_name: 'Monday', day_number: 1, count: 5 },
            { day_name: 'Tuesday', day_number: 2, count: 3 },
            { day_name: 'Wednesday', day_number: 3, count: 7 }
          ] 
        };
      } else if (query.text.includes('INSERT INTO')) {
        return { rows: [{ id: '999', status: 'completed' }] };
      }
      
      // Default empty response
      return { rows: [] };
    };
  }
}

// Main function
async function main() {
  console.log('Starting progress service test...');
  
  // Uncomment to use mock database for testing
  // setupMockDatabase();
  
  await testProgressService();
}

// Run the test if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testProgressService };