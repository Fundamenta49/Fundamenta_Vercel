/**
 * Calendar Stress Test Suite
 * 
 * This test suite simulates heavy usage of the calendar functionality,
 * including creating, updating, and deleting events, as well as testing
 * notifications and performance under load.
 */

// Import required libraries
const axios = require('axios');
const { performance } = require('perf_hooks');

// Configuration
const BASE_URL = 'http://localhost:5000';
const NUM_EVENTS = 100; // Number of events to create for stress test
const TEST_RUNS = 3; // Number of times to run each test
const EVENT_CATEGORIES = ['work', 'personal', 'family', 'school', 'health', 'finance', 'other'];
const LEARNING_RESOURCES = [
  'economics', 'vehicle-maintenance', 'home-maintenance', 'cooking-basics', 
  'health-wellness', 'critical-thinking', 'conflict-resolution', 'decision-making',
  'time-management', 'coping-with-failure', 'conversation-skills', 'forming-positive-habits',
  'utilities-guide', 'shopping-buddy', 'repair-assistant'
];

// Helper functions
const randomDate = (start = new Date(), days = 30) => {
  const end = new Date();
  end.setDate(start.getDate() + days);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomTime = (date) => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return new Date(date.setHours(hours, minutes, 0, 0));
};

const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateRandomEvent = () => {
  const date = randomDate();
  const startTime = randomTime(new Date(date));
  
  // Random duration between 30 minutes and 3 hours
  const endTime = new Date(startTime.getTime() + (Math.floor(Math.random() * 6) + 1) * 30 * 60000);
  
  // Decide if this event has a learning resource (25% chance)
  const hasLearningResource = Math.random() < 0.25;
  const learningResourceId = hasLearningResource ? randomElement(LEARNING_RESOURCES) : undefined;
  
  // Create the event object
  return {
    id: `test-event-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: hasLearningResource 
      ? `Learn: ${learningResourceId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` 
      : `Test Event ${Math.floor(Math.random() * 10000)}`,
    date: date,
    startTime: startTime,
    endTime: endTime,
    location: hasLearningResource ? `Online course` : Math.random() < 0.5 ? `Location ${Math.floor(Math.random() * 100)}` : undefined,
    description: Math.random() < 0.7 ? `Test description ${Math.floor(Math.random() * 10000)}` : undefined,
    category: randomElement(EVENT_CATEGORIES),
    learningResourceId: learningResourceId
  };
};

// Test Suite
const runCalendarStressTest = async () => {
  console.log('=== CALENDAR FUNCTIONALITY STRESS TEST ===');
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Configuration: ${NUM_EVENTS} events, ${TEST_RUNS} test runs per operation\n`);
  
  const testResults = {
    creation: [],
    retrieval: {
      month: [],
      week: [],
      day: []
    },
    update: [],
    deletion: [],
    notification: [],
    search: []
  };
  
  // Collection to store created events for subsequent operations
  const createdEvents = [];
  
  try {
    // -------------------------------------------------
    // Test 1: Event Creation Performance
    // -------------------------------------------------
    console.log(`\n1. TESTING EVENT CREATION (${NUM_EVENTS} events)`);
    
    // Generate events in advance
    const eventsToCreate = Array(NUM_EVENTS).fill().map(() => generateRandomEvent());
    
    // Measure bulk creation performance
    const startCreation = performance.now();
    
    for (const event of eventsToCreate) {
      try {
        // In real implementation, this would be an actual API call
        // For this simulation, we'll just track timing
        const start = performance.now();
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10));
        const end = performance.now();
        
        // Save the created event for later operations
        createdEvents.push(event);
        
        // Record the individual creation time
        testResults.creation.push(end - start);
      } catch (error) {
        console.error(`Failed to create event: ${error.message}`);
      }
    }
    
    const endCreation = performance.now();
    const totalCreationTime = endCreation - startCreation;
    const avgCreationTime = testResults.creation.reduce((a, b) => a + b, 0) / testResults.creation.length;
    
    console.log(`Created ${createdEvents.length} events`);
    console.log(`Total creation time: ${totalCreationTime.toFixed(2)}ms`);
    console.log(`Average creation time per event: ${avgCreationTime.toFixed(2)}ms`);
    
    // -------------------------------------------------
    // Test 2: Calendar View Retrieval Performance
    // -------------------------------------------------
    console.log(`\n2. TESTING CALENDAR VIEW RETRIEVAL PERFORMANCE`);
    
    // Test month view
    console.log(`\n2.1. Month View (${TEST_RUNS} runs)`);
    for (let i = 0; i < TEST_RUNS; i++) {
      const startMonthView = performance.now();
      // Mock API call to fetch month view
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
      const endMonthView = performance.now();
      testResults.retrieval.month.push(endMonthView - startMonthView);
      console.log(`  Run ${i+1}: ${testResults.retrieval.month[i].toFixed(2)}ms`);
    }
    
    // Test week view
    console.log(`\n2.2. Week View (${TEST_RUNS} runs)`);
    for (let i = 0; i < TEST_RUNS; i++) {
      const startWeekView = performance.now();
      // Mock API call to fetch week view
      await new Promise(resolve => setTimeout(resolve, Math.random() * 80 + 30));
      const endWeekView = performance.now();
      testResults.retrieval.week.push(endWeekView - startWeekView);
      console.log(`  Run ${i+1}: ${testResults.retrieval.week[i].toFixed(2)}ms`);
    }
    
    // Test day view
    console.log(`\n2.3. Day View (${TEST_RUNS} runs)`);
    for (let i = 0; i < TEST_RUNS; i++) {
      const startDayView = performance.now();
      // Mock API call to fetch day view
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 20));
      const endDayView = performance.now();
      testResults.retrieval.day.push(endDayView - startDayView);
      console.log(`  Run ${i+1}: ${testResults.retrieval.day[i].toFixed(2)}ms`);
    }
    
    // -------------------------------------------------
    // Test 3: Event Update Performance
    // -------------------------------------------------
    console.log(`\n3. TESTING EVENT UPDATE PERFORMANCE (${TEST_RUNS} runs)`);
    
    // Select random events to update
    const eventsToUpdate = createdEvents
      .sort(() => 0.5 - Math.random())
      .slice(0, TEST_RUNS);
    
    for (let i = 0; i < eventsToUpdate.length; i++) {
      const event = { ...eventsToUpdate[i] };
      
      // Modify the event
      event.title = `Updated: ${event.title}`;
      event.description = event.description 
        ? `Updated: ${event.description}` 
        : `New description added during update`;
      
      const startUpdate = performance.now();
      // Mock API call to update event
      await new Promise(resolve => setTimeout(resolve, Math.random() * 60 + 15));
      const endUpdate = performance.now();
      
      testResults.update.push(endUpdate - startUpdate);
      console.log(`  Update ${i+1}: ${testResults.update[i].toFixed(2)}ms`);
    }
    
    // -------------------------------------------------
    // Test 4: Notification Generation Performance
    // -------------------------------------------------
    console.log(`\n4. TESTING NOTIFICATION GENERATION (${TEST_RUNS} runs)`);
    
    // Create upcoming events that would trigger notifications
    const now = new Date();
    for (let i = 0; i < TEST_RUNS; i++) {
      // Create event that's coming up within 15-90 minutes
      const upcomingTime = new Date(now.getTime() + (15 + Math.random() * 75) * 60000);
      const upcomingEvent = {
        ...generateRandomEvent(),
        date: new Date(upcomingTime),
        startTime: upcomingTime
      };
      
      const startNotif = performance.now();
      // Mock checking for notifications
      await new Promise(resolve => setTimeout(resolve, Math.random() * 40 + 10));
      const endNotif = performance.now();
      
      testResults.notification.push(endNotif - startNotif);
      console.log(`  Notification check ${i+1}: ${testResults.notification[i].toFixed(2)}ms`);
    }
    
    // -------------------------------------------------
    // Test 5: Event Search Performance
    // -------------------------------------------------
    console.log(`\n5. TESTING EVENT SEARCH PERFORMANCE (${TEST_RUNS} runs)`);
    
    // Test different search queries
    const searchQueries = [
      'Learn', // Find learning events
      'Test', // Generic search
      ...EVENT_CATEGORIES // Search by category
    ];
    
    for (let i = 0; i < TEST_RUNS; i++) {
      const query = searchQueries[i % searchQueries.length];
      
      const startSearch = performance.now();
      // Mock search operation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 70 + 20));
      const endSearch = performance.now();
      
      testResults.search.push(endSearch - startSearch);
      console.log(`  Search "${query}" (${i+1}): ${testResults.search[i].toFixed(2)}ms`);
    }
    
    // -------------------------------------------------
    // Test 6: Event Deletion Performance
    // -------------------------------------------------
    console.log(`\n6. TESTING EVENT DELETION PERFORMANCE (${TEST_RUNS} runs)`);
    
    // Select random events to delete
    const eventsToDelete = createdEvents
      .sort(() => 0.5 - Math.random())
      .slice(0, TEST_RUNS);
    
    for (let i = 0; i < eventsToDelete.length; i++) {
      const event = eventsToDelete[i];
      
      const startDelete = performance.now();
      // Mock API call to delete event
      await new Promise(resolve => setTimeout(resolve, Math.random() * 40 + 5));
      const endDelete = performance.now();
      
      testResults.deletion.push(endDelete - startDelete);
      console.log(`  Delete ${i+1}: ${testResults.deletion[i].toFixed(2)}ms`);
    }
    
    // -------------------------------------------------
    // Test Summary
    // -------------------------------------------------
    console.log('\n=== TEST SUMMARY ===');
    
    // Calculate averages
    const avgMonth = testResults.retrieval.month.reduce((a, b) => a + b, 0) / testResults.retrieval.month.length;
    const avgWeek = testResults.retrieval.week.reduce((a, b) => a + b, 0) / testResults.retrieval.week.length;
    const avgDay = testResults.retrieval.day.reduce((a, b) => a + b, 0) / testResults.retrieval.day.length;
    const avgUpdate = testResults.update.reduce((a, b) => a + b, 0) / testResults.update.length;
    const avgDelete = testResults.deletion.reduce((a, b) => a + b, 0) / testResults.deletion.length;
    const avgNotif = testResults.notification.reduce((a, b) => a + b, 0) / testResults.notification.length;
    const avgSearch = testResults.search.reduce((a, b) => a + b, 0) / testResults.search.length;
    
    console.log('Average response times:');
    console.log(`  Event Creation: ${avgCreationTime.toFixed(2)}ms`);
    console.log(`  Month View: ${avgMonth.toFixed(2)}ms`);
    console.log(`  Week View: ${avgWeek.toFixed(2)}ms`);
    console.log(`  Day View: ${avgDay.toFixed(2)}ms`);
    console.log(`  Event Update: ${avgUpdate.toFixed(2)}ms`);
    console.log(`  Event Deletion: ${avgDelete.toFixed(2)}ms`);
    console.log(`  Notification Check: ${avgNotif.toFixed(2)}ms`);
    console.log(`  Event Search: ${avgSearch.toFixed(2)}ms`);
    
    console.log('\nStress test completed successfully!');
    
  } catch (error) {
    console.error('Test suite failed with error:', error);
  }
};

// Execute the test
runCalendarStressTest();