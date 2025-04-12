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
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [newEvent, setNewEvent] = useState<CalendarEvent>({
    id: '',
    title: '',
    category: 'general',
    date: new Date(),
    description: ''
  });
  
  // Handle responsive design with window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsSmallScreen(window.innerWidth < 380);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add listener for resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    // Use shorter month format on smallest screens
    const dateFormat = isSmallScreen ? 'MMM yyyy' : 'MMMM yyyy';

    return (
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <h2 className="text-base sm:text-xl font-semibold">
          {format(currentDate, dateFormat)}
        </h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 p-0" onClick={prevMonth}>
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3" onClick={goToday}>Today</Button>
          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 p-0" onClick={nextMonth}>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    // Use shorter format on mobile
    const dateFormat = isMobile ? "E" : "EEE";
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium py-1 sm:py-2 text-xs sm:text-sm">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-0">{days}</div>;
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
            className={`p-0.5 border border-border text-center ${
              !isSameMonth(day, monthStart) ? 'text-muted-foreground' : ''
            } ${isSameDay(day, selectedDate) ? 'bg-primary/10' : ''}`}
            style={{ height: isMobile ? '40px' : '60px', overflow: 'hidden' }}
            onClick={() => {
              setSelectedDate(cloneDay);
              setNewEvent({...newEvent, date: cloneDay});
            }}
          >
            <div className="font-medium text-xs sm:text-sm">{formattedDate}</div>
            {dayEvents.length > 0 && (
              <div className="mt-0.5 sm:mt-1 space-y-0.5 overflow-hidden">
                {/* Show fewer events on mobile */}
                {dayEvents.slice(0, isMobile ? 1 : 2).map((event) => (
                  <div 
                    key={event.id} 
                    className={`text-[8px] sm:text-xs p-0.5 rounded truncate cursor-pointer
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
                {dayEvents.length > (isMobile ? 1 : 2) && (
                  <div className="text-[8px] text-muted-foreground">
                    +{dayEvents.length - (isMobile ? 1 : 2)} more
                  </div>
                )}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-0">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="grid gap-0">{rows}</div>;
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
      <Card className="mt-2 sm:mt-4">
        <CardHeader className="px-3 py-2 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Your Schedule</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Today and upcoming events</CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:p-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Today</h3>
              {todayEvents.length > 0 ? (
                <ScrollArea className="h-[80px] sm:h-[100px]">
                  <div className="space-y-1 sm:space-y-2">
                    {todayEvents.map(event => (
                      <div key={event.id} className="flex justify-between items-center p-1.5 sm:p-2 rounded border text-xs sm:text-sm">
                        <div>
                          <div className="font-medium line-clamp-1">{event.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(event.date), 'h:mm a')}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] sm:text-xs px-1 sm:px-2 h-5 sm:h-6">{event.category}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-xs sm:text-sm text-muted-foreground">No events today</div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Upcoming</h3>
              {upcomingEvents.length > 0 ? (
                <ScrollArea className="h-[120px] sm:h-[150px]">
                  <div className="space-y-1 sm:space-y-2">
                    {upcomingEvents.map(event => (
                      <div key={event.id} className="flex justify-between items-center p-1.5 sm:p-2 rounded border text-xs sm:text-sm">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium line-clamp-1">{event.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(event.date), 'EEE, MMM d')}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 ml-1">
                          <Badge variant="outline" className="text-[10px] sm:text-xs px-1 sm:px-2 h-5 sm:h-6 whitespace-nowrap">{event.category}</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 sm:h-8 sm:w-auto p-0 sm:px-2"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">×</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-xs sm:text-sm text-muted-foreground">No upcoming events</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto p-2 sm:p-4">
      <Card className="max-w-[800px] mx-auto">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base sm:text-xl">Fundamenta Smart Calendar</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Plan your learning and activities</CardDescription>
            </div>
            <Button 
              onClick={() => {
                setNewEvent({...newEvent, date: selectedDate});
                setShowModal(true);
              }}
              className="text-xs sm:text-sm h-8 sm:h-10"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Event</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-1 sm:px-4">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          {renderEventsList()}
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto w-[95%] p-3 sm:p-6 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed rounded-lg shadow-lg">
          <DialogHeader className="p-0 sm:p-0">
            <DialogTitle className="text-base sm:text-lg">Add New Event</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Create a new event on your calendar
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-2 sm:gap-4 py-2 sm:py-4">
            {/* For mobile screens, use a stacked layout */}
            <div className={isMobile ? "grid grid-cols-1 gap-1" : "grid grid-cols-4 items-center gap-2 sm:gap-4"}>
              <label htmlFor="event-title" className={isMobile ? "text-xs font-medium" : "text-right text-xs sm:text-sm"}>Title</label>
              <Input
                id="event-title"
                className={isMobile ? "h-8 text-xs" : "col-span-3 h-8 sm:h-10 text-xs sm:text-sm"}
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            
            <div className={isMobile ? "grid grid-cols-1 gap-1" : "grid grid-cols-4 items-center gap-2 sm:gap-4"}>
              <label htmlFor="event-category" className={isMobile ? "text-xs font-medium" : "text-right text-xs sm:text-sm"}>Category</label>
              <Select 
                value={newEvent.category}
                onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
              >
                <SelectTrigger className={isMobile ? "h-8 text-xs" : "col-span-3 h-8 sm:h-10 text-xs sm:text-sm"}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="text-xs max-h-[200px]">
                  <SelectItem value="general" className="text-xs">General</SelectItem>
                  <SelectItem value="health" className="text-xs">Health</SelectItem>
                  <SelectItem value="finance" className="text-xs">Finance</SelectItem>
                  <SelectItem value="career" className="text-xs">Career</SelectItem>
                  <SelectItem value="learning" className="text-xs">Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className={isMobile ? "grid grid-cols-1 gap-1" : "grid grid-cols-4 items-center gap-2 sm:gap-4"}>
              <label htmlFor="event-date" className={isMobile ? "text-xs font-medium" : "text-right text-xs sm:text-sm"}>Date</label>
              <Input
                id="event-date"
                className={isMobile ? "h-8 text-xs" : "col-span-3 h-8 sm:h-10 text-xs sm:text-sm"}
                type="date"
                value={format(newEvent.date, 'yyyy-MM-dd')}
                onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
              />
            </div>
            
            <div className={isMobile ? "grid grid-cols-1 gap-1" : "grid grid-cols-4 items-center gap-2 sm:gap-4"}>
              <label htmlFor="event-description" className={isMobile ? "text-xs font-medium" : "text-right text-xs sm:text-sm"}>Description</label>
              <Input
                id="event-description"
                className={isMobile ? "h-8 text-xs" : "col-span-3 h-8 sm:h-10 text-xs sm:text-sm"}
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event description (optional)"
              />
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" className="text-xs h-8 w-full sm:w-auto" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button size="sm" className="text-xs h-8 w-full sm:w-auto" onClick={handleAddEvent}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}