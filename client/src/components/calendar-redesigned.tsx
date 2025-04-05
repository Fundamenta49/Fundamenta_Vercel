import React, { useState } from 'react';
import { format, addDays, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Define types
type Event = {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  category: string;
  location?: string;
  attendees?: string[];
};

export default function CalendarRedesigned() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  
  // Mock data for events
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Daily standup',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      category: 'work',
      location: 'Conference Room A',
      attendees: ['john@example.com', 'jane@example.com', 'mark@example.com', 'sarah@example.com']
    },
    {
      id: '2',
      title: 'Weekly Review',
      date: addDays(new Date(), 1),
      startTime: '10:00',
      endTime: '12:00',
      category: 'work',
      attendees: ['boss@example.com', 'john@example.com']
    },
    {
      id: '3',
      title: 'Check Up to Doctor',
      date: addDays(new Date(), 2),
      startTime: '09:00',
      endTime: '10:00',
      category: 'health',
      location: 'Medical Center'
    },
    {
      id: '4',
      title: 'Agencies Birthday',
      date: new Date(),
      startTime: '11:00',
      endTime: '13:00',
      category: 'personal'
    },
    {
      id: '5',
      title: 'Bazaar',
      date: addDays(new Date(), 2),
      startTime: '10:00',
      endTime: '12:00',
      category: 'personal',
      location: 'City Center',
      attendees: ['friend1@example.com', 'friend2@example.com']
    },
    {
      id: '6',
      title: 'Meeting with Client',
      date: addDays(new Date(), 1),
      startTime: '12:00',
      endTime: '13:00',
      category: 'work',
      attendees: ['client@example.com', 'john@example.com', 'jane@example.com', 'mark@example.com']
    },
    {
      id: '7',
      title: 'Lunch Break',
      date: addDays(new Date(), 2),
      startTime: '12:00',
      endTime: '13:00',
      category: 'personal'
    }
  ]);
  
  // Category colors for events
  const categoryColors: Record<string, { bg: string, border: string }> = {
    work: { 
      bg: "bg-red-100", 
      border: "border-l-4 border-red-500"
    },
    health: { 
      bg: "bg-green-100", 
      border: "border-l-4 border-green-500"
    },
    personal: { 
      bg: "bg-yellow-100", 
      border: "border-l-4 border-yellow-500"
    },
    learning: { 
      bg: "bg-blue-100", 
      border: "border-l-4 border-blue-500"
    }
  };
  
  // Helper function to get avatar info by email
  const getAvatarByEmail = (email: string) => {
    const name = email.split('@')[0];
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    
    // Use a deterministic method to assign colors
    const colorIndex = name.length % colors.length;
    return {
      name,
      color: colors[colorIndex]
    };
  };
  
  // Helper to get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Month mini-calendar for sidebar
  const MonthMiniCalendar = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Get days of the month plus any days needed to complete the weeks
    const startDate = startOfWeek(firstDayOfMonth);
    const endDate = endOfWeek(lastDayOfMonth);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Days of the week
    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    
    return (
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-4">
          <button className="p-1 text-gray-500 hover:text-gray-800">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-md font-medium">March</h3>
          <button className="p-1 text-gray-500 hover:text-gray-800">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-1">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const isCurrentDay = isToday(day);
            const inCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <button
                key={i}
                className={cn(
                  "text-center py-1 rounded-full text-sm",
                  isCurrentDay && "bg-blue-600 text-white",
                  !isCurrentDay && inCurrentMonth && "text-gray-800 hover:bg-gray-100",
                  !inCurrentMonth && "text-gray-400"
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  
  // My Schedule component for sidebar
  const MySchedule = () => {
    return (
      <div className="bg-white rounded-lg p-4 border mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">My Schedule</h3>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
        
        <div className="space-y-2">
          {['Daily Standup', 'Weekly Review', 'Team Meeting', 'Lunch Break', 'Client Meeting', 'Other'].map(item => (
            <div key={item} className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Categories component for sidebar
  const Categories = () => {
    const categories = [
      { name: 'Work', color: 'bg-red-500', count: 18 },
      { name: 'Learning', color: 'bg-blue-500', count: 5 },
      { name: 'Health', color: 'bg-green-500', count: 7 },
      { name: 'Personal', color: 'bg-yellow-500', count: 12 },
      { name: 'Other', color: 'bg-gray-500', count: 3 }
    ];
    
    return (
      <div className="bg-white rounded-lg p-4 border mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Categories</h3>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
        
        <div className="space-y-3">
          {categories.map(category => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                <span className="text-sm">{category.name}</span>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Week Calendar View
  const WeekCalendarView = () => {
    // Get the current week's days
    const weekStart = startOfWeek(currentDate);
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(currentDate)
    });
    
    // Map of hours to display
    const hours = ['09 AM', '10 AM', '11 AM', '12 PM'];
    
    return (
      <div className="h-full flex flex-col">
        {/* Header with month and view toggles */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-800">
              {format(currentDate, 'MMMM, yyyy')}
            </h2>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button className="px-4 py-1 rounded-full">Day</button>
            <button className="px-4 py-1 rounded-full bg-white shadow">Week</button>
            <button className="px-4 py-1 rounded-full">Month</button>
          </div>
        </div>
        
        {/* Calendar info and actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            <span className="text-blue-500">45 events</span>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-1" />
            New Event
          </Button>
        </div>
        
        {/* Week header */}
        <div className="flex border-b">
          {/* Time column header */}
          <div className="w-24 text-center p-2 font-medium text-gray-500">
            UTC +1
          </div>
          
          {/* Day columns headers */}
          {weekDays.map((day, i) => (
            <div key={i} className="flex-1 text-center p-2 border-l">
              <div className="font-medium">{format(day, 'd')}</div>
              <div className="text-sm text-gray-500">{format(day, 'EEEE')}</div>
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="flex-grow overflow-auto">
          {/* Time rows */}
          {hours.map((hour, hourIndex) => (
            <div key={hourIndex} className="flex border-b min-h-[100px]">
              {/* Time column */}
              <div className="w-24 text-center p-2 text-gray-500 font-medium">
                {hour}
              </div>
              
              {/* Day columns */}
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDay(day).filter(event => 
                  event.startTime.startsWith(hour.split(' ')[0].padStart(2, '0'))
                );
                
                return (
                  <div key={dayIndex} className="flex-1 p-1 border-l">
                    {dayEvents.map((event, eventIndex) => (
                      <div 
                        key={eventIndex}
                        className={cn(
                          "rounded-md p-2 mb-1",
                          categoryColors[event.category]?.bg || "bg-gray-100",
                          categoryColors[event.category]?.border || "border-l-4 border-gray-400"
                        )}
                      >
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.startTime} - {event.endTime}
                        </div>
                        
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center mt-2">
                            <div className="flex -space-x-2">
                              {event.attendees.slice(0, 3).map((email, i) => {
                                const avatar = getAvatarByEmail(email);
                                return (
                                  <Avatar key={i} className="h-6 w-6 border border-white">
                                    <AvatarFallback className={avatar.color}>
                                      {avatar.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                );
                              })}
                            </div>
                            {event.attendees.length > 3 && (
                              <span className="text-xs ml-1 text-gray-500">
                                +{event.attendees.length - 3} Other
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-full bg-gray-50 flex">
      {/* Left sidebar */}
      <div className="w-64 p-4 border-r">
        <MonthMiniCalendar />
        <MySchedule />
        <Categories />
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="flex flex-col h-full">
          <WeekCalendarView />
        </div>
      </div>
    </div>
  );
}

// Helper components
const ChevronDown = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none"
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);