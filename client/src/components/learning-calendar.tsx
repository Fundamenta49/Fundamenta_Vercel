import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, Calendar as CalendarIcon, BellRing, Clock8, CalendarDays, Settings } from "lucide-react";

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
          <div className="grid gap-8 md:grid-cols-2">
            {/* Calendar Section */}
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm"
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </div>

            {/* Reminders Section */}
            <div>
              <h3 className="font-medium mb-4">Upcoming Reminders</h3>
              <div className="space-y-3">
                {notificationPrefs
                  .filter(pref => pref.enabled)
                  .map(pref => (
                    <div 
                      key={pref.feature} 
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="shrink-0">
                          {pref.urgency === "urgent" ? 
                            <BellRing className="h-4 w-4 text-red-500" /> : 
                            <Bell className="h-4 w-4 text-muted-foreground" />
                          }
                        </div>
                        <div className="truncate">
                          <span className="block truncate text-sm font-medium">
                            {pref.feature}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 shrink-0 w-20 text-right">
                        <span className="text-sm text-muted-foreground">
                          {pref.frequency}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
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