import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WorkoutFlow from './workout-flow';

// Define types for the tabs
type TabType = "meditation" | "weightlifting" | "yoga" | "running" | "hiit" | "stretch";

// Define props for ActiveYouFlow component
interface ActiveYouFlowProps {
  defaultTab: TabType;
}

// Define color constants
const WELLNESS_COLOR = "#4f46e5"; // Indigo color for wellness sections

export default function ActiveYouFlow({ defaultTab }: ActiveYouFlowProps) {
  // State for the active tab
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  return (
    <>
      <div className="p-4 space-y-6">
        <div className="border-b pb-4" style={{ borderColor: WELLNESS_COLOR }}>
          <h2 className="text-2xl font-bold" style={{ color: WELLNESS_COLOR }}>
            Active You
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Personalized fitness routines and mindful movement exercises
          </p>
        </div>

        <Tabs 
          defaultValue={defaultTab} 
          onValueChange={(value) => setActiveTab(value as TabType)}
          className="w-full"
        >
          <TabsList className="w-full mb-6 grid grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="yoga">Yoga</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="weightlifting">Strength</TabsTrigger>
            <TabsTrigger value="running">Running</TabsTrigger>
            <TabsTrigger value="hiit">HIIT</TabsTrigger>
            <TabsTrigger value="stretch">Stretch</TabsTrigger>
          </TabsList>

          {/* Workout Flow integrated across all tabs */}
          <TabsContent value="yoga" className="space-y-4">
            <WorkoutFlow />
          </TabsContent>

          <TabsContent value="meditation" className="space-y-4">
            <WorkoutFlow />
          </TabsContent>

          <TabsContent value="weightlifting" className="space-y-4">
            <WorkoutFlow />
          </TabsContent>

          <TabsContent value="running" className="space-y-4">
            <WorkoutFlow />
          </TabsContent>

          <TabsContent value="hiit" className="space-y-4">
            <WorkoutFlow />
          </TabsContent>

          <TabsContent value="stretch" className="space-y-4">
            <WorkoutFlow />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}