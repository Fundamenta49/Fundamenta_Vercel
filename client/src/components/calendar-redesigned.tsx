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
import EventForm, { EventFormData, LearningResource } from '@/components/event-form';
import { calendarService, CalendarEvent } from '@/services/calendar-service';
import { getWeather, WeatherData } from '@/services/weather-service';
import WeatherWidget from '@/components/weather-widget';

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

// Learning resources catalog for the calendar
const generateLearningResources = (): LearningResource[] => {
  return [
    { id: 'economics', title: 'Economics Basics', path: '/learning/courses/economics', category: 'finance', duration: 60 },
    { id: 'vehicle-maintenance', title: 'Vehicle Maintenance', path: '/learning/courses/vehicle-maintenance', category: 'personal', duration: 45 },
    { id: 'home-maintenance', title: 'Home Maintenance', path: '/learning/courses/home-maintenance', category: 'personal', duration: 50 },
    { id: 'cooking-basics', title: 'Cooking Basics', path: '/learning/courses/cooking-basics', category: 'personal', duration: 40 },
    { id: 'health-wellness', title: 'Health & Wellness', path: '/learning/courses/health-wellness', category: 'health', duration: 30 },
    { id: 'critical-thinking', title: 'Critical Thinking', path: '/learning/courses/critical-thinking', category: 'school', duration: 55 },
    { id: 'conflict-resolution', title: 'Conflict Resolution', path: '/learning/courses/conflict-resolution', category: 'work', duration: 40 },
    { id: 'decision-making', title: 'Decision Making', path: '/learning/courses/decision-making', category: 'work', duration: 45 },
    { id: 'time-management', title: 'Time Management', path: '/learning/courses/time-management', category: 'work', duration: 35 },
    { id: 'coping-with-failure', title: 'Coping with Failure', path: '/learning/courses/coping-with-failure', category: 'personal', duration: 40 },
    { id: 'conversation-skills', title: 'Conversation Skills', path: '/learning/courses/conversation-skills', category: 'personal', duration: 30 },
    { id: 'forming-positive-habits', title: 'Positive Habits', path: '/learning/courses/forming-positive-habits', category: 'health', duration: 45 },
    { id: 'utilities-guide', title: 'Utilities Guide', path: '/learning/courses/utilities-guide', category: 'finance', duration: 30 },
    { id: 'shopping-buddy', title: 'Shopping Buddy', path: '/learning/courses/shopping-buddy', category: 'finance', duration: 25 },
    { id: 'repair-assistant', title: 'Repair Assistant', path: '/learning/courses/repair-assistant', category: 'personal', duration: 35 },
  ];
};



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
          
          {/* View selector tabs - compacted for mobile, fixed for desktop */}
          <div className="flex justify-center sm:justify-start mb-2">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              <button 
                className={cn(
                  "px-3 sm:px-5 py-1.5 text-xs sm:text-sm font-medium rounded-md",
                  currentView === 'day' ? "bg-white shadow-sm" : "text-gray-600"
                )}
                onClick={() => handleViewChange('day')}
              >
                Day
              </button>
              <button 
                className={cn(
                  "px-3 sm:px-5 py-1.5 text-xs sm:text-sm font-medium rounded-md",
                  currentView === 'week' ? "bg-white shadow-sm" : "text-gray-600"
                )}
                onClick={() => handleViewChange('week')}
              >
                Week
              </button>
              <button 
                className={cn(
                  "px-3 sm:px-5 py-1.5 text-xs sm:text-sm font-medium rounded-md",
                  currentView === 'month' ? "bg-white shadow-sm" : "text-gray-600"
                )}
                onClick={() => handleViewChange('month')}
              >
                Month
              </button>
              <button 
                className={cn(
                  "px-3 sm:px-5 py-1.5 text-xs sm:text-sm font-medium rounded-md",
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
          
          {/* Weather Widget */}
          <div className="mt-4 max-w-[100%] sm:max-w-xs">
            <WeatherWidget />
          </div>
        </div>
        
        <div className="flex-1 px-4 py-2 calendar-scroll-container">
          <div className="grid grid-cols-7 h-full calendar-day-cells overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)', scrollbarWidth: 'thin' }}>
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
        <DialogContent className="bg-white dark:bg-gray-900 w-[95%] max-w-md max-h-[80vh] sm:max-h-[90vh] overflow-y-auto top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed sm:rounded-lg shadow-lg no-scrollbar" aria-labelledby="event-dialog-title">
          <div className="space-y-4">
            <div className="flex justify-between items-start sticky top-0 bg-white dark:bg-gray-900 z-10 pb-2">
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
  
  // Week View Component
  const WeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 sm:px-6 pb-4 border-b calendar-header">
          {/* View toggle header - mobile responsive */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <div className="space-y-1 mb-2 sm:mb-0">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </h2>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentDate(addDays(currentDate, -7))}
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
                onClick={() => setCurrentDate(addDays(currentDate, 7))}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Weather Widget */}
          <div className="mt-4 max-w-[100%] sm:max-w-xs">
            <WeatherWidget />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x border-b">
            {days.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentDay = isToday(day);
              
              return (
                <div key={index} className="p-2 min-h-[150px]">
                  <div className={cn(
                    "flex flex-col h-full p-2 rounded-lg",
                    isCurrentDay ? "bg-blue-50" : ""
                  )}>
                    <div className="text-center mb-2">
                      <div className="text-xs text-gray-500">{format(day, 'EEE')}</div>
                      <div className={cn(
                        "inline-flex items-center justify-center h-7 w-7 rounded-full text-sm font-medium",
                        isCurrentDay ? "bg-blue-600 text-white" : "text-gray-900"
                      )}>
                        {format(day, 'd')}
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto flex-1">
                      {dayEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowEventDetails(true);
                          }}
                          className={cn(
                            "w-full text-left px-2 py-1 mb-1 text-xs rounded border-l-2",
                            categoryColors[event.category]?.bg || "bg-gray-100",
                            categoryColors[event.category]?.text || "text-gray-700",
                            categoryColors[event.category]?.border || "border-gray-300"
                          )}
                        >
                          {event.startTime && (
                            <div className="font-medium">
                              {formatTime(event.startTime)}
                            </div>
                          )}
                          <div className="truncate">
                            {event.title}
                          </div>
                        </button>
                      ))}
                      
                      {dayEvents.length === 0 && (
                        <div 
                          className="h-full min-h-[50px] flex items-center justify-center text-gray-400 text-xs cursor-pointer"
                          onClick={() => {
                            setSelectedDay(day);
                            setShowEventForm(true);
                          }}
                        >
                          <div className="text-center">
                            <Plus className="h-4 w-4 mx-auto mb-1" />
                            <span>Add event</span>
                          </div>
                        </div>
                      )}
                    </div>
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
  
  // Day View Component
  const DayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForDay(currentDate);
    
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 sm:px-6 pb-4 border-b calendar-header">
          {/* View toggle header - mobile responsive */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <div className="space-y-1 mb-2 sm:mb-0">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </h2>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentDate(addDays(currentDate, -1))}
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
                onClick={() => setCurrentDate(addDays(currentDate, 1))}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Weather Widget */}
          <div className="mt-4 max-w-[100%] sm:max-w-xs">
            <WeatherWidget />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
          <div className="grid grid-cols-[50px_1fr] sm:grid-cols-[60px_1fr] gap-2">
            {hours.map((hour) => {
              const hourFormatted = hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
              const hourEvents = dayEvents.filter(event => event.startTime && getHours(event.startTime) === hour);
              
              return (
                <React.Fragment key={hour}>
                  <div className="text-right pr-2 text-gray-500 text-xs">
                    {hourFormatted}
                  </div>
                  <div 
                    className="min-h-[50px] border-t border-gray-200 pt-1 relative"
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      newDate.setHours(hour, 0, 0, 0);
                      setSelectedDay(newDate);
                      setShowEventForm(true);
                    }}
                  >
                    {hourEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          setShowEventDetails(true);
                        }}
                        className={cn(
                          "w-full text-left px-2 py-1 mb-1 text-xs rounded border-l-2",
                          categoryColors[event.category]?.bg || "bg-gray-100",
                          categoryColors[event.category]?.text || "text-gray-700",
                          categoryColors[event.category]?.border || "border-gray-300"
                        )}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {event.startTime && formatTime(event.startTime)}
                            {event.endTime && ` - ${formatTime(event.endTime)}`}
                          </span>
                        </div>
                        <div className="truncate">{event.title}</div>
                      </button>
                    ))}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        
        {/* Action Button - Fixed at bottom right */}
        <div className="fixed bottom-6 right-6">
          <Button 
            onClick={() => {
              setSelectedDay(currentDate);
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
  
  // Year View - Simple implementation
  const YearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i, 1));
    
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 sm:px-6 pb-4 border-b calendar-header">
          {/* View toggle header - mobile responsive */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <div className="space-y-1 mb-2 sm:mb-0">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {currentDate.getFullYear()}
              </h2>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setFullYear(newDate.getFullYear() - 1);
                  setCurrentDate(newDate);
                }}
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
                This Year
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setFullYear(newDate.getFullYear() + 1);
                  setCurrentDate(newDate);
                }}
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
          
          {/* Weather Widget */}
          <div className="mt-4 max-w-[100%] sm:max-w-xs">
            <WeatherWidget />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {months.map((month, index) => {
              // Calculate total events per month
              const monthStart = startOfMonth(month);
              const monthEnd = endOfMonth(month);
              const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
              
              let totalEvents = 0;
              daysInMonth.forEach(day => {
                totalEvents += getEventsForDay(day).length;
              });
              
              const isCurrentMonth = new Date().getMonth() === month.getMonth() && 
                                     new Date().getFullYear() === month.getFullYear();
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentDate(month);
                    handleViewChange('month');
                  }}
                  className={cn(
                    "p-4 rounded-lg border flex flex-col items-center hover:bg-gray-50 transition-colors",
                    isCurrentMonth ? "border-blue-300 bg-blue-50" : "border-gray-200"
                  )}
                >
                  <span className="text-lg font-medium">{format(month, 'MMM')}</span>
                  <div className="mt-2 mb-1 text-xs text-gray-500">
                    {totalEvents} {totalEvents === 1 ? 'event' : 'events'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  // Main render with fullscreen option
  return (
    <>
      {/* Main Calendar View */}
      <div id="calendar-redesigned" className={cn(
        "bg-white rounded-lg flex flex-col calendar-widget",
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
          <div className="flex-1">
            {currentView === 'month' && <MonthView />}
            {currentView === 'week' && <WeekView />}
            {currentView === 'day' && <DayView />}
            {currentView === 'year' && <YearView />}
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
        learningResources={generateLearningResources()}
      />
    </>
  );
}