import { EventFormData } from '@/components/event-form';

// Define the Event type including all necessary fields
export interface CalendarEvent extends EventFormData {
  id: string;
}

// Simple UUID generator without external dependencies
function generateUniqueId(): string {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(16);
  });
}

// Define a service class to handle calendar operations
class CalendarService {
  private storageKey = 'fundamenta_calendar_events';
  
  // Get all events from local storage
  getEvents(): CalendarEvent[] {
    try {
      const eventsJson = localStorage.getItem(this.storageKey);
      if (!eventsJson) return [];
      
      const events = JSON.parse(eventsJson);
      
      // Convert date strings back to Date objects
      return events.map((event: any) => ({
        ...event,
        date: new Date(event.date),
        startTime: event.startTime ? new Date(event.startTime) : undefined,
        endTime: event.endTime ? new Date(event.endTime) : undefined,
      }));
    } catch (error) {
      console.error('Error retrieving calendar events:', error);
      return [];
    }
  }
  
  // Add a new event
  addEvent(eventData: EventFormData): CalendarEvent {
    try {
      const events = this.getEvents();
      
      // Create new event with ID
      const newEvent: CalendarEvent = {
        ...eventData,
        id: generateUniqueId(), // Generate unique ID
      };
      
      // Add to collection and save
      events.push(newEvent);
      this.saveEvents(events);
      
      return newEvent;
    } catch (error) {
      console.error('Error adding calendar event:', error);
      throw error;
    }
  }
  
  // Update an existing event
  updateEvent(eventData: EventFormData): CalendarEvent | null {
    try {
      if (!eventData.id) {
        throw new Error('Cannot update event without ID');
      }
      
      const events = this.getEvents();
      const index = events.findIndex(e => e.id === eventData.id);
      
      if (index === -1) {
        throw new Error(`Event with ID ${eventData.id} not found`);
      }
      
      // Update the event
      const updatedEvent: CalendarEvent = {
        ...eventData,
        id: eventData.id,
      };
      
      events[index] = updatedEvent;
      this.saveEvents(events);
      
      return updatedEvent;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      return null;
    }
  }
  
  // Delete an event
  deleteEvent(eventId: string): boolean {
    try {
      const events = this.getEvents();
      const filteredEvents = events.filter(event => event.id !== eventId);
      
      if (filteredEvents.length === events.length) {
        return false; // No event was deleted
      }
      
      this.saveEvents(filteredEvents);
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return false;
    }
  }
  
  // Save events to local storage
  private saveEvents(events: CalendarEvent[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving calendar events:', error);
    }
  }
}

// Export a singleton instance
export const calendarService = new CalendarService();