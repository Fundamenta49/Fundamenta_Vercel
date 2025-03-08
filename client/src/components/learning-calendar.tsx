import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { format } from "date-fns";

const features = [
  { id: 'skill-building', name: 'Skill Building' },
  { id: 'learning-goals', name: 'Learning Goals' },
  { id: 'practice-projects', name: 'Practice Projects' }
];

export default function LearningCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);

  const toggleFeature = (featureId: string) => {
    setEnabledFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  return (
    <Card className="max-w-3xl mx-auto">
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
        <div className="grid gap-6">
          {showSettings ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Learning Features</h3>
              <div className="grid gap-2">
                {features.map((feature) => (
                  <Button
                    key={feature.id}
                    variant={enabledFeatures.includes(feature.id) ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => toggleFeature(feature.id)}
                  >
                    {feature.name}: {enabledFeatures.includes(feature.id) ? 'Enabled' : 'Disabled'}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border mx-auto"
                disabled={(date) => date < new Date()}
                initialFocus
              />
              <div className="text-center">
                <h3 className="font-medium">
                  Selected Date: {date && format(date, "PPP")}
                </h3>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}