// Calendar Test Runner
// This script tests the calendar functionality independently of the UI

// Try to mock browser environment for localStorage
globalThis.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key];
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  }
};

// Enable admin bypass
localStorage.setItem('admin_bypass', 'enabled');

// Implement a simplified version of the calendar service for testing
// Similar to the implementation in client/src/services/calendar-service.ts

// Simple UUID generator without external dependencies
function generateUniqueId() {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(16);
  });
}

// Mock calendar service
const calendarService = {
  events: [],
  
  // Get all events
  getEvents() {
    return this.events;
  },
  
  // Add a new event
  addEvent(eventData) {
    try {
      // Create new event with ID
      const newEvent = {
        ...eventData,
        id: generateUniqueId(),
      };
      
      // Add to collection
      this.events.push(newEvent);
      
      return newEvent;
    } catch (error) {
      console.error('Error adding calendar event:', error);
      throw error;
    }
  },
  
  // Update an existing event
  updateEvent(eventData) {
    try {
      if (!eventData.id) {
        throw new Error('Cannot update event without ID');
      }
      
      const index = this.events.findIndex(e => e.id === eventData.id);
      
      if (index === -1) {
        throw new Error(`Event with ID ${eventData.id} not found`);
      }
      
      // Update the event
      const updatedEvent = {
        ...eventData,
        id: eventData.id,
      };
      
      this.events[index] = updatedEvent;
      
      return updatedEvent;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      return null;
    }
  },
  
  // Delete an event
  deleteEvent(eventId) {
    try {
      const initialLength = this.events.length;
      this.events = this.events.filter(event => event.id !== eventId);
      
      return this.events.length < initialLength;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return false;
    }
  }
};

// Function to run quick test
function runQuickTest() {
  console.log('Running quick calendar test...');
  
  // Create a test event
  const testEvent = {
    title: 'Test Event',
    date: new Date(),
    startTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    category: 'work',
    description: 'Test description'
  };
  
  console.log('Creating event:', testEvent);
  const createdEvent = calendarService.addEvent(testEvent);
  
  if (!createdEvent || !createdEvent.id) {
    console.error('Failed to create event!');
    return false;
  }
  
  console.log('Event created successfully:', createdEvent);
  
  // Update the event
  const updatedEventData = {
    ...createdEvent,
    title: 'Updated Test Event',
    description: 'Updated description'
  };
  
  console.log('Updating event:', updatedEventData);
  const updatedEvent = calendarService.updateEvent(updatedEventData);
  
  if (!updatedEvent) {
    console.error('Failed to update event!');
    return false;
  }
  
  console.log('Event updated successfully:', updatedEvent);
  
  // Delete the event
  console.log('Deleting event:', createdEvent.id);
  const deleteResult = calendarService.deleteEvent(createdEvent.id);
  
  if (!deleteResult) {
    console.error('Failed to delete event!');
    return false;
  }
  
  console.log('Event deleted successfully');
  return true;
}

// Function to run a full stress test (creating multiple events)
function runFullStressTest(eventCount = 20) {
  console.log(`Running stress test with ${eventCount} events...`);
  
  // Track metrics
  const metrics = {
    created: 0,
    updated: 0,
    deleted: 0,
    errors: 0,
    startTime: Date.now()
  };
  
  // Generate random events
  const events = [];
  for (let i = 0; i < eventCount; i++) {
    try {
      // Create event with random properties
      const event = {
        title: `Test Event ${i}`,
        date: new Date(),
        startTime: new Date(Date.now() + (Math.random() * 48) * 60 * 60 * 1000), // Random time in next 48 hours
        endTime: new Date(Date.now() + (Math.random() * 48 + 1) * 60 * 60 * 1000), // Random end time after start
        category: ['work', 'personal', 'family', 'health', 'finance'][Math.floor(Math.random() * 5)], // Random category
        description: `This is test event ${i} created during stress test`
      };
      
      // Add the event
      const createdEvent = calendarService.addEvent(event);
      if (createdEvent && createdEvent.id) {
        events.push(createdEvent);
        metrics.created++;
      } else {
        metrics.errors++;
      }
    } catch (error) {
      console.error(`Error creating event ${i}:`, error);
      metrics.errors++;
    }
  }
  
  console.log(`Successfully created ${metrics.created}/${eventCount} events`);
  
  // Update half of the events
  const eventsToUpdate = events.slice(0, Math.floor(events.length / 2));
  console.log(`Updating ${eventsToUpdate.length} events...`);
  
  for (const event of eventsToUpdate) {
    try {
      const updatedEventData = {
        ...event,
        title: `UPDATED: ${event.title}`,
        description: `Updated description for ${event.title}`
      };
      
      const updatedEvent = calendarService.updateEvent(updatedEventData);
      if (updatedEvent) {
        metrics.updated++;
      } else {
        metrics.errors++;
      }
    } catch (error) {
      console.error(`Error updating event ${event.id}:`, error);
      metrics.errors++;
    }
  }
  
  console.log(`Successfully updated ${metrics.updated}/${eventsToUpdate.length} events`);
  
  // Delete 25% of the events
  const eventsToDelete = events.slice(Math.floor(events.length / 2), Math.floor(events.length * 0.75));
  console.log(`Deleting ${eventsToDelete.length} events...`);
  
  for (const event of eventsToDelete) {
    try {
      const deleteResult = calendarService.deleteEvent(event.id);
      if (deleteResult) {
        metrics.deleted++;
      } else {
        metrics.errors++;
      }
    } catch (error) {
      console.error(`Error deleting event ${event.id}:`, error);
      metrics.errors++;
    }
  }
  
  console.log(`Successfully deleted ${metrics.deleted}/${eventsToDelete.length} events`);
  
  // Calculate test duration
  metrics.duration = (Date.now() - metrics.startTime) / 1000; // in seconds
  
  // Calculate success rates
  const creationSuccessRate = eventCount > 0 ? (metrics.created / eventCount) * 100 : 0;
  const updateSuccessRate = eventsToUpdate.length > 0 ? (metrics.updated / eventsToUpdate.length) * 100 : 0;
  const deleteSuccessRate = eventsToDelete.length > 0 ? (metrics.deleted / eventsToDelete.length) * 100 : 0;
  
  // Display detailed metrics
  console.log('\nStress Test Results:');
  console.log(`Created: ${metrics.created}/${eventCount} (${creationSuccessRate.toFixed(1)}%)`);
  console.log(`Updated: ${metrics.updated}/${eventsToUpdate.length} (${updateSuccessRate.toFixed(1)}%)`);
  console.log(`Deleted: ${metrics.deleted}/${eventsToDelete.length} (${deleteSuccessRate.toFixed(1)}%)`);
  console.log(`Errors: ${metrics.errors}`);
  console.log(`Duration: ${metrics.duration.toFixed(3)} seconds`);
  
  // Overall success is determined by high success rates for all operations
  const isSuccessful = creationSuccessRate > 90 && updateSuccessRate > 90 && deleteSuccessRate > 90;
  
  return {
    successful: isSuccessful,
    metrics
  };
}

// Function to test notification generation
function testNotifications() {
  console.log('Testing calendar notification generation...');
  
  // Track created events
  const events = [];
  
  try {
    // Create event starting in 15 minutes (should trigger notification)
    const event1 = {
      title: 'Test: 15min Notification',
      date: new Date(),
      startTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      endTime: new Date(Date.now() + 75 * 60 * 1000),   // 1h15m from now
      category: 'work',
      description: 'This event should trigger a 15-minute notification'
    };
    
    const saved1 = calendarService.addEvent(event1);
    if (saved1) events.push(saved1);
    
    // Create event starting in 1 hour (should trigger notification)
    const event2 = {
      title: 'Test: 1hr Notification',
      date: new Date(),
      startTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      endTime: new Date(Date.now() + 120 * 60 * 1000),  // 2 hours from now
      category: 'personal',
      description: 'This event should trigger a 1-hour notification'
    };
    
    const saved2 = calendarService.addEvent(event2);
    if (saved2) events.push(saved2);
    
    // Create event that already passed (should not trigger notification)
    const event3 = {
      title: 'Test: Past Event',
      date: new Date(),
      startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      endTime: new Date(Date.now() - 30 * 60 * 1000),   // 30 minutes ago
      category: 'health',
      description: 'This event should not trigger any notifications'
    };
    
    const saved3 = calendarService.addEvent(event3);
    if (saved3) events.push(saved3);
    
    console.log(`Created ${events.length} notification test events`);
    
    // Check which events should trigger notifications
    const now = new Date();
    const upcomingEvents = calendarService.getEvents().filter(event => {
      if (!event.startTime) return false;
      
      const startTime = new Date(event.startTime);
      const timeDiff = (startTime.getTime() - now.getTime()) / (60 * 1000); // difference in minutes
      
      // Check if event is in the upcoming notification windows (15min or 1hr)
      return (timeDiff > 0 && timeDiff <= 15) || (timeDiff > 0 && timeDiff <= 60);
    });
    
    console.log(`Found ${upcomingEvents.length} events that should trigger notifications:`);
    upcomingEvents.forEach(event => {
      const startTime = new Date(event.startTime);
      const timeDiff = (startTime.getTime() - now.getTime()) / (60 * 1000); // difference in minutes
      console.log(`- ${event.title} (starts in ${Math.round(timeDiff)} minutes)`);
    });
    
    return {
      successful: upcomingEvents.length === 2, // Should find the 15min and 1hr events
      events: upcomingEvents
    };
    
  } catch (error) {
    console.error('Error in notification test:', error);
    return {
      successful: false,
      error: error.message
    };
  }
}

// Run all tests
try {
  console.log('========================');
  console.log('Starting calendar tests');
  console.log('========================\n');
  
  // Run quick test
  console.log('\n--- Quick Test ---');
  const quickTestResult = runQuickTest();
  console.log(`Quick test result: ${quickTestResult ? 'PASS' : 'FAIL'}`);
  
  // Run stress test
  console.log('\n--- Stress Test ---');
  const stressTestResult = runFullStressTest(10);
  console.log(`Stress test result: ${stressTestResult.successful ? 'PASS' : 'FAIL'}`);
  
  // Run notification test
  console.log('\n--- Notification Test ---');
  const notificationTestResult = testNotifications();
  console.log(`Notification test result: ${notificationTestResult.successful ? 'PASS' : 'FAIL'}`);
  
  // Overall test results
  console.log('\n========================');
  console.log('Calendar Test Summary');
  console.log('========================');
  console.log(`Quick Test: ${quickTestResult ? 'PASS' : 'FAIL'}`);
  console.log(`Stress Test: ${stressTestResult.successful ? 'PASS' : 'FAIL'}`);
  console.log(`Notification Test: ${notificationTestResult.successful ? 'PASS' : 'FAIL'}`);
  console.log(`Overall Result: ${quickTestResult && stressTestResult.successful && notificationTestResult.successful ? 'PASS' : 'FAIL'}`);
  console.log('========================');
} catch (error) {
  console.error('Test suite failed with error:', error);
}