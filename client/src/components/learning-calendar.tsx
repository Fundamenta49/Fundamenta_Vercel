import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Bell, Calendar as CalendarIcon, BellRing, CalendarDays, Settings, Check } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

interface NotificationPreference {
  feature: string;
  enabled: boolean;
  frequency: "daily" | "weekly" | "custom";
  urgency: "urgent" | "passive";
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

  const [workSchedule, setWorkSchedule] = useState({
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  });

  const [calendarSync, setCalendarSync] = useState({
    google: { connected: false, connecting: false },
    apple: { connected: false, connecting: false },
    outlook: { connected: false, connecting: false }
  });
  
  const handleCalendarConnect = (type: 'google' | 'apple' | 'outlook') => {
    // Set connecting state
    setCalendarSync(prev => ({
      ...prev,
      [type]: { ...prev[type], connecting: true }
    }));
    
    // Simulate connection process
    setTimeout(() => {
      setCalendarSync(prev => ({
        ...prev,
        [type]: { connecting: false, connected: true }
      }));
      
      toast({
        title: "Calendar Connected",
        description: `Successfully connected to ${type.charAt(0).toUpperCase() + type.slice(1)} Calendar.`,
      });
    }, 1500);
  };

  const handleNotificationToggle = (feature: string) => {
    setNotificationPrefs(prev =>
      prev.map(pref =>
        pref.feature === feature ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
    toast({
      title: `${feature} notifications ${notificationPrefs.find(p => p.feature === feature)?.enabled ? 'disabled' : 'enabled'}`,
      description: "Your notification preferences have been updated",
    });
  };

  const updateFrequency = (feature: string, frequency: "daily" | "weekly" | "custom") => {
    handleFrequencyChange(feature, frequency);
  };

  const updateUrgency = (feature: string, urgency: "urgent" | "passive") => {
    handleUrgencyChange(feature, urgency);
  };

  const handleFrequencyChange = (feature: string, frequency: "daily" | "weekly" | "custom") => {
    setNotificationPrefs(prev =>
      prev.map(pref =>
        pref.feature === feature ? { ...pref, frequency } : pref
      )
    );
    toast({
      title: "Notification frequency updated",
      description: `${feature} notifications will now be sent ${frequency}`,
    });
  };

  const handleUrgencyChange = (feature: string, urgency: "urgent" | "passive") => {
    setNotificationPrefs(prev =>
      prev.map(pref =>
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

  const handleCalendarConnect = async (type: 'google' | 'apple' | 'outlook') => {
    setCalendarSync(prev => ({
      ...prev,
      [type]: { ...prev[type], connecting: true }
    }));

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
              <div>
                <h3 className="font-medium mb-2">Selected Date: {date && format(date, "PPP")}</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <BellRing className="mr-2 h-4 w-4" />
                    Set Reminders
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Configure Notifications
                  </Button>
                </div>
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

          <div className="py-4 space-y-4">
            <h4 className="font-medium">Notification Settings</h4>
            {notificationPrefs.map((pref, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{pref.feature}</span>
                <div className="flex space-x-2">
                  {/* Frequency Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        {pref.frequency.charAt(0).toUpperCase() + pref.frequency.slice(1)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuRadioGroup
                        value={pref.frequency}
                        onValueChange={(value: string) =>
                          updateFrequency(pref.feature, value as "daily" | "weekly" | "custom")
                        }
                      >
                        <DropdownMenuRadioItem value="daily">Daily</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="weekly">Weekly</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="custom">Custom</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Urgency Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        {pref.urgency.charAt(0).toUpperCase() + pref.urgency.slice(1)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuRadioGroup
                        value={pref.urgency}
                        onValueChange={(value: string) =>
                          updateUrgency(pref.feature, value as "urgent" | "passive")
                        }
                      >
                        <DropdownMenuRadioItem value="urgent">Urgent</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="passive">Passive</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="work-schedule">Work Schedule Integration</Label>
              <Switch
                id="work-schedule"
                checked={workSchedule.enabled}
                onCheckedChange={handleWorkScheduleToggle}
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Calendar Integration</h4>
            <div className="space-y-2">
              {Object.entries(calendarSync).map(([type, status]) => (
                <Button
                  key={type}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => !status.connected && handleCalendarConnect(type as 'google' | 'apple' | 'outlook')}
                  disabled={status.connecting}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span className="flex-1 text-left">
                    {status.connected ? (
                      <>
                        Connected to {type.charAt(0).toUpperCase() + type.slice(1)} Calendar
                        <Check className="ml-2 h-4 w-4 text-green-500 inline" />
                      </>
                    ) : (
                      status.connecting ? (
                        <span>Connecting...</span>
                      ) : (
                        `Connect ${type.charAt(0).toUpperCase() + type.slice(1)} Calendar`
                      )
                    )}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}