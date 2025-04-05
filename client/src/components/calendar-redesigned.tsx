import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Define types
type Event = {
  id: string;
  title: string;
  date: Date;
  category: string;
  color: string;
};

export default function CalendarRedesigned() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('month');
  
  // Mock data for events
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(2025, 3, 5), // April 5, 2025
      category: 'work',
      color: 'bg-blue-200 text-blue-800'
    },
    {
      id: '2',
      title: 'Dentist',
      date: new Date(2025, 3, 7), // April 7, 2025
      category: 'health',
      color: 'bg-pink-200 text-pink-800'
    },
    {
      id: '3',
      title: 'Budget Review',
      date: new Date(2025, 3, 7), // April 7, 2025
      category: 'finance',
      color: 'bg-green-200 text-green-800'
    },
    {
      id: '4',
      title: 'Client Call',
      date: new Date(2025, 3, 6), // April 6, 2025
      category: 'work',
      color: 'bg-orange-200 text-orange-800'
    },
    {
      id: '5',
      title: 'Fitness Class',
      date: new Date(2025, 3, 14), // April 14, 2025
      category: 'health',
      color: 'bg-cyan-200 text-cyan-800'
    }
  ]);
  
  // Helper to get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };
  
  // Handler for previous month navigation
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  // Handler for next month navigation
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  // Handler for current month navigation
  const handleCurrentMonth = () => {
    setCurrentDate(new Date());
  };
  
  // Handler for view change
  const handleViewChange = (view: 'day' | 'week' | 'month') => {
    setCurrentView(view);
  };
  
  // Month View Component
  const MonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    // Navigation controls for month view
    const MonthNavigation = () => (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-900">April 2025</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousMonth}
            className="border-gray-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous Month
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCurrentMonth}
            className="border-gray-300"
          >
            Current Month
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextMonth}
            className="border-gray-300"
          >
            Next Month
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4">
          {/* Month header with navigation */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-indigo-900">Calendar</h1>
            <Button className="rounded-full bg-white text-indigo-800 border border-gray-200 shadow-sm hover:bg-gray-50">
              <Plus className="h-4 w-4 mr-1" />
              New Event
            </Button>
          </div>
          
          {/* View toggle buttons */}
          <div className="flex mb-6">
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button 
                className={cn(
                  "px-6 py-1 rounded-md font-medium text-sm",
                  currentView === 'day' ? "bg-white shadow-sm" : "text-gray-600"
                )}
                onClick={() => handleViewChange('day')}
              >
                Day
              </button>
              <button 
                className={cn(
                  "px-6 py-1 rounded-md font-medium text-sm",
                  currentView === 'week' ? "bg-white shadow-sm" : "text-gray-600"
                )}
                onClick={() => handleViewChange('week')}
              >
                Week
              </button>
              <button 
                className={cn(
                  "px-6 py-1 rounded-md font-medium text-sm",
                  currentView === 'month' ? "bg-white shadow-sm" : "text-gray-600"
                )}
                onClick={() => handleViewChange('month')}
              >
                Month
              </button>
            </div>
          </div>
          
          {/* Month navigation */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-900">{format(currentDate, 'MMMM yyyy')}</h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviousMonth}
                className="border-gray-200 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Month</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCurrentMonth}
                className="border-gray-200 hover:bg-gray-50"
              >
                Current Month
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextMonth}
                className="border-gray-200 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Month</span>
              </Button>
            </div>
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px border rounded-lg overflow-hidden bg-gray-200">
            {/* Day headers */}
            {daysOfWeek.map((day) => (
              <div key={day} className="bg-gray-50 py-2 text-center text-gray-600 text-sm font-medium">
                {day}
              </div>
            ))}
            
            {/* Calendar cells */}
            {days.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);
              
              return (
                <div 
                  key={i} 
                  className={cn(
                    "h-32 p-1 bg-white",
                    !isCurrentMonth && "bg-gray-50",
                    isCurrentDay && "bg-blue-50"
                  )}
                >
                  {/* Date number */}
                  <div className="flex justify-between items-start">
                    <span 
                      className={cn(
                        "inline-block rounded-full w-6 h-6 text-center leading-6 text-sm",
                        isCurrentDay && "bg-blue-600 text-white",
                        !isCurrentMonth && "text-gray-400"
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>
                  
                  {/* Events for this day */}
                  <div className="mt-1 space-y-1 max-h-24 overflow-hidden">
                    {dayEvents.map((event) => (
                      <div 
                        key={event.id}
                        className={cn(
                          "px-2 py-1 text-xs rounded truncate",
                          event.color
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  // Main render
  return (
    <div className="h-full bg-gray-50 p-6">
      {currentView === 'month' && <MonthView />}
      {/* We can add other views like DayView and WeekView later */}
    </div>
  );
}