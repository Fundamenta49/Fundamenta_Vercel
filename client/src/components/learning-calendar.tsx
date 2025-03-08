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
import { Bell, Calendar as CalendarIcon, BellRing, CalendarDays, Settings, Check } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
  
  // Handle notification preference changes
  const handleFrequencyChange = (feature: string, value: "daily" | "weekly" | "custom") => {
    setNotificationPrefs(prev => 
      prev.map(pref => 
        pref.feature === feature ? { ...pref, frequency: value } : pref
      )
    );
  };

  const [workSchedule, setWorkSchedule] = useState({
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
    workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  });

  const [calendarSync, setCalendarSync] = useState({
    google: { connected: false, connecting: false },
    apple: { connected: false, connecting: false },
    outlook: { connected: false, connecting: false }
  });

  const handleNotificationToggle = (feature: string) => {
    setNotificationPrefs(prefs =>
      prefs.map(pref =>
        pref.feature === feature ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
    toast({
      title: `${feature} notifications ${notificationPrefs.find(p => p.feature === feature)?.enabled ? 'disabled' : 'enabled'}`,
      description: "Your notification preferences have been updated",
    });
  };

  const handleFrequencyChange = (feature: string, frequency: "daily" | "weekly" | "custom") => {
    setNotificationPrefs(prefs =>
      prefs.map(pref =>
        pref.feature === feature ? { ...pref, frequency } : pref
      )
    );
    toast({
      title: "Notification frequency updated",
      description: `${feature} notifications will now be sent ${frequency}`,
    });
  };

  const handleUrgencyChange = (feature: string, urgency: "urgent" | "passive") => {
    setNotificationPrefs(prefs =>
      prefs.map(pref =>
        pref.feature === feature ? { ...pref, urgency } : pref
      )
    );
    toast({
      title: "Notification urgency updated",
      description: `${feature} notifications set to ${urgency} priority`,
    });
  };

  const handleWorkScheduleToggle = (checked: boolean) => {
    setWorkSchedule(prev => ({ ...prev, enabled: checked }));
    toast({
      title: `Work schedule integration ${checked ? 'enabled' : 'disabled'}`,
      description: checked ? "Learning schedule will adapt to your work hours" : "Work schedule integration turned off",
    });
  };

  const handleWorkScheduleToggle = (enabled: boolean) => {
    setWorkSchedule(prev => ({
      ...prev,
      enabled
    }));
    
    toast({
      title: enabled ? "Work Schedule Enabled" : "Work Schedule Disabled",
      description: enabled 
        ? "Learning activities will be scheduled around your work hours" 
        : "Work schedule integration has been disabled",
    });
  };

  const handleCalendarConnect = async (type: 'google' | 'apple' | 'outlook') => {
    setCalendarSync(prev => ({
      ...prev,
      [type]: { ...prev[type], connecting: true }
    }));

    // Simulate API call
    setTimeout(() => {
      setCalendarSync(prev => ({
        ...prev,
        [type]: { connected: true, connecting: false }
      }));

      toast({
        title: "Calendar connected",
        description: `Successfully connected to ${type.charAt(0).toUpperCase() + type.slice(1)} Calendar`,
      });
    }, 1500);
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Calendar Settings</DialogTitle>
            <DialogDescription>
              Customize your learning schedule and notification preferences
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Notification Preferences</h4>
                {notificationPrefs.map((pref) => (
                  <div key={pref.feature} className="mb-6 space-y-4 bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${pref.feature}-toggle`} className="text-base">
                        {pref.feature}
                      </Label>
                      <Switch
                        id={`${pref.feature}-toggle`}
                        checked={pref.enabled}
                        onCheckedChange={() => handleNotificationToggle(pref.feature)}
                      />
                    </div>
                    {pref.enabled && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${pref.feature}-frequency`}>Frequency</Label>
                          <Select
                            value={pref.frequency}
                            onValueChange={(value: "daily" | "weekly" | "custom") =>
                              handleFrequencyChange(pref.feature, value)
                            }
                          >
                            <SelectTrigger 
                              id={`${pref.feature}-frequency`}
                              className="w-full"
                            >
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${pref.feature}-priority`}>Priority</Label>
                          <Select
                            value={pref.urgency}
                            onValueChange={(value: "urgent" | "passive") =>
                              handleUrgencyChange(pref.feature, value)
                            }
                          >
                            <SelectTrigger 
                              id={`${pref.feature}-priority`}
                              className="w-full"
                            >
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="urgent">Urgent Alert</SelectItem>
                              <SelectItem value="passive">Passive Reminder</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-medium mb-4">Notification Preferences</h4>
                {notificationPrefs.map((pref) => (
                  <div key={pref.feature} className="mb-4 bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor={`notification-${pref.feature}`} className="text-base">{pref.feature}</Label>
                      <Switch
                        id={`notification-${pref.feature}`}
                        checked={pref.enabled}
                        onCheckedChange={(checked) => {
                          setNotificationPrefs(prev =>
                            prev.map(p => p.feature === pref.feature ? { ...p, enabled: checked } : p)
                          );
                        }}
                      />
                    </div>
                    {pref.enabled && (
                      <div className="mt-2">
                        <Label htmlFor={`frequency-${pref.feature}`} className="text-sm mb-1 block">Frequency</Label>
                        <Select
                          value={pref.frequency}
                          onValueChange={(value) => handleFrequencyChange(pref.feature, value as "daily" | "weekly" | "custom")}
                        >
                          <SelectTrigger id={`frequency-${pref.feature}`}>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                ))}
                
                <h4 className="font-medium mb-4">Smart Scheduling</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="work-schedule" className="text-base">Work Schedule Integration</Label>
                    <Switch
                      id="work-schedule"
                      checked={workSchedule.enabled}
                      onCheckedChange={handleWorkScheduleToggle}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Calendar Integration</h4>
                <div className="space-y-3">
                  {Object.entries(calendarSync).map(([type, status]) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="w-full justify-start h-auto py-3"
                      onClick={() => !status.connected && handleCalendarConnect(type as 'google' | 'apple' | 'outlook')}
                      disabled={status.connecting}
                    >
                      <CalendarDays className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="flex-grow text-left">
                        {status.connected ? (
                          <>
                            Connected to {type.charAt(0).toUpperCase() + type.slice(1)} Calendar
                            <Check className="ml-2 h-4 w-4 text-green-500 inline" />
                          </>
                        ) : (
                          status.connecting ? (
                            <span>Connecting to {type.charAt(0).toUpperCase() + type.slice(1)} Calendar...</span>
                          ) : (
                            `Connect ${type.charAt(0).toUpperCase() + type.slice(1)} Calendar`
                          )
                        )}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}