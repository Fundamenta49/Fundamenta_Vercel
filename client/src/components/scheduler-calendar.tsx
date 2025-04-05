import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Trash,
  Share,
  CalendarDays,
  Users,
  AlertTriangle,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addHours, setHours, setMinutes, addDays, isToday, isAfter, isBefore, startOfWeek, endOfWeek, eachDayOfInterval, getDay, differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
}

// Mock data for different views
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Team Meeting",
    date: new Date(new Date().setDate(new Date().getDate())),
    startTime: setMinutes(setHours(new Date(), 9), 0),
    endTime: setMinutes(setHours(new Date(), 10), 0),
    description: "Weekly team sync",
    location: "Conference Room A",
    category: "work",
    isRecurring: true,
    recurrencePattern: "weekly",
    attendees: ["john@example.com", "jane@example.com"]
  },
  {
    id: "2",
    title: "Cooking Class",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: setMinutes(setHours(new Date(), 14), 0),
    endTime: setMinutes(setHours(new Date(), 16), 0),
    description: "Learning Italian cuisine",
    location: "Community Center",
    category: "learning",
    isRecurring: false,
    attendees: ["me@example.com", "chef@example.com"]
  },
  {
    id: "3",
    title: "Doctor Appointment",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: setMinutes(setHours(new Date(), 11), 0),
    endTime: setMinutes(setHours(new Date(), 12), 0),
    description: "Annual checkup",
    location: "Medical Center",
    category: "health",
    isRecurring: false,
    notifications: [30, 60]
  },
  {
    id: "4",
    title: "Fitness Class",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: setMinutes(setHours(new Date(), 18), 0),
    endTime: setMinutes(setHours(new Date(), 19), 0),
    description: "HIIT Workout",
    location: "Local Gym",
    category: "fitness",
    isRecurring: true,
    recurrencePattern: "weekly",
  },
  {
    id: "5",
    title: "Budget Review",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    startTime: setMinutes(setHours(new Date(), 15), 0),
    endTime: setMinutes(setHours(new Date(), 16), 0),
    description: "Monthly budget planning",
    location: "Home Office",
    category: "finance",
    isRecurring: true,
    recurrencePattern: "monthly",
  }
];

// Category colors
const categoryColors: Record<string, { bg: string, text: string, border: string }> = {
  work: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  learning: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  health: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  fitness: { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-300" },
  finance: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  personal: { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-300" },
  other: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" }
};

// Time selection options
const timeOptions = [
  "12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM", 
  "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM", 
  "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", 
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", 
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", 
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", 
  "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
];

export default function SchedulerCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState("day");
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const { toast } = useToast();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Form state
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    id: "",
    title: "",
    date: new Date(),
    startTime: setMinutes(setHours(new Date(), 9), 0),
    endTime: setMinutes(setHours(new Date(), 10), 0),
    description: "",
    location: "",
    category: "personal",
    isRecurring: false,
    recurrencePattern: "none",
    attendees: [],
    notifications: [30]
  });

  // Reset form when the dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setShowNewEventForm(false);
      setEditingEvent(null);
      setSelectedEvent(null);
    }
  }, [isOpen]);

  // Filter events for the current view
  const getEventsForView = () => {
    if (!selectedDate) return [];
    
    if (selectedView === "day") {
      return events.filter(event => 
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
      );
    } else if (selectedView === "week") {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      return events.filter(event => 
        !isBefore(event.date, weekStart) && !isAfter(event.date, weekEnd)
      );
    } else if (selectedView === "month") {
      return events.filter(event => 
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
      );
    }
    return events;
  };

  // Handle form submission
  const handleSaveEvent = () => {
    if (!newEvent.title) {
      toast({
        title: "Missing Information",
        description: "Please provide a title for your event",
        variant: "destructive"
      });
      return;
    }

    const eventToSave: Event = {
      id: editingEvent ? editingEvent.id : Math.random().toString(36).substr(2, 9),
      title: newEvent.title || "Untitled Event",
      date: newEvent.date || new Date(),
      startTime: newEvent.startTime || new Date(),
      endTime: newEvent.endTime || addHours(newEvent.startTime || new Date(), 1),
      description: newEvent.description || "",
      location: newEvent.location || "",
      category: newEvent.category || "personal",
      isRecurring: newEvent.isRecurring || false,
      recurrencePattern: newEvent.isRecurring ? newEvent.recurrencePattern : undefined,
      attendees: newEvent.attendees || [],
      notifications: newEvent.notifications || [30]
    };

    if (editingEvent) {
      setEvents(events.map(event => event.id === editingEvent.id ? eventToSave : event));
      toast({
        title: "Event Updated",
        description: "Your event has been successfully updated",
      });
    } else {
      setEvents([...events, eventToSave]);
      toast({
        title: "Event Created",
        description: "Your event has been successfully added to your calendar",
      });
    }
    
    setShowNewEventForm(false);
    setEditingEvent(null);
    setNewEvent({
      id: "",
      title: "",
      date: new Date(),
      startTime: setMinutes(setHours(new Date(), 9), 0),
      endTime: setMinutes(setHours(new Date(), 10), 0),
      description: "",
      location: "",
      category: "personal",
      isRecurring: false,
      recurrencePattern: "none",
      attendees: [],
      notifications: [30]
    });
  };

  // Handle event deletion
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    setSelectedEvent(null);
    toast({
      title: "Event Deleted",
      description: "The event has been removed from your calendar",
    });
  };

  // Edit an existing event
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      ...event
    });
    setShowNewEventForm(true);
    setSelectedEvent(null);
  };

  // Get day column for week view
  const WeekColumn = ({ dayDate }: { dayDate: Date }) => {
    const todayEvents = events.filter(event => 
      event.date.getDate() === dayDate.getDate() &&
      event.date.getMonth() === dayDate.getMonth() &&
      event.date.getFullYear() === dayDate.getFullYear()
    );
    
    const isCurrentDay = isToday(dayDate);
    
    return (
      <div className={cn(
        "flex-1 min-w-[90px] sm:min-w-[120px]",
        isCurrentDay ? "bg-blue-50" : "bg-white"
      )}>
        <div className={cn(
          "text-center py-2 font-medium border-b",
          isCurrentDay ? "bg-blue-100 text-blue-700" : "text-gray-700 bg-gray-50"
        )}>
          <div className="text-xs uppercase">{format(dayDate, 'EEE')}</div>
          <div className={cn(
            "inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full",
            isCurrentDay ? "bg-blue-600 text-white" : ""
          )}>
            {format(dayDate, 'd')}
          </div>
        </div>
        <div className="p-1">
          {todayEvents.length > 0 ? (
            todayEvents.map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={cn(
                  "w-full text-left mb-1 p-1 rounded text-xs font-medium truncate",
                  categoryColors[event.category]?.bg || "bg-gray-100",
                  categoryColors[event.category]?.text || "text-gray-700",
                  "border-l-2",
                  categoryColors[event.category]?.border || "border-gray-300"
                )}
              >
                <div className="font-semibold truncate">{event.title}</div>
                <div className="text-xs opacity-80">{format(event.startTime, 'h:mm a')}</div>
              </button>
            ))
          ) : (
            <div className="text-center text-gray-400 text-xs py-4">No events</div>
          )}
        </div>
      </div>
    );
  };

  // Day view
  const DayView = () => {
    const dayEvents = getEventsForView();
    
    return (
      <div className="flex flex-col h-full">
        <div className="text-lg font-semibold mb-2">
          {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
          {isToday(selectedDate!) && (
            <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Today</span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDate(addDays(selectedDate!, -1))}
            className="flex-1 min-w-[100px]"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Previous Day</span>
            <span className="sm:hidden">Prev</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDate(new Date())}
            className="flex-1 min-w-[80px]"
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDate(addDays(selectedDate!, 1))}
            className="flex-1 min-w-[100px]"
          >
            <span className="hidden sm:inline">Next Day</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          {dayEvents.length > 0 ? (
            <div className="space-y-2">
              {dayEvents.map(event => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg",
                    categoryColors[event.category]?.bg || "bg-gray-100",
                    categoryColors[event.category]?.text || "text-gray-700",
                    "border-l-4",
                    categoryColors[event.category]?.border || "border-gray-300"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-semibold text-base">{event.title}</div>
                    <div className="text-sm">{format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}</div>
                  </div>
                  {event.location && (
                    <div className="text-sm mt-1 opacity-90">{event.location}</div>
                  )}
                  {event.description && (
                    <div className="text-sm mt-2 opacity-80">{event.description}</div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No events scheduled for this day</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => {
                  setShowNewEventForm(true);
                  setNewEvent({
                    ...newEvent,
                    date: selectedDate
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Event
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    );
  };

  // Week view
  const WeekView = () => {
    const weekStart = startOfWeek(selectedDate!);
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(selectedDate!)
    });
    
    return (
      <div className="flex flex-col h-full">
        <div className="text-lg font-semibold mb-2">
          Week of {format(weekStart, 'MMMM d, yyyy')}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDate(addDays(weekStart, -7))}
            className="flex-1 min-w-[100px]"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Previous Week</span>
            <span className="sm:hidden">Prev</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDate(new Date())}
            className="flex-1 min-w-[80px]"
          >
            <span className="hidden sm:inline">Current Week</span>
            <span className="sm:hidden">This Week</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDate(addDays(weekStart, 7))}
            className="flex-1 min-w-[100px]"
          >
            <span className="hidden sm:inline">Next Week</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="flex divide-x border rounded-lg min-w-[600px] sm:min-w-[800px]">
            {weekDays.map((day) => (
              <WeekColumn key={day.toISOString()} dayDate={day} />
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  // Month view with compact event display
  const MonthView = () => {
    if (!selectedDate) return null;
    
    return (
      <div className="flex flex-col h-full">
        <div className="text-lg font-semibold mb-2">
          {format(selectedDate, 'MMMM yyyy')}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setSelectedDate(newDate);
            }}
            className="flex-1 min-w-[100px]"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Previous Month</span>
            <span className="sm:hidden">Prev</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDate(new Date())}
            className="flex-1 min-w-[80px]"
          >
            <span className="hidden sm:inline">Current Month</span>
            <span className="sm:hidden">Today</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setSelectedDate(newDate);
            }}
            className="flex-1 min-w-[100px]"
          >
            <span className="hidden sm:inline">Next Month</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={calendarDate}
            onSelect={(date) => {
              if (date) {
                setCalendarDate(date);
                setSelectedDate(date);
                setSelectedView("day");
              }
            }}
            className="rounded-md border w-full"
            month={selectedDate}
            onMonthChange={setSelectedDate}
            components={{
              DayContent: (props) => {
                const date = props.date;
                const dayEvents = events.filter(event => 
                  event.date.getDate() === date.getDate() &&
                  event.date.getMonth() === date.getMonth() &&
                  event.date.getFullYear() === date.getFullYear()
                );
                
                return (
                  <div className="w-full h-full min-h-[70px]">
                    <div className="text-center py-1">
                      {props.date.getDate()}
                    </div>
                    <div className="px-0.5">
                      {dayEvents.slice(0, 2).map((event, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "text-xs truncate rounded px-1 py-0.5 mb-0.5",
                            categoryColors[event.category]?.bg,
                            categoryColors[event.category]?.text
                          )}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 truncate">
                          + {dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            }}
          />
        </div>
      </div>
    );
  };

  // Event details view
  const EventDetailsView = () => {
    if (!selectedEvent) return null;
    
    const eventColors = categoryColors[selectedEvent.category] || categoryColors.personal;
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>
                {format(selectedEvent.date, 'EEEE, MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {format(selectedEvent.startTime, 'h:mm a')} - {format(selectedEvent.endTime, 'h:mm a')}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditEvent(selectedEvent)}
            >
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteEvent(selectedEvent.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className={cn(
          "inline-block px-2 py-1 rounded-full text-xs font-medium",
          eventColors.bg,
          eventColors.text
        )}>
          {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)}
        </div>
        
        {selectedEvent.location && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">Location</h4>
            <div className="text-sm bg-gray-50 p-2 rounded">
              {selectedEvent.location}
            </div>
          </div>
        )}
        
        {selectedEvent.description && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">Description</h4>
            <div className="text-sm bg-gray-50 p-2 rounded whitespace-pre-wrap">
              {selectedEvent.description}
            </div>
          </div>
        )}
        
        {selectedEvent.isRecurring && selectedEvent.recurrencePattern && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">Repeats</h4>
            <div className="text-sm bg-gray-50 p-2 rounded">
              {selectedEvent.recurrencePattern === "daily" && "Daily"}
              {selectedEvent.recurrencePattern === "weekly" && "Weekly"}
              {selectedEvent.recurrencePattern === "monthly" && "Monthly"}
            </div>
          </div>
        )}
        
        {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">Attendees</h4>
            <div className="text-sm bg-gray-50 p-2 rounded space-y-1">
              {selectedEvent.attendees.map((attendee, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-xs">
                    {attendee.charAt(0).toUpperCase()}
                  </div>
                  {attendee}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-4 flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedEvent(null)}
          >
            Back to Calendar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
          >
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
    );
  };

  // New Event Form
  const EventForm = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{editingEvent ? "Edit Event" : "New Event"}</h3>
        
        <div>
          <Label htmlFor="event-title">Event Title</Label>
          <Input 
            id="event-title"
            placeholder="Add a title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newEvent.date ? format(newEvent.date, 'PPP') : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newEvent.date}
                  onSelect={(date) => setNewEvent({...newEvent, date: date || new Date()})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label>Category</Label>
            <Select 
              value={newEvent.category} 
              onValueChange={(value) => setNewEvent({...newEvent, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Time</Label>
            <Select 
              value={format(newEvent.startTime || new Date(), 'h:mm a')} 
              onValueChange={(value) => {
                const [hours, minutes] = value.replace(/\s(AM|PM)/, '').split(':');
                const isPM = value.includes('PM');
                
                let hour = parseInt(hours);
                if (isPM && hour < 12) hour += 12;
                if (!isPM && hour === 12) hour = 0;
                
                const newTime = setMinutes(setHours(new Date(), hour), parseInt(minutes));
                setNewEvent({
                  ...newEvent, 
                  startTime: newTime,
                  // If end time is before new start time, adjust it
                  endTime: isBefore(newEvent.endTime!, newTime) ? addHours(newTime, 1) : newEvent.endTime
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>End Time</Label>
            <Select 
              value={format(newEvent.endTime || addHours(newEvent.startTime || new Date(), 1), 'h:mm a')} 
              onValueChange={(value) => {
                const [hours, minutes] = value.replace(/\s(AM|PM)/, '').split(':');
                const isPM = value.includes('PM');
                
                let hour = parseInt(hours);
                if (isPM && hour < 12) hour += 12;
                if (!isPM && hour === 12) hour = 0;
                
                const newTime = setMinutes(setHours(new Date(), hour), parseInt(minutes));
                setNewEvent({...newEvent, endTime: newTime});
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="event-location">Location</Label>
          <Input 
            id="event-location"
            placeholder="Add a location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="event-description">Description</Label>
          <Textarea 
            id="event-description"
            placeholder="Add details"
            className="min-h-[100px]"
            value={newEvent.description}
            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recurring-event"
              checked={newEvent.isRecurring}
              onChange={(e) => setNewEvent({...newEvent, isRecurring: e.target.checked})}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="recurring-event" className="text-sm font-medium cursor-pointer">
              Recurring Event
            </Label>
          </div>
          
          {newEvent.isRecurring && (
            <Select 
              value={newEvent.recurrencePattern || 'none'} 
              onValueChange={(value) => setNewEvent({...newEvent, recurrencePattern: value})}
            >
              <SelectTrigger className="h-8 w-auto min-w-[120px]">
                <SelectValue placeholder="Pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="pt-4 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowNewEventForm(false);
              setEditingEvent(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveEvent}>
            {editingEvent ? "Update Event" : "Save Event"}
          </Button>
        </div>
      </div>
    );
  };

  // Main calendar UI
  const CalendarUI = () => {
    return (
      <div className="flex flex-col h-full">
        <header className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Calendar</h2>
            <Button 
              onClick={() => {
                setShowNewEventForm(true);
                setNewEvent({
                  ...newEvent,
                  date: selectedDate
                });
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              New Event
            </Button>
          </div>
          
          <Tabs 
            defaultValue="day" 
            value={selectedView}
            onValueChange={setSelectedView}
            className="mt-4"
          >
            <TabsList className="grid grid-cols-3 w-[300px]">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </header>
        
        <div className="flex-1 overflow-hidden">
          {selectedView === "day" && <DayView />}
          {selectedView === "week" && <WeekView />}
          {selectedView === "month" && <MonthView />}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Sidebar trigger for the calendar */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left text-gray-700 hover:bg-gray-50">
            <CalendarDays className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Calendar</span>
          </button>
        </DialogTrigger>
        
        <DialogContent className="w-full max-w-5xl h-[85vh] p-0 flex flex-col overflow-hidden">
          <div className="p-6 flex-1 overflow-hidden flex flex-col">
            {selectedEvent ? (
              <EventDetailsView />
            ) : showNewEventForm ? (
              <EventForm />
            ) : (
              <CalendarUI />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}