import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { runCalendarStressTest, generateRandomEvent } from '../services/calendar-stress-test';
import { calendarService } from '../services/calendar-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { EventFormData } from './event-form';

export function CalendarStressTester() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    created: number;
    updated: number;
    deleted: number;
    errors: number;
    totalTime: number;
  } | null>(null);
  const [testSize, setTestSize] = useState(20);
  const [testStart, setTestStart] = useState<Date | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const [activeTest, setActiveTest] = useState<'quickTest' | 'fullTest' | 'notificationTest'>('quickTest');
  const [recentEvents, setRecentEvents] = useState<EventFormData[]>([]);

  // Mock functions that actually call the calendar service
  const saveEvent = async (event: EventFormData): Promise<EventFormData | null> => {
    return calendarService.addEvent(event);
  };

  const updateEvent = async (event: EventFormData): Promise<EventFormData | null> => {
    return calendarService.updateEvent(event);
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    return calendarService.deleteEvent(eventId);
  };

  const runQuickTest = async () => {
    setRunning(true);
    setTestCompleted(false);
    setProgress(0);
    setTestStart(new Date());
    setResults(null);
    setRecentEvents([]);

    try {
      // Create a sample event
      const event = generateRandomEvent();
      setProgress(25);

      // Save the event
      console.log('Creating event:', event);
      const savedEvent = await saveEvent(event);
      setProgress(50);

      if (savedEvent && savedEvent.id) {
        setRecentEvents([savedEvent]);

        // Update the event
        console.log('Updating event:', savedEvent);
        const updatedEvent = {
          ...savedEvent,
          title: `Updated: ${savedEvent.title}`,
          description: 'Updated during quick test'
        };
        await updateEvent(updatedEvent);
        setProgress(75);

        // Delete the event
        console.log('Deleting event:', savedEvent.id);
        await deleteEvent(savedEvent.id);
        setProgress(100);

        // Set results
        setResults({
          created: 1,
          updated: 1,
          deleted: 1,
          errors: 0,
          totalTime: (new Date().getTime() - testStart!.getTime()) / 1000
        });

        toast({
          title: 'Quick Test Completed',
          description: 'Successfully created, updated, and deleted a test event.',
        });
      } else {
        throw new Error('Failed to create event');
      }
    } catch (error) {
      console.error('Quick test failed:', error);
      toast({
        title: 'Quick Test Failed',
        description: 'An error occurred during the test. Check console for details.',
        variant: 'destructive',
      });
      setResults({
        created: 0,
        updated: 0,
        deleted: 0,
        errors: 1,
        totalTime: (new Date().getTime() - testStart!.getTime()) / 1000
      });
    } finally {
      setRunning(false);
      setTestCompleted(true);
    }
  };

  const runNotificationTest = async () => {
    setRunning(true);
    setTestCompleted(false);
    setProgress(0);
    setTestStart(new Date());
    setResults(null);
    setRecentEvents([]);

    try {
      // Create events that are about to start (for notification testing)
      const now = new Date();
      const events = [];

      // Event starting in 16 minutes (should trigger 15 min notification)
      const event1 = generateRandomEvent();
      event1.title = 'Test: 15min Notification';
      event1.date = now;
      event1.startTime = new Date(now.getTime() + 16 * 60 * 1000);
      event1.endTime = new Date(now.getTime() + 76 * 60 * 1000);
      events.push(event1);
      
      // Event starting in 61 minutes (should trigger 1 hour notification)
      const event2 = generateRandomEvent();
      event2.title = 'Test: 1hr Notification';
      event2.date = now;
      event2.startTime = new Date(now.getTime() + 61 * 60 * 1000);
      event2.endTime = new Date(now.getTime() + 121 * 60 * 1000);
      events.push(event2);
      
      // Event starting in 5 minutes (immediate notification)
      const event3 = generateRandomEvent();
      event3.title = 'Test: Immediate Notification';
      event3.date = now;
      event3.startTime = new Date(now.getTime() + 5 * 60 * 1000);
      event3.endTime = new Date(now.getTime() + 65 * 60 * 1000);
      events.push(event3);

      let createdCount = 0;
      
      for (let i = 0; i < events.length; i++) {
        setProgress(Math.round((i / events.length) * 100));
        const event = events[i];
        const savedEvent = await saveEvent(event);
        
        if (savedEvent) {
          createdCount++;
          setRecentEvents(prev => [...prev, savedEvent]);
        }
      }

      setProgress(100);
      
      setResults({
        created: createdCount,
        updated: 0,
        deleted: 0,
        errors: events.length - createdCount,
        totalTime: (new Date().getTime() - testStart!.getTime()) / 1000
      });

      toast({
        title: 'Notification Test Complete',
        description: `Created ${createdCount} events with upcoming start times to test notifications.`,
      });
    } catch (error) {
      console.error('Notification test failed:', error);
      toast({
        title: 'Notification Test Failed',
        description: 'An error occurred during the test. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setRunning(false);
      setTestCompleted(true);
    }
  };

  const runFullTest = async () => {
    setRunning(true);
    setTestCompleted(false);
    setProgress(0);
    setTestStart(new Date());
    setResults(null);
    setRecentEvents([]);

    // Custom progress tracking
    let createdCount = 0;
    let updatedCount = 0;
    let deletedCount = 0;
    let errorCount = 0;
    const savedEvents: EventFormData[] = [];

    try {
      // Track progress with a custom handler
      const originalConsoleTime = console.time;
      const originalConsoleTimeEnd = console.timeEnd;
      const originalConsoleLog = console.log;

      // Override console methods to track progress
      console.time = (label) => {
        originalConsoleTime(label);
        setProgress(1);
      };

      console.timeEnd = (label) => {
        originalConsoleTimeEnd(label);
        setProgress(100);
      };

      console.log = (message, ...args) => {
        originalConsoleLog(message, ...args);
        
        if (typeof message === 'string') {
          if (message.includes('Generating') || message.includes('Creating')) {
            setProgress(5);
          } else if (message.includes('Successfully created')) {
            setProgress(40);
            const match = message.match(/Successfully created (\d+) events/);
            if (match && match[1]) {
              createdCount = parseInt(match[1], 10);
            }
          } else if (message.includes('Updating')) {
            setProgress(50);
          } else if (message.includes('Successfully updated')) {
            setProgress(75);
            const match = message.match(/Successfully updated (\d+) events/);
            if (match && match[1]) {
              updatedCount = parseInt(match[1], 10);
            }
          } else if (message.includes('Deleting')) {
            setProgress(80);
          } else if (message.includes('Successfully deleted')) {
            setProgress(95);
            const match = message.match(/Successfully deleted (\d+) events/);
            if (match && match[1]) {
              deletedCount = parseInt(match[1], 10);
            }
          } else if (message.includes('Error')) {
            errorCount++;
          }
        }
      };

      // Custom event saver to track events
      const trackingSaveEvent = async (event: EventFormData): Promise<EventFormData | null> => {
        const saved = await saveEvent(event);
        if (saved) {
          savedEvents.push(saved);
          setRecentEvents(prev => [...prev.slice(-9), saved]);
        }
        return saved;
      };

      // Run the stress test
      await runCalendarStressTest(
        trackingSaveEvent,
        updateEvent,
        deleteEvent,
        testSize
      );

      // Restore console methods
      console.time = originalConsoleTime;
      console.timeEnd = originalConsoleTimeEnd;
      console.log = originalConsoleLog;

      setResults({
        created: createdCount,
        updated: updatedCount,
        deleted: deletedCount,
        errors: errorCount,
        totalTime: (new Date().getTime() - testStart!.getTime()) / 1000
      });

    } catch (error) {
      console.error('Full stress test failed:', error);
      toast({
        title: 'Stress Test Failed',
        description: 'An error occurred during the test. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setRunning(false);
      setTestCompleted(true);
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Calendar Stress Tester
        </CardTitle>
        <CardDescription>
          Test calendar functionality by generating, updating, and deleting events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTest} onValueChange={(value) => setActiveTest(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quickTest">Quick Test</TabsTrigger>
            <TabsTrigger value="fullTest">Full Stress Test</TabsTrigger>
            <TabsTrigger value="notificationTest">Notification Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quickTest" className="space-y-4 mt-4">
            <p className="text-sm">
              Create, update, and delete a single event to verify basic calendar functionality.
            </p>
            <Button 
              onClick={runQuickTest} 
              disabled={running}
              className="w-full"
            >
              Run Quick Test
            </Button>
          </TabsContent>
          
          <TabsContent value="fullTest" className="space-y-4 mt-4">
            <p className="text-sm">
              Generate multiple events to test calendar performance under load.
            </p>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setTestSize(Math.max(10, testSize - 10))}
                variant="outline"
                size="sm"
                disabled={running || testSize <= 10}
              >
                -10
              </Button>
              <span className="flex-1 text-center font-medium">{testSize} Events</span>
              <Button 
                onClick={() => setTestSize(Math.min(100, testSize + 10))}
                variant="outline"
                size="sm"
                disabled={running || testSize >= 100}
              >
                +10
              </Button>
            </div>
            <Button 
              onClick={runFullTest} 
              disabled={running}
              className="w-full"
            >
              Run Full Stress Test
            </Button>
          </TabsContent>
          
          <TabsContent value="notificationTest" className="space-y-4 mt-4">
            <p className="text-sm">
              Create events with upcoming start times to test notification functionality.
            </p>
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>Notification Test</AlertTitle>
              <AlertDescription>
                This will create events with start times in the next hour to trigger notifications.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={runNotificationTest} 
              disabled={running}
              className="w-full"
            >
              Run Notification Test
            </Button>
          </TabsContent>
        </Tabs>

        {running && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Running test...</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground mt-1">
              This may take a moment. Please wait...
            </p>
          </div>
        )}

        {testCompleted && results && (
          <div className="mt-6 space-y-4">
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Created</span>
                <p className="text-2xl font-bold">{results.created}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Updated</span>
                <p className="text-2xl font-bold">{results.updated}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Deleted</span>
                <p className="text-2xl font-bold">{results.deleted}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Errors</span>
                <p className="text-2xl font-bold text-red-500">{results.errors}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>
                Completed in <strong>{results.totalTime.toFixed(2)}</strong> seconds
              </span>
            </div>

            {recentEvents.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Recent Test Events</h4>
                <div className="max-h-40 overflow-y-auto space-y-2 bg-secondary/30 p-2 rounded-md">
                  {recentEvents.map((event, index) => (
                    <div key={index} className="text-xs p-2 bg-card rounded border">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground">
                        ID: {event.id?.substring(0, 10)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Tests interact with the actual calendar service.
        </p>
        {testCompleted && (
          <div className="flex items-center text-sm gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Test complete</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}