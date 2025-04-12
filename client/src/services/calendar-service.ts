import { format, parse, isSameDay } from 'date-fns';

// Event interface (matches CalendarEvent from smart-calendar.tsx)
export interface CalendarEvent {
  id: string;
  title: string;
  category: string;
  date: Date;
  description?: string;
}

export class CalendarService {
  private STORAGE_KEY = 'fundamentaCalendarEvents';

  /**
   * Get all calendar events from localStorage
   */
  getAllEvents(): CalendarEvent[] {
    try {
      const savedEvents = localStorage.getItem(this.STORAGE_KEY);
      if (savedEvents) {
        return JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading calendar events:', error);
      return [];
    }
  }

  /**
   * Add a new event to the calendar
   */
  addEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    try {
      const events = this.getAllEvents();
      const newEvent: CalendarEvent = {
        ...event,
        id: Date.now().toString(), // Simple id generation
      };

      events.push(newEvent);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
      return newEvent;
    } catch (error) {
      console.error('Error adding calendar event:', error);
      throw new Error('Failed to add event to calendar');
    }
  }

  /**
   * Delete an event from the calendar
   */
  deleteEvent(id: string): boolean {
    try {
      const events = this.getAllEvents();
      const filteredEvents = events.filter(event => event.id !== id);
      
      if (filteredEvents.length !== events.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEvents));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return false;
    }
  }

  /**
   * Get events for a specific date
   */
  getEventsForDate(date: Date): CalendarEvent[] {
    const events = this.getAllEvents();
    return events.filter(event => isSameDay(new Date(event.date), date));
  }

  /**
   * Get upcoming events (next 7 days)
   */
  getUpcomingEvents(): CalendarEvent[] {
    const events = this.getAllEvents();
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= nextWeek;
    });
  }

  /**
   * Process a natural language date request
   * @param dateText Natural language date text like "tomorrow", "next Monday", "April 15th"
   * @returns Date object or null if unable to parse
   */
  parseDateFromText(dateText: string): Date | null {
    const today = new Date();
    const lowerText = dateText.toLowerCase();

    // Handle common expressions
    if (lowerText.includes('today')) {
      return today;
    }
    
    if (lowerText.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow;
    }
    
    if (lowerText.includes('next week')) {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return nextWeek;
    }

    // Handle day of week
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < daysOfWeek.length; i++) {
      if (lowerText.includes(daysOfWeek[i])) {
        const targetDay = i;
        const currentDay = today.getDay();
        let daysToAdd = targetDay - currentDay;
        
        // If the day has already passed this week, go to next week
        if (daysToAdd <= 0) {
          daysToAdd += 7;
        }
        
        // Special handling for "next Monday" etc.
        if (lowerText.includes('next') && targetDay !== currentDay) {
          daysToAdd += 7;
        }
        
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysToAdd);
        return targetDate;
      }
    }

    // Try to parse specific dates
    try {
      // Look for MM/DD/YYYY or MM-DD-YYYY
      const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/;
      const dateMatch = lowerText.match(dateRegex);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1; // JS months are 0-indexed
        const day = parseInt(dateMatch[2]);
        let year = parseInt(dateMatch[3]);
        if (year < 100) {
          year += 2000; // Assume 20xx for two-digit years
        }
        return new Date(year, month, day);
      }

      // Look for month names like "April 15" or "15th of April"
      const months = [
        'january', 'february', 'march', 'april', 'may', 'june', 
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      
      for (let i = 0; i < months.length; i++) {
        const monthName = months[i];
        if (lowerText.includes(monthName)) {
          // Try to find a day number
          const dayRegex = new RegExp(`(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?${monthName}|${monthName}\\s+(?:the\\s+)?(\\d{1,2})(?:st|nd|rd|th)?`);
          const dayMatch = lowerText.match(dayRegex);
          
          if (dayMatch) {
            const day = parseInt(dayMatch[1] || dayMatch[2]);
            const year = today.getFullYear();
            const month = i;
            return new Date(year, month, day);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing date:', error);
    }

    // Default to today if we can't parse the date
    return today;
  }

  /**
   * Create an event from natural language
   * @param text Natural language text describing an event
   * @returns Created event or null if parsing failed
   */
  createEventFromText(text: string): CalendarEvent | null {
    try {
      // Extract event details from text
      let title = '';
      let description = '';
      let category = 'general';
      let dateText = 'today';

      // Common phrases that indicate an event's title
      const titleIndicators = [
        'reminder to', 'reminder for', 'set a reminder', 
        'schedule', 'add event', 'add to calendar',
        'create event', 'plan for', 'meeting for',
        'appointment for'
      ];

      // Try to extract a title
      let extractedTitle = '';
      for (const indicator of titleIndicators) {
        if (text.toLowerCase().includes(indicator)) {
          const parts = text.toLowerCase().split(indicator);
          if (parts.length > 1) {
            extractedTitle = parts[1].trim();
            // If title contains words like "on", "at", "tomorrow", try to extract just the title part
            const dateMarkers = [' on ', ' at ', ' tomorrow', ' next ', ' this ', ' in '];
            for (const marker of dateMarkers) {
              if (extractedTitle.includes(marker)) {
                extractedTitle = extractedTitle.split(marker)[0].trim();
                break;
              }
            }
            break;
          }
        }
      }
      
      // If we found a title, use it
      if (extractedTitle) {
        title = extractedTitle.charAt(0).toUpperCase() + extractedTitle.slice(1);
      } else {
        // Fallback to using the entire text as title
        title = text;
      }

      // Limit title length
      if (title.length > 100) {
        // Use the first 100 chars and add "..." if needed
        title = title.substring(0, 97) + '...';
      }

      // Try to extract a date
      const dateIndicators = ['on', 'for', 'at', 'tomorrow', 'next', 'this', 'coming'];
      for (const indicator of dateIndicators) {
        if (text.toLowerCase().includes(` ${indicator} `)) {
          const parts = text.toLowerCase().split(` ${indicator} `);
          if (parts.length > 1) {
            // Extract everything after the indicator
            let datePart = parts[1].trim();
            // If there are more words after the date, cut them off
            const cutoffs = [' at ', ' to ', ' with ', ' for ', ' because '];
            for (const cutoff of cutoffs) {
              if (datePart.includes(cutoff)) {
                datePart = datePart.split(cutoff)[0].trim();
              }
            }
            dateText = datePart;
            break;
          }
        }
      }

      // Try to determine category
      const categoryKeywords: Record<string, string[]> = {
        'finance': ['finance', 'money', 'budget', 'mortgage', 'loan', 'invest', 'tax', 'taxes', 'banking', 'financial'],
        'health': ['health', 'doctor', 'medical', 'wellness', 'checkup', 'medicine', 'therapy'],
        'career': ['career', 'job', 'work', 'interview', 'resume', 'professional', 'business', 'meeting'],
        'learning': ['learn', 'study', 'class', 'course', 'education', 'school', 'research', 'practice', 'training']
      };
      
      // Check if any category keywords exist in the text
      const lowerText = text.toLowerCase();
      for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
          if (lowerText.includes(keyword)) {
            category = cat;
            break;
          }
        }
        if (category !== 'general') break;
      }

      // Parse the date from text
      const eventDate = this.parseDateFromText(dateText) || new Date();

      // Create the event
      const newEvent = this.addEvent({
        title,
        category,
        date: eventDate,
        description
      });

      return newEvent;
    } catch (error) {
      console.error('Error creating event from text:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
export const calendarService = new CalendarService();