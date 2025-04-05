import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Calendar as CalendarIcon, 
  BellRing, 
  CalendarDays, 
  Settings, 
  Globe, 
  Clock, 
  Tag, 
  CheckCircle2,
  PlusCircle 
} from "lucide-react";
import { format, addMonths, addDays, isSameDay, startOfMonth, endOfMonth, isSameMonth } from "date-fns";

interface NotificationPreference {
  feature: string;
  enabled: boolean;
  frequency: "daily" | "weekly" | "custom";
  urgency: "urgent" | "passive";
  customTime?: string;
}

interface LearningEvent {
  id: string;
  title: string;
  date: Date;
  category: "skill" | "goal" | "project" | "webinar" | "other";
  completed: boolean;
}

export default function LearningCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userTimeZone, setUserTimeZone] = useState<string>("");
  const [userLocale, setUserLocale] = useState<string>("en-US");
  
  // Set timezone and locale based on user's browser
  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimeZone(timeZone);
      
      const locale = navigator.languages && navigator.languages.length 
        ? navigator.languages[0] 
        : navigator.language || "en-US";
      setUserLocale(locale);
    } catch (error) {
      console.error("Could not detect user's timezone or locale", error);
    }
  }, []);
  
  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreference[]>([
    { 
      feature: "Skill Building", 
      enabled: true, 
      frequency: "weekly",
      urgency: "passive"
    },
    { 
      feature: "Learning Goals", 
      enabled: true, 
      frequency: "daily",
      urgency: "urgent"
    },
    { 
      feature: "Practice Projects", 
      enabled: true, 
      frequency: "weekly",
      urgency: "passive"
    },
    { 
      feature: "Emergency Guidance", 
      enabled: true, 
      frequency: "daily",
      urgency: "urgent"
    }
  ]);

  // Work schedule settings
  const [workSchedule, setWorkSchedule] = useState({
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
    workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  });
  
  // Generate some sample learning events for the current month
  const generateEvents = (baseDate: Date): LearningEvent[] => {
    const monthStart = startOfMonth(baseDate);
    const monthEnd = endOfMonth(baseDate);
    
    const events: LearningEvent[] = [];
    
    // Add some skill-building events
    events.push({
      id: "skill-1",
      title: "Advanced React Patterns",
      date: addDays(monthStart, 4),
      category: "skill",
      completed: true
    });
    
    events.push({
      id: "skill-2",
      title: "TypeScript Fundamentals",
      date: addDays(monthStart, 12),
      category: "skill",
      completed: false
    });
    
    // Add some learning goals
    events.push({
      id: "goal-1",
      title: "Complete Frontend Course",
      date: addDays(monthStart, 8),
      category: "goal",
      completed: false
    });
    
    // Add some projects
    events.push({
      id: "project-1",
      title: "Portfolio Website",
      date: addDays(monthStart, 15),
      category: "project",
      completed: false
    });
    
    // Add some webinars
    events.push({
      id: "webinar-1",
      title: "State Management Webinar",
      date: addDays(monthStart, 22),
      category: "webinar",
      completed: false
    });
    
    return events;
  };
  
  const [events, setEvents] = useState<LearningEvent[]>([]);
  
  // Update events when the month changes
  useEffect(() => {
    setEvents(generateEvents(calendarView));
  }, [calendarView]);
  
  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => 
    selectedDate && isSameDay(event.date, selectedDate)
  );
  
  // Category styling
  const categoryStyles = {
    skill: { bg: "bg-blue-100", text: "text-blue-700", badge: "bg-blue-50 text-blue-700 border-blue-200" },
    goal: { bg: "bg-green-100", text: "text-green-700", badge: "bg-green-50 text-green-700 border-green-200" },
    project: { bg: "bg-purple-100", text: "text-purple-700", badge: "bg-purple-50 text-purple-700 border-purple-200" },
    webinar: { bg: "bg-amber-100", text: "text-amber-700", badge: "bg-amber-50 text-amber-700 border-amber-200" },
    other: { bg: "bg-gray-100", text: "text-gray-700", badge: "bg-gray-50 text-gray-700 border-gray-200" }
  };
  
  // Format date with user's locale
  const formatDateWithLocale = (date: Date, formatStr: string) => {
    try {
      return new Intl.DateTimeFormat(userLocale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      // Fallback if Intl API fails
      return format(date, formatStr);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-slate-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Learning Schedule
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center text-sm text-muted-foreground gap-2">
                <Globe className="h-4 w-4" />
                <span>{userTimeZone || "Local timezone"}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
          <CardDescription>
            Plan your learning journey, track educational goals, and set skill development reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-3 h-auto lg:h-[600px] divide-x divide-y lg:divide-y-0">
            {/* Full calendar view */}
            <div className="lg:col-span-2 p-2 sm:p-4">
              <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
                <div className="p-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h3 className="font-medium text-base text-center sm:text-left">
                    {format(calendarView, 'MMMM yyyy')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCalendarView(prev => addMonths(prev, -1))}
                      className="flex-1 sm:flex-none"
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCalendarView(new Date())}
                      className="flex-1 sm:flex-none"
                    >
                      Today
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCalendarView(prev => addMonths(prev, 1))}
                      className="flex-1 sm:flex-none"
                    >
                      Next
                    </Button>
                  </div>
                </div>

                <div className="flex-grow">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={calendarView}
                    onMonthChange={setCalendarView}
                    className="w-full h-full"
                    disabled={(date) => date < new Date("2023-01-01")}
                    initialFocus
                    modifiers={{
                      event: events.map(e => e.date)
                    }}
                    modifiersStyles={{
                      event: { 
                        fontWeight: 'bold', 
                        border: '2px solid var(--primary)' 
                      }
                    }}
                  />
                </div>
                
                <div className="p-3 border-t flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-muted-foreground justify-center sm:justify-start w-full sm:w-auto">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Skills</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Goals</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span>Projects</span>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-center sm:text-right">
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    {format(new Date(), 'PPp')}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Events panel for selected date */}
            <div className="p-4 flex flex-col h-[400px] lg:h-full">
              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <h3 className="font-medium text-base">
                  {selectedDate ? formatDateWithLocale(selectedDate, 'PPPP') : 'Select a date'}
                </h3>
                {selectedDate && (
                  <p className="text-sm text-muted-foreground">
                    {isSameDay(selectedDate, new Date()) ? 'Today' : 
                     format(selectedDate, 'EEEE')}
                  </p>
                )}
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  LEARNING EVENTS
                </h4>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span className="text-xs">Add</span>
                </Button>
              </div>
              
              {selectedDateEvents.length > 0 ? (
                <ScrollArea className="flex-grow pr-4">
                  <div className="space-y-3">
                    {selectedDateEvents.map(event => (
                      <div 
                        key={event.id}
                        className={`p-3 rounded-lg border ${event.completed ? 'bg-slate-50 opacity-80' : 'bg-white'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className={categoryStyles[event.category].badge}>
                            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                          </Badge>
                          {event.completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <h5 className={`font-medium mb-1 ${event.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {event.title}
                        </h5>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>All day</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                  <CalendarDays className="h-10 w-10 mb-2 opacity-20" />
                  <p className="mb-1">No learning events</p>
                  <p className="text-sm">
                    {selectedDate && isSameDay(selectedDate, new Date()) 
                      ? "You don't have any learning activities scheduled for today." 
                      : "Select a date with events or add a new one."}
                  </p>
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  UPCOMING REMINDERS
                </h4>
                <div className="space-y-2">
                  {notificationPrefs
                    .filter(pref => pref.enabled)
                    .slice(0, 2)
                    .map(pref => (
                      <div 
                        key={pref.feature} 
                        className="flex items-center justify-between bg-card rounded-lg border p-2"
                      >
                        <div className="flex-grow flex items-center gap-2 min-w-0">
                          <div className="flex-shrink-0">
                            {pref.urgency === "urgent" ? 
                              <BellRing className="h-4 w-4 text-red-500" /> : 
                              <Bell className="h-4 w-4 text-muted-foreground" />
                            }
                          </div>
                          <div className="min-w-0">
                            <span className="block font-medium text-xs truncate">
                              {pref.feature}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className="text-xs text-muted-foreground inline-block">
                            {pref.frequency}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 py-3 text-center text-sm text-muted-foreground">
          Last synced with learning platforms: {format(new Date(), 'PP')}
        </CardFooter>
      </Card>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[500px] top-[10vh] left-1/2 translate-x-[-50%] fixed sm:fixed md:fixed">
          <DialogHeader>
            <DialogTitle>Calendar Settings</DialogTitle>
            <DialogDescription>
              Customize your learning schedule and notification preferences
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Notification Preferences</h4>
              {notificationPrefs.map((pref) => (
                <div key={pref.feature} className="flex items-center space-x-4">
                  <Switch
                    id={`${pref.feature}-toggle`}
                    checked={pref.enabled}
                    onCheckedChange={(checked) => {
                      setNotificationPrefs(prefs =>
                        prefs.map(p =>
                          p.feature === pref.feature ? { ...p, enabled: checked } : p
                        )
                      );
                    }}
                  />
                  <Label htmlFor={`${pref.feature}-toggle`}>{pref.feature}</Label>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium leading-none">Smart Scheduling</h4>
              <div className="flex items-center space-x-4">
                <Switch
                  id="work-schedule"
                  checked={workSchedule.enabled}
                  onCheckedChange={(checked) => 
                    setWorkSchedule(prev => ({ ...prev, enabled: checked }))
                  }
                />
                <Label htmlFor="work-schedule">Work Schedule Integration</Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium leading-none">Calendar Integration</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Connect Google Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Connect Apple Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Connect Outlook Calendar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}