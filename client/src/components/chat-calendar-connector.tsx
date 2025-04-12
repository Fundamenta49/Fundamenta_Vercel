import { useEffect } from 'react';
import { useAIEventStore } from '@/lib/ai-event-system';
import { calendarService } from '@/services/calendar-service';
import { useToast } from '@/hooks/use-toast';

/**
 * This component serves as a connector between Fundi AI chat and the calendar system.
 * It listens for chat responses containing calendar-related requests and handles them.
 * 
 * It doesn't render anything visible - it just provides the connection logic.
 */
export default function ChatCalendarConnector() {
  const { lastResponse, currentMessage } = useAIEventStore();
  const { toast } = useToast();

  useEffect(() => {
    // Only process if we have both a user message and a response
    if (!currentMessage || !lastResponse?.response) return;

    // Check if this might be a calendar-related request
    const lowerMessage = currentMessage.toLowerCase();
    const calendarKeywords = [
      'calendar', 'schedule', 'reminder', 'remind me', 
      'appointment', 'set a', 'add to calendar',
      'save the date', 'plan for', 'remember to'
    ];
    
    // Check if any calendar keywords are in the message
    const isCalendarRequest = calendarKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    if (!isCalendarRequest) return;

    // Process the calendar request on the server
    const processCalendarRequest = async () => {
      try {
        const response = await fetch('/api/calendar/process-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: currentMessage }),
        });

        if (!response.ok) {
          throw new Error('Failed to process calendar request');
        }

        const data = await response.json();
        
        // If it's not a calendar request after server analysis, ignore it
        if (!data.isCalendarRequest) return;

        // If it is a calendar request, try to create an event
        const createdEvent = calendarService.createEventFromText(currentMessage);
        
        if (createdEvent) {
          // Show a success toast
          toast({
            title: "Event Added to Calendar",
            description: `"${createdEvent.title}" added for ${new Date(createdEvent.date).toLocaleDateString()}`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Error processing calendar request:', error);
      }
    };

    processCalendarRequest();
  }, [lastResponse, currentMessage, toast]);

  // This is a connector component that doesn't render anything
  return null;
}