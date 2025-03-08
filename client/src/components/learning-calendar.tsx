import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { format } from "date-fns";

export default function LearningCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showSettings, setShowSettings] = useState(false);

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
              <h3 className="text-lg font-medium">Calendar Settings</h3>
              <p className="text-muted-foreground">
                Calendar settings and integrations will be available soon.
              </p>
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