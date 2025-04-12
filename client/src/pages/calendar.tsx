import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SmartCalendar from "../components/smart-calendar";

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Learning Calendar</CardTitle>
            <CardDescription>
              Plan your learning sessions and track your progress with Fundamenta's Smart Calendar.
              Add learning events, set reminders for important sessions, and organize your personal
              development journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SmartCalendar />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}