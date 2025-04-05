import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, 
  isSameMonth, isToday, addDays, isSameDay, getHours, getMinutes, parseISO, setHours, setMinutes } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Search, X, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import EventForm, { EventFormData } from '@/components/event-form';
import { calendarService, CalendarEvent } from '@/services/calendar-service';

// Category colors mapping (Apple-style)
const categoryColors: Record<string, { bg: string, text: string, border: string }> = {
  work: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  personal: { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-300" },
  family: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  school: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
  health: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  finance: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
  other: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" }
};

// Custom hook for responsive design
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Initial check
    setIsMobile(window.innerWidth < 640);
    
    // Add resize listener
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return isMobile;
}

export default function CalendarRedesigned() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Load events from storage on component mount
  useEffect(() => {
    try {
      const storedEvents = calendarService.getEvents();
      setEvents(storedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Error",
        description: "Failed to load calendar events.",
        variant: "destructive",
      });
    }
  }, []);
  
  // Helper to get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events
      .filter(event => isSameDay(event.date, date))
      .filter(event => 
        searchTerm ? 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
        : true
      )
      .sort((a, b) => {
        // Sort by start time if available
        if (a.startTime && b.startTime) {
          return a.startTime.getTime() - b.startTime.getTime();
        }
        return 0;
      });
  };
  
  // Handle event creation/update
  const handleSaveEvent = (eventData: EventFormData) => {
    try {
      if (eventData.id) {
        // Update existing event
        const updatedEvent = calendarService.updateEvent(eventData);
        if (updatedEvent) {
          setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
          toast({
            title: "Event Updated",
            description: "Your event has been updated successfully.",
          });
        }
      } else {
        // Create new event
        const newEvent = calendarService.addEvent(eventData);
        setEvents(prev => [...prev, newEvent]);
        toast({
          title: "Event Created",
          description: "Your event has been added to the calendar.",
        });
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "Failed to save the event. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle event deletion
  const handleDeleteEvent = (eventId: string) => {
    try {
      const success = calendarService.deleteEvent(eventId);
      if (success) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setShowEventDetails(false);
        toast({
          title: "Event Deleted",
          description: "The event has been removed from your calendar.",
        });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle accessing learning content
  const handleAccessLearningContent = () => {
    if (selectedEvent && selectedEvent.learningResourceId) {
      // Find the path from the learning resource ID
      // This is a simplified approach - in a real app, we'd have a more robust way to map IDs to paths
      const path = `/learning/courses/${selectedEvent.learningResourceId}`;
      navigate(path);
      setShowEventDetails(false);
    }
  };
  
  // Handler for previous month navigation
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  // Handler for next month navigation
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  // Handler for current month/today navigation
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  // Handler for view change
  const handleViewChange = (view: 'day' | 'week' | 'month' | 'year') => {
    setCurrentView(view);
  };
  
  // Helper to format time
  const formatTime = (date?: Date) => {
    if (!date) return '';
    const hours = getHours(date);
    const minutes = getMinutes(date);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''} ${ampm}`;
  };
  
  // Month View Component
  const MonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    // Get week number helper
    const getWeekNumber = (date: Date) => {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };
    
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 sm:px-6 pb-4 border-b calendar-header">
          {/* View toggle header - mobile responsive */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <div className="space-y-1 mb-2 sm:mb-0">
              <h2 className="text-xl sm:text-2xl font-semibold">{format(currentDate, 'MMM yyyy')}</h2>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviousMonth}
                className="border-gray-200 hover:bg-gray-50 rounded-full h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleToday}
                className="border-gray-200 hover:bg-gray-50 text-sm"
              >
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextMonth}
                className="border-gray-200 hover:bg-gray-50 rounded-full h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
          
          {/* View selector tabs - compacted for mobile */}
          <div className="flex justify-center mb-2">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              <button 
                className={cn(
                  "px-2 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md",
                  currentView === 'day' ? "bg-white shadow-sm" : "text-gray-600"
                )}
                onClick={() => handleViewChange('day')}
              >
                Day
              </button>
              <button 
                className={cn(
                  "px-2 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md",
                  currentView === 'week' ? "bg-white shadow-sm" : "text-gray-600"
                )}
                onClick={() => handleViewChange('week')}
              >
                Week
              </button>
              <button 
                className={cn(
                  "px-2 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md",
                  currentView === 'month' ? "bg-white shadow-sm" : "text-gray-600"
                )}
                onClick={() => handleViewChange('month')}
              >
                Month
              </button>
              <button 
                className={cn(
                  "px-2 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md",
                  currentView === 'year' ? "bg-white shadow-sm" : "text-gray-600"
                )}
                onClick={() => handleViewChange('year')}
              >
                Year
              </button>
            </div>
          </div>
          
          {/* Search bar - responsive width */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search" 
              className="pl-10 pr-4 py-2 w-full max-w-[100%] sm:max-w-xs rounded-full border-gray-300 bg-gray-50"
            />
          </div>
        </div>
        
        <div className="flex-1 px-4 py-2 overflow-y-auto calendar-scroll-container" style={{ scrollbarWidth: 'thin' }}>
          <div className="grid grid-cols-7 h-full calendar-day-cells">
            {/* Day headers - mobile optimized */}
            {daysOfWeek.map((day, index) => (
              <div key={day} className={cn(
                "py-2 text-center text-xs uppercase font-medium tracking-wider text-gray-500",
                (index === 0 || index === 6) ? "text-rose-500" : ""
              )}>
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}
            
            {/* Calendar cells */}
            {days.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);
              const dayNumber = parseInt(format(day, 'd'));
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              
              return (
                <div 
                  key={i} 
                  className={cn(
                    "h-[80px] sm:h-[120px] border-t border-r relative cursor-pointer",
                    !isCurrentMonth && "opacity-50",
                    isCurrentDay && "bg-gray-50",
                    isWeekend && !isCurrentDay && "bg-gray-50/30",
                  )}
                  onClick={() => {
                    setSelectedDay(day);
                    setShowEventForm(true);
                  }}
                >
                  {/* Date number with indicator for current day - mobile optimized */}
                  <div className="h-6 sm:h-8 flex justify-between items-center px-1">
                    <div className="relative">
                      {isCurrentDay ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-5 w-5 sm:h-6 sm:w-6 bg-red-500 rounded-full" />
                        </div>
                      ) : null}
                      <span className={cn(
                        "relative z-10 text-xs sm:text-sm font-medium",
                        isCurrentDay ? "text-white" : isCurrentMonth ? "text-gray-900" : "text-gray-400",
                        dayNumber >= 10 ? "ml-0" : "ml-0.5" // Adjust for single digit numbers
                      )}>
                        {dayNumber}
                      </span>
                    </div>
                  </div>
                  
                  {/* Events for this day - adapted for mobile */}
                  <div className="px-1 space-y-1 pb-1 max-h-[calc(100%-1.5rem)] overflow-hidden">
                    {dayEvents.slice(0, isMobile ? 2 : 4).map((event) => (
                      <button
                        key={event.id}
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventDetails(true);
                        }}
                        className={cn(
                          "w-full text-left px-1.5 py-0.5 text-xs rounded border-l-2",
                          categoryColors[event.category]?.bg || "bg-gray-100",
                          categoryColors[event.category]?.text || "text-gray-700",
                          categoryColors[event.category]?.border || "border-gray-300",
                          "hover:opacity-90 transition-opacity"
                        )}
                      >
                        {event.startTime && (
                          <div className="font-medium hidden sm:block">
                            {formatTime(event.startTime)}
                          </div>
                        )}
                        <div className="truncate">
                          {event.title}
                        </div>
                      </button>
                    ))}
                    {dayEvents.length > (isMobile ? 2 : 4) && (
                      <div className="text-center text-xs text-gray-500">
                        +{dayEvents.length - (isMobile ? 2 : 4)} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Action Button - Fixed at bottom right */}
        <div className="fixed bottom-6 right-6">
          <Button 
            onClick={() => {
              // Set current day as selected day and open event form
              setSelectedDay(new Date());
              setShowEventForm(true);
            }}
            className="h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-0 calendar-add-button"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">New Event</span>
          </Button>
        </div>
      </div>
    );
  };
  
  // Event details dialog
  const EventDetailsDialog = () => {
    if (!selectedEvent) return null;
    
    return (
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="w-full max-w-md top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] fixed sm:fixed md:fixed" aria-labelledby="event-dialog-title">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 id="event-dialog-title" className="text-xl font-semibold">{selectedEvent.title}</h2>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>
                    {format(selectedEvent.date, 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                {selectedEvent.startTime && selectedEvent.endTime && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>
                      {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                    </span>
                  </div>
                )}
                {selectedEvent.location && (
                  <div className="text-sm text-gray-600 mt-2">
                    📍 {selectedEvent.location}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500"
                onClick={() => setShowEventDetails(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center">
                <div
                  className={cn(
                    "h-3 w-3 rounded-full mr-2",
                    categoryColors[selectedEvent.category]?.border || "bg-gray-300"
                  )}
                />
                <span className="text-sm capitalize">{selectedEvent.category}</span>
              </div>
              
              {/* Description */}
              {selectedEvent.description && (
                <div className="mt-3 text-sm text-gray-600">
                  {selectedEvent.description}
                </div>
              )}
              
              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                
                <div className="space-x-2">
                  {selectedEvent.learningResourceId && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleAccessLearningContent}
                    >
                      Access Content
                    </Button>
                  )}
                  
                  <Button 
                    size="sm"
                    onClick={() => {
                      setSelectedDay(selectedEvent.date);
                      setShowEventDetails(false);
                      // Pass the selected event to the form for editing
                      setShowEventForm(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Main render with fullscreen option
  return (
    <>
      {/* Main Calendar View */}
      <div className={cn(
        "bg-white rounded-lg overflow-hidden flex flex-col calendar-widget",
        isFullscreen ? "fixed inset-0 z-50" : "h-full"
      )}>
        {/* Fullscreen Toggle Header */}
        {isFullscreen && (
          <div className="p-3 bg-gray-100 border-b flex justify-between items-center">
            <div className="flex space-x-1">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Sidebar/Main Content Layout */}
        <div className="flex flex-1 h-full">
          {/* Left sidebar with categories */}
          <div className="w-48 border-r bg-gray-50 p-4 hidden md:block calendar-categories">
            <h3 className="font-medium text-gray-500 uppercase text-xs tracking-wider mb-3">Groups</h3>
            <div className="space-y-1">
              {Object.entries(categoryColors).map(([category, colors]) => (
                <div key={category} className="flex items-center space-x-2 py-1.5 px-2 rounded-lg hover:bg-gray-100">
                  <input type="checkbox" defaultChecked className={cn("h-4 w-4", `accent-[var(--${category}-color)]`)} />
                  <span className="text-sm capitalize">{category}</span>
                </div>
              ))}
            </div>
            

          </div>
          
          {/* Main calendar area */}
          <div className="flex-1 overflow-hidden">
            {currentView === 'month' && <MonthView />}
            {/* We can add other views like DayView, WeekView and YearView later */}
          </div>
        </div>
        
        {/* Fullscreen toggle button (only show when not in fullscreen) */}
        {!isFullscreen && (
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            title="Expand to fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
        )}
      </div>
      
      {/* Event Details Dialog */}
      <EventDetailsDialog />
      
      {/* Event Form Dialog */}
      <EventForm 
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDay || undefined}
        editEvent={selectedEvent && selectedDay && isSameDay(selectedEvent.date, selectedDay) ? selectedEvent : null}
        learningResources={[]}
      />
    </>
  );
}