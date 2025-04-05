import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Users,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, addMonths, 
  eachDayOfInterval, isToday, isSameMonth, isSameDay, 
  startOfMonth, endOfMonth, getDay, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types for events
interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  description: string;
  location: string;
  category: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  attendees?: string[];
  notifications?: number[];
  color?: string;
}

// Category colors
const categoryColors: Record<string, { bg: string, text: string, border: string, light: string }> = {
  work: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", light: "bg-red-50" },
  learning: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", light: "bg-blue-50" },
  health: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300", light: "bg-purple-50" },
  fitness: { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-300", light: "bg-cyan-50" },
  finance: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", light: "bg-green-50" },
  personal: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300", light: "bg-yellow-50" },
  other: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300", light: "bg-gray-50" }
};

// Mock data for events
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Daily standup",
    date: new Date(2024, 2, 7), // March 7, 2024
    startTime: setMinutes(setHours(new Date(), 9), 0),
    endTime: setMinutes(setHours(new Date(), 10), 0),
    description: "Team daily sync",
    location: "Conference Room A",
    category: "work",
    isRecurring: true,
    recurrencePattern: "daily",
    attendees: ["john@example.com", "jane@example.com", "alex@example.com", "sarah@example.com"]
  },
  {
    id: "2",
    title: "Weekly Review",
    date: new Date(2024, 2, 8), // March 8, 2024
    startTime: setMinutes(setHours(new Date(), 10), 0),
    endTime: setMinutes(setHours(new Date(), 12), 0),
    description: "Weekly sprint review",
    location: "Main Hall",
    category: "work",
    isRecurring: true,
    recurrencePattern: "weekly",
    attendees: ["john@example.com", "jane@example.com", "alex@example.com", "sarah@example.com"]
  },
  {
    id: "3",
    title: "Check Up to Doctor",
    date: new Date(2024, 2, 9), // March 9, 2024
    startTime: setMinutes(setHours(new Date(), 9), 0),
    endTime: setMinutes(setHours(new Date(), 10), 0),
    description: "Annual checkup",
    location: "Medical Center",
    category: "health",
    isRecurring: false,
    notifications: [30, 60]
  },
  {
    id: "4",
    title: "Bazaar",
    date: new Date(2024, 2, 9), // March 9, 2024
    startTime: setMinutes(setHours(new Date(), 10), 0),
    endTime: setMinutes(setHours(new Date(), 12), 0),
    description: "Shopping at the bazaar",
    location: "Downtown",
    category: "personal",
    isRecurring: false,
    attendees: ["john@example.com", "jane@example.com"]
  },
  {
    id: "5",
    title: "Agencies Birthday",
    date: new Date(2024, 2, 7), // March 7, 2024
    startTime: setMinutes(setHours(new Date(), 11), 0),
    endTime: setMinutes(setHours(new Date(), 13), 0),
    description: "Agency birthday celebration",
    location: "Office",
    category: "work",
    isRecurring: false,
    attendees: ["john@example.com", "jane@example.com", "alex@example.com"]
  },
  {
    id: "6",
    title: "Meeting with Client",
    date: new Date(2024, 2, 8), // March 8, 2024
    startTime: setMinutes(setHours(new Date(), 12), 0),
    endTime: setMinutes(setHours(new Date(), 13), 0),
    description: "Meeting with client",
    location: "Meeting Room B",
    category: "work",
    isRecurring: false,
    attendees: ["john@example.com", "jane@example.com", "alex@example.com", "sarah@example.com"]
  },
  {
    id: "7",
    title: "Lunch Break",
    date: new Date(2024, 2, 9), // March 9, 2024
    startTime: setMinutes(setHours(new Date(), 12), 0),
    endTime: setMinutes(setHours(new Date(), 13), 0),
    description: "Team lunch",
    location: "Cafeteria",
    category: "personal",
    isRecurring: false
  }
];

// Avatar data for attendees
const avatars = [
  { 
    email: "john@example.com", 
    name: "John Doe", 
    image: null,
    color: "bg-blue-500" 
  },
  { 
    email: "jane@example.com", 
    name: "Jane Smith", 
    image: null,
    color: "bg-green-500" 
  },
  { 
    email: "alex@example.com", 
    name: "Alex Johnson", 
    image: null,
    color: "bg-yellow-500" 
  },
  { 
    email: "sarah@example.com", 
    name: "Sarah Williams", 
    image: null,
    color: "bg-purple-500" 
  }
];

// Find avatar for an email
const getAvatarByEmail = (email: string) => {
  return avatars.find(a => a.email === email) || { 
    email, 
    name: email.split('@')[0], 
    image: null,
    color: "bg-gray-400" 
  };
};

export default function EnhancedCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 2, 8)); // March 8, 2024
  const [selectedView, setSelectedView] = useState<"day" | "week" | "month">("week");
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date(2024, 2, 1)); // March 2024
  const [selectedDay, setSelectedDay] = useState<number>(7);

  // Update selected day when selectedDate changes
  useEffect(() => {
    setSelectedDay(selectedDate.getDate());
  }, [selectedDate]);

  // Filter events for the current view
  const getEventsForView = () => {
    if (selectedView === "day") {
      return events.filter(event => 
        isSameDay(event.date, selectedDate)
      );
    } else if (selectedView === "week") {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      return events.filter(event => 
        (event.date >= weekStart && event.date <= weekEnd)
      );
    } else {
      return events.filter(event => 
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
      );
    }
  };

  // Month calendar 
  const MonthCalendar = () => {
    const month = displayMonth;
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    
    const header = (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button 
            onClick={() => setDisplayMonth(prevMonth => addMonths(prevMonth, -1))}
            className="p-1 mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-medium">March</h2>
          <button 
            onClick={() => setDisplayMonth(prevMonth => addMonths(prevMonth, 1))}
            className="p-1 ml-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
    
    const daysOfWeek = (
      <div className="grid grid-cols-7 text-center py-2">
        <div className="text-sm font-medium">Mo</div>
        <div className="text-sm font-medium">Tu</div>
        <div className="text-sm font-medium">We</div>
        <div className="text-sm font-medium">Th</div>
        <div className="text-sm font-medium">Fr</div>
        <div className="text-sm font-medium">Sa</div>
        <div className="text-sm font-medium">Su</div>
      </div>
    );

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, month);
        const isSelected = day.getDate() === selectedDay && isCurrentMonth;
        const isToday = new Date().getDate() === day.getDate() && 
                       new Date().getMonth() === day.getMonth() && 
                       new Date().getFullYear() === day.getFullYear();
                       
        // Get events for this day
        const dayEvents = events.filter(event => 
          isSameDay(event.date, cloneDay)
        );
                       
        days.push(
          <div
            key={day.toString()}
            className={cn(
              "p-1 min-h-[50px]",
              !isCurrentMonth && "text-muted-foreground opacity-30",
              isSelected && "bg-blue-50"
            )}
          >
            <button 
              onClick={() => {
                setSelectedDate(cloneDay);
                setSelectedDay(parseInt(formattedDate));
              }}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full mb-1",
                isToday && "bg-primary text-primary-foreground",
                isSelected && !isToday && "bg-blue-200"
              )}
            >
              {formattedDate}
            </button>
            <div className="space-y-1">
              {dayEvents.slice(0, 2).map((event, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "h-1.5 rounded-full mx-1",
                    categoryColors[event.category]?.bg || "bg-gray-300"
                  )}
                ></div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-0 border-t">
          {days}
        </div>
      );
      days = [];
    }
    
    return (
      <div className="border rounded-lg shadow bg-white">
        {header}
        {daysOfWeek}
        <div className="month min-h-[240px]">
          {rows}
        </div>
      </div>
    );
  };

  // Week view
  const WeekView = () => {
    const daysOfWeek = eachDayOfInterval({
      start: startOfWeek(selectedDate),
      end: endOfWeek(selectedDate)
    });
    
    // Get events for each day in the week view
    const hourEvents: Record<string, Event[]> = {};
    
    const viewEvents = getEventsForView();
    viewEvents.forEach(event => {
      const dayStr = format(event.date, 'yyyy-MM-dd');
      const hour = format(event.startTime, 'HH');
      const key = `${dayStr}-${hour}`;
      
      if (!hourEvents[key]) {
        hourEvents[key] = [];
      }
      
      hourEvents[key].push(event);
    });

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">March, 2024</h2>
            <div className="ml-2 flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>45 events</span>
            </div>
          </div>
          <div>
            <div className="bg-gray-100 rounded-full p-1 flex space-x-1">
              <button className="px-3 py-1 rounded-full">Day</button>
              <button className="px-3 py-1 rounded-full bg-white shadow-sm">Week</button>
              <button className="px-3 py-1 rounded-full">Month</button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-[auto,1fr,1fr,1fr] gap-0 border rounded-md overflow-hidden bg-white">
          {/* Time column */}
          <div className="border-r">
            <div className="h-20 border-b flex items-center justify-center">
              <div className="text-gray-500 text-sm">UTC +1</div>
            </div>
            <div className="h-24 border-b flex items-center justify-center">
              <div className="text-gray-500 text-sm">09 AM</div>
            </div>
            <div className="h-24 border-b flex items-center justify-center">
              <div className="text-gray-500 text-sm">10 AM</div>
            </div>
            <div className="h-24 border-b flex items-center justify-center">
              <div className="text-gray-500 text-sm">11 AM</div>
            </div>
            <div className="h-24 border-b flex items-center justify-center">
              <div className="text-gray-500 text-sm">12 PM</div>
            </div>
          </div>
          
          {/* Day columns */}
          {daysOfWeek.slice(1, 4).map((day, idx) => (
            <div key={idx} className="border-r">
              <div className="h-20 border-b p-3 text-center">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-semibold">{format(day, 'd')}</div>
                  <div className="text-gray-500">{format(day, 'EEEE')}</div>
                </div>
              </div>
              
              {/* 9 AM row */}
              <div className="h-24 border-b p-2 relative">
                {/* Find events at 9 AM */}
                {hourEvents[`${format(day, 'yyyy-MM-dd')}-09`]?.map((event, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "rounded-md p-2 h-full flex flex-col",
                      categoryColors[event.category]?.light || "bg-gray-50",
                      event.category === "work" ? "border-l-4 border-red-500" : 
                      event.category === "health" ? "border-l-4 border-green-500" : 
                      "border-l-4 border-blue-500"
                    )}
                  >
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      09 AM - 10 AM
                    </div>
                    
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center mt-2">
                        <div className="flex -space-x-2">
                          {event.attendees.slice(0, 3).map((email, i) => {
                            const avatar = getAvatarByEmail(email);
                            return (
                              <Avatar key={i} className="w-6 h-6 border border-white">
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
              
              {/* 10 AM row */}
              <div className="h-24 border-b p-2 relative">
                {hourEvents[`${format(day, 'yyyy-MM-dd')}-10`]?.map((event, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "rounded-md p-2 h-full flex flex-col",
                      categoryColors[event.category]?.light || "bg-gray-50",
                      event.category === "work" ? "border-l-4 border-red-500" : 
                      event.category === "health" ? "border-l-4 border-green-500" : 
                      "border-l-4 border-blue-500"
                    )}
                  >
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      10 AM - 12 PM
                    </div>
                    
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center mt-2">
                        <div className="flex -space-x-2">
                          {event.attendees.slice(0, 3).map((email, i) => {
                            const avatar = getAvatarByEmail(email);
                            return (
                              <Avatar key={i} className="w-6 h-6 border border-white">
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
              
              {/* 11 AM row */}
              <div className="h-24 border-b p-2 relative">
                {hourEvents[`${format(day, 'yyyy-MM-dd')}-11`]?.map((event, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "rounded-md p-2 h-full flex flex-col",
                      categoryColors[event.category]?.light || "bg-gray-50",
                      event.category === "work" ? "border-l-4 border-red-500" : 
                      event.category === "health" ? "border-l-4 border-green-500" : 
                      "border-l-4 border-blue-500"
                    )}
                  >
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      11 AM - 01 PM
                    </div>
                    
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center mt-2">
                        <div className="flex -space-x-2">
                          {event.attendees.slice(0, 3).map((email, i) => {
                            const avatar = getAvatarByEmail(email);
                            return (
                              <Avatar key={i} className="w-6 h-6 border border-white">
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
              
              {/* 12 PM row */}
              <div className="h-24 border-b p-2 relative">
                {hourEvents[`${format(day, 'yyyy-MM-dd')}-12`]?.map((event, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "rounded-md p-2 h-full flex flex-col",
                      categoryColors[event.category]?.light || "bg-gray-50",
                      event.category === "work" ? "border-l-4 border-red-500" : 
                      event.category === "health" ? "border-l-4 border-green-500" : 
                      event.category === "personal" ? "border-l-4 border-yellow-500" : 
                      "border-l-4 border-blue-500"
                    )}
                  >
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      12 PM - 01 PM
                    </div>
                    
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center mt-2">
                        <div className="flex -space-x-2">
                          {event.attendees.slice(0, 3).map((email, i) => {
                            const avatar = getAvatarByEmail(email);
                            return (
                              <Avatar key={i} className="w-6 h-6 border border-white">
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
            </div>
          ))}
        </div>
      </div>
    );
  };

  // My Schedule component
  const MySchedule = () => {
    return (
      <div className="border rounded-lg mt-4 p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">My Schedule</h3>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span>Daily Standup</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span>Weekly Review</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span>Team Meeting</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span>Lunch Break</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span>Client Meeting</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span>Other</span>
          </div>
        </div>
      </div>
    );
  };

  // Categories component
  const Categories = () => {
    return (
      <div className="border rounded-lg mt-4 p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Categories</h3>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
              <span>Work</span>
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">18</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r p-4 bg-white">
        <MonthCalendar />
        <MySchedule />
        <Categories />
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-4">
        <WeekView />
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