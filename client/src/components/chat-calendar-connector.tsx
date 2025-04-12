import { useEffect, useState } from 'react';
import { useAIEventStore } from '@/lib/ai-event-system';
import { CalendarEvent, calendarService } from '@/services/calendar-service';
import { useToast } from '@/hooks/use-toast';
import { CalendarEventRecurrenceDialog } from '@/components/calendar-event-recurrence-dialog';

/**
 * This component serves as a connector between Fundi AI chat and the calendar system.
 * It listens for chat responses containing calendar-related requests and handles them.
 * 
 * It doesn't render anything visible aside from dialogs for user interaction.
 */
export default function ChatCalendarConnector() {
  const { lastResponse, currentMessage } = useAIEventStore();
  const { toast } = useToast();
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<CalendarEvent | null>(null);

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
        console.log("Processing potential calendar request:", currentMessage);
        
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
        console.log("Calendar API response:", data);
        
        // If it's not a calendar request after server analysis, ignore it
        if (!data.isCalendarRequest) {
          console.log("Not identified as a calendar request by the server");
          return;
        }

        console.log("Creating calendar event from text:", currentMessage);
        // If it is a calendar request, try to create an event
        const newEvent = calendarService.createEventFromText(currentMessage);
        console.log("Created event:", newEvent);
        
        if (newEvent) {
          setCreatedEvent(newEvent);
          
          // Show a success toast
          toast({
            title: "Event Added to Calendar",
            description: `"${newEvent.title}" added for ${new Date(newEvent.date).toLocaleDateString()}`,
            variant: "default",
          });
          
          // Open the recurrence dialog to ask if this should be a recurring event
          setShowRecurrenceDialog(true);
          
          // Log success
          console.log("Successfully added event to calendar");
        } else {
          console.log("Failed to create event from text");
        }
      } catch (error) {
        console.error('Error processing calendar request:', error);
      }
    };

    processCalendarRequest();
  }, [lastResponse, currentMessage, toast]);
  
  // Handle dialog close
  const handleRecurrenceComplete = () => {
    // Reset state
    setCreatedEvent(null);
  };

  return (
    <>
      {/* Dialog for asking about event recurrence */}
      <CalendarEventRecurrenceDialog
        event={createdEvent}
        open={showRecurrenceDialog}
        onOpenChange={setShowRecurrenceDialog}
        onComplete={handleRecurrenceComplete}
      />
    </>
  );
}