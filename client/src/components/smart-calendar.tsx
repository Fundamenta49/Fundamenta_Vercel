import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";

// Event interface
interface CalendarEvent {
  id: string;
  title: string;
  category: string;
  date: Date;
  description?: string;
}

export default function SmartCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<CalendarEvent>({
    id: '',
    title: '',
    category: 'general',
    date: new Date(),
    description: ''
  });

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('fundamentaCalendarEvents');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
      setEvents(parsedEvents);
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('fundamentaCalendarEvents', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    const eventWithId = {
      ...newEvent,
      id: Date.now().toString(), // Simple id generation
    };
    setEvents([...events, eventWithId]);
    setNewEvent({
      id: '',
      title: '',
      category: 'general',
      date: selectedDate,
      description: ''
    });
    setShowModal(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const nextMonth = () => {
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    setCurrentDate(nextMonthDate);
  };

  const prevMonth = () => {
    const prevMonthDate = new Date(currentDate);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    setCurrentDate(prevMonthDate);
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>Today</Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium py-2">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;
        const dayEvents = events.filter(
          event => isSameDay(new Date(event.date), cloneDay)
        );

        days.push(
          <div
            key={day.toString()}
            className={`p-1 min-h-[80px] border border-border ${
              !isSameMonth(day, monthStart) ? 'text-muted-foreground' : ''
            } ${isSameDay(day, selectedDate) ? 'bg-primary/10' : ''}`}
            onClick={() => {
              setSelectedDate(cloneDay);
              setNewEvent({...newEvent, date: cloneDay});
            }}
          >
            <div className="font-medium text-sm">{formattedDate}</div>
            {dayEvents.length > 0 && (
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div 
                    key={event.id} 
                    className={`text-xs p-1 rounded truncate cursor-pointer
                      ${event.category === 'finance' ? 'bg-green-100 text-green-800' : 
                      event.category === 'health' ? 'bg-blue-100 text-blue-800' : 
                      event.category === 'career' ? 'bg-purple-100 text-purple-800' : 
                      event.category === 'learning' ? 'bg-amber-100 text-amber-800' : 
                      'bg-gray-100 text-gray-800'}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Show event details (could expand this functionality)
                      alert(`${event.title}\n${event.description || 'No description'}`);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-muted-foreground px-1">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  const renderEventsList = () => {
    // Get today's events
    const todayEvents = events.filter(event => 
      isSameDay(new Date(event.date), new Date())
    );
    
    // Get upcoming events (next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > today && eventDate <= nextWeek;
    });

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Your Schedule</CardTitle>
          <CardDescription>Today and upcoming events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Today</h3>
              {todayEvents.length > 0 ? (
                <ScrollArea className="h-[100px]">
                  <div className="space-y-2">
                    {todayEvents.map(event => (
                      <div key={event.id} className="flex justify-between items-center p-2 rounded border">
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(event.date), 'h:mm a')}
                          </div>
                        </div>
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-muted-foreground">No events today</div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Upcoming</h3>
              {upcomingEvents.length > 0 ? (
                <ScrollArea className="h-[150px]">
                  <div className="space-y-2">
                    {upcomingEvents.map(event => (
                      <div key={event.id} className="flex justify-between items-center p-2 rounded border">
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(event.date), 'EEE, MMM d')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{event.category}</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteEvent(event.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-muted-foreground">No upcoming events</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Fundamenta Smart Calendar</CardTitle>
              <CardDescription>Plan your learning and activities</CardDescription>
            </div>
            <Button onClick={() => {
              setNewEvent({...newEvent, date: selectedDate});
              setShowModal(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          {renderEventsList()}
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event on your calendar
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-title" className="text-right">Title</label>
              <Input
                id="event-title"
                className="col-span-3"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-category" className="text-right">Category</label>
              <Select 
                value={newEvent.category}
                onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-date" className="text-right">Date</label>
              <Input
                id="event-date"
                className="col-span-3"
                type="date"
                value={format(newEvent.date, 'yyyy-MM-dd')}
                onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-description" className="text-right">Description</label>
              <Input
                id="event-description"
                className="col-span-3"
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event description (optional)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAddEvent}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}