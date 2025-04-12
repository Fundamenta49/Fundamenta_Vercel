import { isSameDay, addDays, addWeeks, addMonths } from 'date-fns';

// Recurring event frequency
export type RecurringFrequency = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';

// Event interface (matches CalendarEvent from smart-calendar.tsx)
export interface CalendarEvent {
  id: string;
  title: string;
  category: string;
  date: Date;
  description?: string;
  recurring?: RecurringFrequency;
  endDate?: Date; // For recurring events
}

class CalendarServiceImpl {
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
   * Create recurring events based on a given event
   * @param event Base event
   * @param frequency Frequency of recurrence (daily, weekly, etc.)
   * @param endDate End date for recurring events
   * @returns Array of created events including the original
   */
  addRecurringEvents(event: CalendarEvent, frequency: RecurringFrequency, endDate?: Date): CalendarEvent[] {
    try {
      if (frequency === 'none') {
        return [event]; // No recurrence needed
      }

      const events = this.getAllEvents();
      const startDate = new Date(event.date);
      const finalEndDate = endDate || new Date(startDate.getFullYear(), startDate.getMonth() + 3, startDate.getDate()); // Default to 3 months
      const createdEvents: CalendarEvent[] = [event]; // Include the original

      // Add the original event to the list with recurring metadata
      const recurringEvent: CalendarEvent = {
        ...event,
        recurring: frequency,
        endDate: finalEndDate
      };
      
      // Update the original event in the events list
      const eventIndex = events.findIndex(e => e.id === event.id);
      if (eventIndex !== -1) {
        events[eventIndex] = recurringEvent;
      } else {
        events.push(recurringEvent);
      }
      
      // Calculate number of occurrences based on frequency and date range
      let currentDate = new Date(startDate);
      
      // Generator for the next date based on frequency
      const getNextDate = () => {
        switch (frequency) {
          case 'daily':
            currentDate = addDays(currentDate, 1);
            break;
          case 'weekly':
            currentDate = addDays(currentDate, 7);
            break;
          case 'biweekly':
            currentDate = addDays(currentDate, 14);
            break;
          case 'monthly':
            currentDate = addMonths(currentDate, 1);
            break;
        }
        return new Date(currentDate);
      };

      // Generate recurring instances
      let nextDate = getNextDate();
      while (nextDate <= finalEndDate) {
        const recurrenceInstance: CalendarEvent = {
          ...event,
          id: `${event.id}-${nextDate.getTime()}`, // Create a new ID for each instance
          date: new Date(nextDate),
          recurring: frequency,
          endDate: finalEndDate
        };
        
        events.push(recurrenceInstance);
        createdEvents.push(recurrenceInstance);
        nextDate = getNextDate();
      }

      // Save all events
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
      return createdEvents;
    } catch (error) {
      console.error('Error creating recurring events:', error);
      return [event]; // Return at least the original event
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
    console.log(`Attempting to parse date from: "${lowerText}"`);

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

    // Try to handle date ranges (e.g., "from 14th to 18th")
    // For date ranges, we'll take the start date
    const dateRangeRegex = /(?:from|between)\s+(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(?:to|until|and|through|-)(?:\s+(?:the\s+)?)(\d{1,2})(?:st|nd|rd|th)?/i;
    const dateRangeMatch = lowerText.match(dateRangeRegex);
    
    if (dateRangeMatch) {
      console.log("Found date range pattern:", dateRangeMatch);
      const startDay = parseInt(dateRangeMatch[1]);
      // Find which month we're talking about
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      // Look for month name in the text
      const months = [
        'january', 'february', 'march', 'april', 'may', 'june', 
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      
      let targetMonth = currentMonth;
      let targetYear = currentYear;
      
      // Check if a month is mentioned
      for (let i = 0; i < months.length; i++) {
        if (lowerText.includes(months[i])) {
          targetMonth = i;
          console.log(`Found month: ${months[i]} (${i})`);
          break;
        }
      }
      
      // If the day has already passed this month, assume next month
      if (startDay < today.getDate() && targetMonth === currentMonth) {
        targetMonth++;
        if (targetMonth > 11) {
          targetMonth = 0;
          targetYear++;
        }
      }
      
      return new Date(targetYear, targetMonth, startDay);
    }

    // Look for specific day of month pattern (like "the 15th" or "on the 21st", "for the 23rd")
    const specificDayRegex = /(?:on|by|for)?\s+(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?(?:\s+of)?/i;
    const specificDayMatch = lowerText.match(specificDayRegex);
    
    if (specificDayMatch) {
      console.log("Found specific day pattern:", specificDayMatch);
      const day = parseInt(specificDayMatch[1]);
      
      // Find which month we're talking about (default to current)
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      let targetMonth = currentMonth;
      let targetYear = currentYear;
      
      // Look for month name in the text
      const months = [
        'january', 'february', 'march', 'april', 'may', 'june', 
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      
      // Check if a month is mentioned
      for (let i = 0; i < months.length; i++) {
        if (lowerText.includes(months[i])) {
          targetMonth = i;
          console.log(`Found month: ${months[i]} (${i})`);
          break;
        }
      }
      
      // If the day has already passed this month, assume next month
      if (day < today.getDate() && targetMonth === currentMonth) {
        targetMonth++;
        if (targetMonth > 11) {
          targetMonth = 0;
          targetYear++;
        }
      }
      
      return new Date(targetYear, targetMonth, day);
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
      
      // Look for just numbers that might be days of the month
      const justDayRegex = /\b(\d{1,2})(?:st|nd|rd|th)?\b/;
      const justDayMatch = lowerText.match(justDayRegex);
      
      if (justDayMatch) {
        const day = parseInt(justDayMatch[1]);
        // Only use if it looks like a valid day (1-31)
        if (day >= 1 && day <= 31) {
          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();
          
          let targetMonth = currentMonth;
          let targetYear = currentYear;
          
          // If the day has already passed this month, assume next month
          if (day < today.getDate()) {
            targetMonth++;
            if (targetMonth > 11) {
              targetMonth = 0;
              targetYear++;
            }
          }
          
          return new Date(targetYear, targetMonth, day);
        }
      }
    } catch (error) {
      console.error('Error parsing date:', error);
    }

    // Default to today if we can't parse the date
    console.log("Could not parse date from text, using today as default");
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
      
      // Look for time information in the text (like 9am, 3:30pm)
      const timeRegex = /\b(1[0-2]|0?[1-9])(?::([0-5][0-9]))?\s*(am|pm)\b/i;
      const timeMatch = text.match(timeRegex);
      
      if (timeMatch) {
        // Include the time in the date text so it gets parsed properly
        const fullTimeStr = timeMatch[0];
        description = `Time: ${fullTimeStr}`;
        
        // We'll add the time to dateText later
      }

      // Handle learning schedule request special case
      if (text.toLowerCase().includes('learning schedule') || 
          text.toLowerCase().includes('study schedule') ||
          text.toLowerCase().includes('learn about')) {
        console.log("Handling learning schedule request");
        
        // Extract topics from the request
        let topics = "";
        const topicsMatch = text.match(/learn about\s+(.+?)(?:\s+for|\s+on|\s+make|\s+at|$)/i);
        if (topicsMatch && topicsMatch[1]) {
          topics = topicsMatch[1].trim();
        } else {
          // Try another pattern
          const altTopicsMatch = text.match(/I want to learn about\s+(.+?)(?:\.|\s+for|\s+on|\s+make|\s+at|$)/i);
          if (altTopicsMatch && altTopicsMatch[1]) {
            topics = altTopicsMatch[1].trim();
          }
        }
        
        if (topics) {
          title = `Study schedule: ${topics}`;
        } else {
          title = 'Learning schedule';
        }
        
        // Look for date information with various patterns
        let foundDate = false;
        
        // Check for "week of April 14-18" pattern - prioritize this for learning schedules
        const weekRangePatterns = [
          /week of\s+(?:the\s+)?(?:([a-z]+)\s+)?(\d{1,2})(?:st|nd|rd|th)?[-–](\d{1,2})(?:st|nd|rd|th)?/i,
          /for the week of\s+(?:the\s+)?(?:([a-z]+)\s+)?(\d{1,2})(?:st|nd|rd|th)?[-–](\d{1,2})(?:st|nd|rd|th)?/i,
          /make these for the week of\s+(?:the\s+)?(?:([a-z]+)\s+)?(\d{1,2})(?:st|nd|rd|th)?[-–](\d{1,2})(?:st|nd|rd|th)?/i
        ];
        
        let foundWeekRange = false;
        
        for (const pattern of weekRangePatterns) {
          const weekRangeMatch = text.match(pattern);
          if (weekRangeMatch) {
            console.log("Found week range:", weekRangeMatch);
            const month = weekRangeMatch[1] ? weekRangeMatch[1].toLowerCase() : null;
            const startDay = parseInt(weekRangeMatch[2]);
            const endDay = parseInt(weekRangeMatch[3]);
            
            // Format it properly for the date parser
            if (month) {
              dateText = `from ${startDay} ${month} to ${endDay} ${month}`;
            } else {
              // Extract month from surrounding text
              const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                'july', 'august', 'september', 'october', 'november', 'december'];
              
              let detectedMonth = null;
              for (const m of months) {
                if (text.toLowerCase().includes(m)) {
                  detectedMonth = m;
                  break;
                }
              }
              
              if (detectedMonth) {
                dateText = `from ${startDay} ${detectedMonth} to ${endDay} ${detectedMonth}`;
                console.log(`Detected month ${detectedMonth} from context`);
              } else {
                dateText = `from ${startDay} to ${endDay}`;
              }
            }
            foundDate = true;
            foundWeekRange = true;
            break;
          }
        }
        
        // Specifically handle "april 14-18th" pattern
        if (!foundWeekRange) {
          const directDateRangePattern = /(?:([a-z]+)\s+)?(\d{1,2})(?:st|nd|rd|th)?[-–](\d{1,2})(?:st|nd|rd|th)?/i;
          const directMatch = text.match(directDateRangePattern);
          
          if (directMatch) {
            console.log("Found direct date range:", directMatch);
            const month = directMatch[1] ? directMatch[1].toLowerCase() : null;
            const startDay = parseInt(directMatch[2]);
            const endDay = parseInt(directMatch[3]);
            
            if (month) {
              dateText = `from ${startDay} ${month} to ${endDay} ${month}`;
            } else {
              // Look for month in surrounding text
              const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                'july', 'august', 'september', 'october', 'november', 'december'];
              
              let detectedMonth = null;
              for (const m of months) {
                if (text.toLowerCase().includes(m)) {
                  detectedMonth = m;
                  break;
                }
              }
              
              if (detectedMonth) {
                dateText = `from ${startDay} ${detectedMonth} to ${endDay} ${detectedMonth}`;
                console.log(`Detected month ${detectedMonth} from context`);
              } else {
                dateText = `from ${startDay} to ${endDay}`;
              }
            }
            foundDate = true;
          }
        }
        
        // Check for "week of April 14" pattern
        if (!foundDate) {
          const weekMatch = text.match(/week of\s+([^\.]+)/i);
          if (weekMatch && weekMatch[1]) {
            dateText = weekMatch[1].trim();
            foundDate = true;
          }
        }
        
        // Check for date range pattern
        if (!foundDate) {
          const dateRangeMatch = text.match(/(?:from|between)\s+(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?(?:\s+(?:of\s+)?([a-z]+))?\s+(?:to|until|and|through|-)(?:\s+(?:the\s+)?)(\d{1,2})(?:st|nd|rd|th)?(?:\s+(?:of\s+)?([a-z]+))?/i);
          if (dateRangeMatch) {
            console.log("Found date range:", dateRangeMatch);
            dateText = dateRangeMatch[0];
            foundDate = true;
          }
        }
        
        console.log("Extracted date text for learning schedule:", dateText);
      } else {
        // Common phrases that indicate an event's title for other types of events
        const titleIndicators = [
          'reminder to', 'reminder for', 'set a reminder', 
          'schedule', 'add event', 'add to calendar',
          'create event', 'plan for', 'meeting for',
          'appointment for', 'set a', 'set an', 'add a', 'add an',
          'put', 'schedule a', 'create a'
        ];

        // First try to handle "Put X on my calendar", "Add X to calendar" patterns
        let extractedTitle = '';
        const calendarPatterns = [
          /put\s+(.+?)\s+(?:on|in)(?:\s+my)?\s+calendar/i,
          /add\s+(.+?)\s+(?:to|on|in)(?:\s+my)?\s+calendar/i,
          /schedule\s+(?:a|an)?\s+(.+?)(?:\s+on|\s+in|\s+for)/i,
          /set\s+(?:a|an)?\s+(.+?)(?:\s+on|\s+in|\s+for)/i
        ];
        
        for (const pattern of calendarPatterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            extractedTitle = match[1].trim();
            break;
          }
        }
        
        // If no direct match, try the previous approach with indicators
        if (!extractedTitle) {
          for (const indicator of titleIndicators) {
            if (text.toLowerCase().includes(indicator)) {
              const parts = text.toLowerCase().split(indicator);
              if (parts.length > 1) {
                extractedTitle = parts[1].trim();
                // If title contains words like "on", "at", "tomorrow", try to extract just the title part
                const dateMarkers = [' on ', ' at ', ' tomorrow', ' next ', ' this ', ' in ', ' for '];
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
        }
        
        // If we found a title, use it
        if (extractedTitle) {
          title = extractedTitle.charAt(0).toUpperCase() + extractedTitle.slice(1);
        } else {
          // Last resort: Look for nouns in the beginning of the text that could be an event
          // This helps with commands like "Dance recital for the 22nd"
          const simpleExtraction = text.split(/\s+(?:on|at|for|in|this|next|tomorrow)/i)[0].trim();
          if (simpleExtraction && simpleExtraction.length < text.length / 2) {
            title = simpleExtraction;
          } else {
            // Fallback to using a generic title rather than the whole text
            title = "Calendar Event";
          }
        }
      }

      // Limit title length
      if (title.length > 100) {
        // Use the first 100 chars and add "..." if needed
        title = title.substring(0, 97) + '...';
      }

      // Only use general date extraction if we don't already have a date from the learning schedule special case
      if (!text.toLowerCase().includes('learning schedule') && 
          !text.toLowerCase().includes('study schedule') &&
          !text.toLowerCase().includes('learn about')) {
          
        // First check if there is a date range in the text
        const dateRangeRegex = /(?:from|between)\s+(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(?:to|until|and|through|-)(?:\s+(?:the\s+)?)(\d{1,2})(?:st|nd|rd|th)?/i;
        const dateRangeMatch = text.toLowerCase().match(dateRangeRegex);
        
        if (dateRangeMatch) {
          console.log("Found date range in full text:", dateRangeMatch);
          // Use the entire matching section as dateText
          dateText = dateRangeMatch[0];
        } else {
          // Try to extract a date using indicators
          const dateIndicators = ['on', 'for', 'at', 'tomorrow', 'next', 'this', 'coming', 'from', 'between'];
          for (const indicator of dateIndicators) {
            if (text.toLowerCase().includes(` ${indicator} `)) {
              const parts = text.toLowerCase().split(` ${indicator} `);
              if (parts.length > 1) {
                // Extract everything after the indicator
                let datePart = parts[1].trim();
                // If there are more words after the date, cut them off
                const cutoffs = [' at ', ' with ', ' because ', ' every '];
                for (const cutoff of cutoffs) {
                  if (datePart.includes(cutoff)) {
                    datePart = datePart.split(cutoff)[0].trim();
                  }
                }
                
                // Special handling for "to" - only cut off if not part of a date range
                if (datePart.includes(' to ') && !datePart.match(/\d+(?:st|nd|rd|th)?\s+to\s+\d+/)) {
                  datePart = datePart.split(' to ')[0].trim();
                }
                
                dateText = `${indicator} ${datePart}`;
                console.log(`Extracted date text using indicator "${indicator}": "${dateText}"`);
                break;
              }
            }
          }
        }
      }

      // Try to determine category
      const categoryKeywords: Record<string, string[]> = {
        'finance': ['finance', 'money', 'budget', 'mortgage', 'loan', 'invest', 'tax', 'taxes', 'banking', 'financial', 'payment'],
        'health': ['health', 'doctor', 'medical', 'wellness', 'checkup', 'medicine', 'therapy', 'dentist', 'dental', 'appointment'],
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

      console.log(`Final dateText before parsing: "${dateText}"`);

      // Parse the date from text
      const eventDate = this.parseDateFromText(dateText) || new Date();
      console.log(`Parsed date: ${eventDate.toISOString()}`);
      

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
export const calendarService = new CalendarServiceImpl();