/**
 * Calendar Service Stress Tests
 * 
 * This file contains functions to stress test the calendar service
 * by generating and manipulating a large number of events.
 */

import { EventFormData, EventCategory, LearningResource } from '../components/event-form';
import { addDays, setHours, setMinutes, format, parse } from 'date-fns';
import { toast } from "@/hooks/use-toast";

// Learning resources from the event form component
const LEARNING_RESOURCES: LearningResource[] = [
  { id: 'economics', title: 'Economics Basics', path: '/learning/courses/economics', category: 'finance', duration: 60 },
  { id: 'vehicle-maintenance', title: 'Vehicle Maintenance', path: '/learning/courses/vehicle-maintenance', category: 'personal', duration: 45 },
  { id: 'home-maintenance', title: 'Home Maintenance', path: '/learning/courses/home-maintenance', category: 'personal', duration: 50 },
  { id: 'cooking-basics', title: 'Cooking Basics', path: '/learning/courses/cooking-basics', category: 'personal', duration: 40 },
  { id: 'health-wellness', title: 'Health & Wellness', path: '/learning/courses/health-wellness', category: 'health', duration: 30 },
  { id: 'critical-thinking', title: 'Critical Thinking', path: '/learning/courses/critical-thinking', category: 'school', duration: 55 },
  { id: 'conflict-resolution', title: 'Conflict Resolution', path: '/learning/courses/conflict-resolution', category: 'work', duration: 40 },
  { id: 'decision-making', title: 'Decision Making', path: '/learning/courses/decision-making', category: 'work', duration: 45 },
  { id: 'time-management', title: 'Time Management', path: '/learning/courses/time-management', category: 'work', duration: 35 },
  { id: 'coping-with-failure', title: 'Coping with Failure', path: '/learning/courses/coping-with-failure', category: 'personal', duration: 40 },
  { id: 'conversation-skills', title: 'Conversation Skills', path: '/learning/courses/conversation-skills', category: 'personal', duration: 30 },
  { id: 'forming-positive-habits', title: 'Positive Habits', path: '/learning/courses/forming-positive-habits', category: 'health', duration: 45 },
  { id: 'utilities-guide', title: 'Utilities Guide', path: '/learning/courses/utilities-guide', category: 'finance', duration: 30 },
  { id: 'shopping-buddy', title: 'Shopping Buddy', path: '/learning/courses/shopping-buddy', category: 'finance', duration: 25 },
  { id: 'repair-assistant', title: 'Repair Assistant', path: '/learning/courses/repair-assistant', category: 'personal', duration: 35 },
];

// Event categories used in the calendar
const EVENT_CATEGORIES: EventCategory[] = ['work', 'personal', 'family', 'school', 'health', 'finance', 'other'];

/**
 * Generate a random date within the specified range
 */
const randomDate = (start = new Date(), daysRange = 30): Date => {
  const end = addDays(start, daysRange);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Set random time on the given date
 */
const randomTime = (date: Date): Date => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return setMinutes(setHours(new Date(date), hours), minutes);
};

/**
 * Pick a random element from an array
 */
const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Generate a random event for testing
 */
export const generateRandomEvent = (): EventFormData => {
  const date = randomDate();
  const startTime = randomTime(new Date(date));
  
  // Random duration between 30 minutes and 3 hours
  const endTime = new Date(startTime.getTime() + (Math.floor(Math.random() * 6) + 1) * 30 * 60000);
  
  // Decide if this event has a learning resource (25% chance)
  const hasLearningResource = Math.random() < 0.25;
  const learningResource = hasLearningResource ? randomElement(LEARNING_RESOURCES) : null;
  
  // Create the event object
  return {
    id: `test-event-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: hasLearningResource 
      ? `Learn: ${learningResource?.title}` 
      : `Test Event ${Math.floor(Math.random() * 10000)}`,
    date: date,
    startTime: startTime,
    endTime: endTime,
    location: hasLearningResource ? `Online course: ${learningResource?.title}` : Math.random() < 0.5 ? `Location ${Math.floor(Math.random() * 100)}` : undefined,
    description: Math.random() < 0.7 ? `Test description ${Math.floor(Math.random() * 10000)}` : undefined,
    category: learningResource?.category || randomElement(EVENT_CATEGORIES),
    learningResourceId: learningResource?.id
  };
};

/**
 * Generate multiple random events for testing
 */
export const generateRandomEvents = (count: number): EventFormData[] => {
  return Array(count).fill(null).map(() => generateRandomEvent());
};

/**
 * Function to run stress test on the calendar
 * @param {Function} saveEvent - Function to save an event
 * @param {Function} updateEvent - Function to update an event
 * @param {Function} deleteEvent - Function to delete an event
 * @param {number} count - Number of events to generate
 * @returns {Promise<void>}
 */
export const runCalendarStressTest = async (
  saveEvent: (event: EventFormData) => Promise<EventFormData | null>,
  updateEvent: (event: EventFormData) => Promise<EventFormData | null>,
  deleteEvent: (eventId: string) => Promise<boolean>,
  count: number = 20
): Promise<void> => {
  console.time('Calendar Stress Test');
  
  const results = {
    eventsCreated: 0,
    eventsUpdated: 0,
    eventsDeleted: 0,
    errors: {
      creation: 0,
      update: 0,
      deletion: 0
    }
  };
  
  try {
    // Step 1: Create events
    console.log(`Generating ${count} random events...`);
    const events = generateRandomEvents(count);
    
    console.log(`Creating ${count} events in the calendar...`);
    const savedEvents: EventFormData[] = [];
    
    for (const event of events) {
      try {
        const savedEvent = await saveEvent(event);
        if (savedEvent) {
          savedEvents.push(savedEvent);
          results.eventsCreated++;
        }
      } catch (error) {
        console.error('Error creating event:', error);
        results.errors.creation++;
      }
    }
    
    console.log(`Successfully created ${results.eventsCreated} events.`);
    
    // Step 2: Update half of the created events
    const eventsToUpdate = savedEvents.slice(0, Math.floor(savedEvents.length / 2));
    console.log(`Updating ${eventsToUpdate.length} events...`);
    
    for (const event of eventsToUpdate) {
      try {
        // Modify the event
        const updatedEvent = {
          ...event,
          title: `UPDATED: ${event.title}`,
          description: event.description
            ? `UPDATED: ${event.description}`
            : `New description added during stress test at ${new Date().toISOString()}`
        };
        
        const result = await updateEvent(updatedEvent);
        if (result) {
          results.eventsUpdated++;
        }
      } catch (error) {
        console.error('Error updating event:', error);
        results.errors.update++;
      }
    }
    
    console.log(`Successfully updated ${results.eventsUpdated} events.`);
    
    // Step 3: Delete a quarter of the created events
    const eventsToDelete = savedEvents.slice(Math.floor(savedEvents.length / 2), Math.floor(savedEvents.length * 0.75));
    console.log(`Deleting ${eventsToDelete.length} events...`);
    
    for (const event of eventsToDelete) {
      try {
        if (event.id) {
          const result = await deleteEvent(event.id);
          if (result) {
            results.eventsDeleted++;
          }
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        results.errors.deletion++;
      }
    }
    
    console.log(`Successfully deleted ${results.eventsDeleted} events.`);
    
    // Final results
    console.log('Stress Test Results:', results);
    
    // Calculate success rates
    const creationSuccessRate = (results.eventsCreated / count) * 100;
    const updateSuccessRate = (results.eventsUpdated / eventsToUpdate.length) * 100;
    const deleteSuccessRate = (results.eventsDeleted / eventsToDelete.length) * 100;
    
    // Display toast with results
    toast({
      title: 'Calendar Stress Test Complete',
      description: `
        Created: ${results.eventsCreated}/${count} (${creationSuccessRate.toFixed(1)}%)
        Updated: ${results.eventsUpdated}/${eventsToUpdate.length} (${updateSuccessRate.toFixed(1)}%)
        Deleted: ${results.eventsDeleted}/${eventsToDelete.length} (${deleteSuccessRate.toFixed(1)}%)
      `,
      duration: 5000,
    });
    
  } catch (error) {
    console.error('Stress test failed:', error);
    toast({
      title: 'Calendar Stress Test Failed',
      description: 'An error occurred during the stress test. Check console for details.',
      variant: 'destructive',
      duration: 5000,
    });
  } finally {
    console.timeEnd('Calendar Stress Test');
  }
};