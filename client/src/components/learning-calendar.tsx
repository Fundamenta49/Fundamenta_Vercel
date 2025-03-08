import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Bell, Calendar as CalendarIcon, Clock, BellRing, Clock8, CalendarDays, Settings } from "lucide-react";
import { format } from "date-fns";

interface NotificationPreference {
  feature: string;
  enabled: boolean;
  frequency: "daily" | "weekly" | "custom";
  urgency: "urgent" | "passive";
  customTime?: string;
}

export default function LearningCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [settingsOpen, setSettingsOpen] = useState(false);
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

  const [workSchedule, setWorkSchedule] = useState({
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
    workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  });

  const [calendarSync, setCalendarSync] = useState({
    googleEnabled: false,
    appleEnabled: false,
    outlookEnabled: false
  });

  const handleNotificationToggle = (feature: string) => {
    setNotificationPrefs(prefs =>
      prefs.map(pref =>
        pref.feature === feature ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const handleFrequencyChange = (feature: string, frequency: "daily" | "weekly" | "custom") => {
    setNotificationPrefs(prefs =>
      prefs.map(pref =>
        pref.feature === feature ? { ...pref, frequency } : pref
      )
    );
  };

  const handleUrgencyChange = (feature: string, urgency: "urgent" | "passive") => {
    setNotificationPrefs(prefs =>
      prefs.map(pref =>
        pref.feature === feature ? { ...pref, urgency } : pref
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Learning Schedule
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
          <CardDescription>
            Plan your learning journey and set reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
              initialFocus
            />

            <div className="space-y-4">
              <h3 className="font-medium">Upcoming Reminders</h3>
              {notificationPrefs
                .filter(pref => pref.enabled)
                .map(pref => (
                  <div key={pref.feature} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-2">
                      {pref.urgency === "urgent" ? 
                        <BellRing className="h-4 w-4 text-red-500" /> : 
                        <Bell className="h-4 w-4 text-muted-foreground" />
                      }
                      <span>{pref.feature}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {pref.frequency}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calendar Settings</DialogTitle>
            <DialogDescription>
              Customize your learning schedule and notification preferences
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationPrefs.map((pref) => (
                  <div key={pref.feature} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${pref.feature}-toggle`} className="flex items-center gap-2">
                        {pref.urgency === "urgent" ? 
                          <BellRing className="h-4 w-4 text-red-500" /> : 
                          <Bell className="h-4 w-4 text-muted-foreground" />
                        }
                        {pref.feature}
                      </Label>
                      <Switch
                        id={`${pref.feature}-toggle`}
                        checked={pref.enabled}
                        onCheckedChange={() => handleNotificationToggle(pref.feature)}
                      />
                    </div>
                    {pref.enabled && (
                      <div className="pl-6 space-y-2">
                        <div className="flex items-center gap-2">
                          <Select
                            defaultValue={pref.frequency}
                            onValueChange={(value: "daily" | "weekly" | "custom") =>
                              handleFrequencyChange(pref.feature, value)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            defaultValue={pref.urgency}
                            onValueChange={(value: "urgent" | "passive") =>
                              handleUrgencyChange(pref.feature, value)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select urgency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="urgent">Urgent Alert</SelectItem>
                              <SelectItem value="passive">Passive Reminder</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock8 className="h-5 w-5 text-primary" />
                  Smart Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Work Schedule Integration</Label>
                  <Switch
                    checked={workSchedule.enabled}
                    onCheckedChange={(checked) => 
                      setWorkSchedule(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                </div>
                {workSchedule.enabled && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Start Time</Label>
                        <input
                          type="time"
                          value={workSchedule.startTime}
                          onChange={(e) => 
                            setWorkSchedule(prev => ({ ...prev, startTime: e.target.value }))
                          }
                          className="w-full mt-1 rounded-md border"
                        />
                      </div>
                      <div>
                        <Label>End Time</Label>
                        <input
                          type="time"
                          value={workSchedule.endTime}
                          onChange={(e) => 
                            setWorkSchedule(prev => ({ ...prev, endTime: e.target.value }))
                          }
                          className="w-full mt-1 rounded-md border"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Calendar Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Google Calendar</Label>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Apple Calendar</Label>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Outlook Calendar</Label>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}