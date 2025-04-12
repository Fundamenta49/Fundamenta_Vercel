import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CalendarEvent, RecurringFrequency, calendarService } from '@/services/calendar-service';
import { useToast } from '@/hooks/use-toast';
import { addMonths } from 'date-fns';

interface RecurrenceDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export function CalendarEventRecurrenceDialog({ 
  event, 
  open, 
  onOpenChange,
  onComplete 
}: RecurrenceDialogProps) {
  const [frequency, setFrequency] = useState<RecurringFrequency>('none');
  const { toast } = useToast();
  
  if (!event) return null;

  const handleSetRecurrence = () => {
    if (!event) return;
    
    try {
      // Only process if it's not a one-time event
      if (frequency !== 'none') {
        const endDate = addMonths(new Date(event.date), 3); // Default end date is 3 months from start
        const events = calendarService.addRecurringEvents(event, frequency, endDate);
        
        toast({
          title: 'Recurring Events Created',
          description: `Created ${events.length} events ${frequency} until ${endDate.toLocaleDateString()}`,
          variant: 'default',
        });
      }
      
      onOpenChange(false);
      onComplete();
    } catch (error) {
      console.error('Error setting recurrence:', error);
      toast({
        title: 'Error Creating Recurring Events',
        description: 'There was a problem setting up recurring events',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Event Recurrence</DialogTitle>
          <DialogDescription>
            Would you like this event to repeat?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup 
            value={frequency} 
            onValueChange={(value) => setFrequency(value as RecurringFrequency)}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">One-time event</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Daily</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Weekly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="biweekly" id="biweekly" />
              <Label htmlFor="biweekly">Bi-weekly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSetRecurrence}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}