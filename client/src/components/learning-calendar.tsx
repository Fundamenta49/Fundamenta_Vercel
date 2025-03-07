import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Calendar as CalendarIcon, Clock } from "lucide-react";
import { addDays, format } from "date-fns";

interface NotificationPreference {
  feature: string;
  enabled: boolean;
  frequency: "daily" | "weekly" | "custom";
}

export default function LearningCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreference[]>([
    { feature: "Skill Building", enabled: true, frequency: "weekly" },
    { feature: "Learning Goals", enabled: true, frequency: "daily" },
    { feature: "Practice Projects", enabled: true, frequency: "weekly" },
  ]);

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Learning Schedule
          </CardTitle>
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
            />
            
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
                      <Label htmlFor={`${pref.feature}-toggle`}>{pref.feature}</Label>
                      <Switch
                        id={`${pref.feature}-toggle`}
                        checked={pref.enabled}
                        onCheckedChange={() => handleNotificationToggle(pref.feature)}
                      />
                    </div>
                    {pref.enabled && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Select
                          value={pref.frequency}
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
                    )}
                  </div>
                ))}

                <div className="pt-4">
                  <Button className="w-full">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
