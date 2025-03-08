import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const features = [
  "Skill Building",
  "Learning Goals",
  "Practice Projects"
];

export default function LearningCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  // Simple enabled/disabled state for each feature
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);

  // Basic calendar integration toggle
  const [calendarEnabled, setCalendarEnabled] = useState(false);

  const toggleFeature = (feature: string) => {
    setEnabledFeatures(prev => {
      const isEnabled = prev.includes(feature);
      return isEnabled ? prev.filter(f => f !== feature) : [...prev, feature];
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Learning Schedule</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showSettings ? (
            <div className="space-y-4 mb-6">
              <h3 className="font-medium">Settings</h3>
              <div className="space-y-2">
                {features.map((feature) => (
                  <Button
                    key={feature}
                    variant={enabledFeatures.includes(feature) ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => toggleFeature(feature)}
                  >
                    {feature}: {enabledFeatures.includes(feature) ? 'Enabled' : 'Disabled'}
                  </Button>
                ))}
                <Button
                  variant={calendarEnabled ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setCalendarEnabled(!calendarEnabled)}
                >
                  Calendar Integration: {calendarEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
                initialFocus
              />
              <div>
                <h3 className="font-medium mb-2">
                  Selected Date: {date && format(date, "PPP")}
                </h3>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}