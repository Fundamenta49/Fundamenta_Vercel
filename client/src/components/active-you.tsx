import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MeditationGuide from "./meditation-guide";
import FitnessProgress from "./fitness-progress";
import RunningTracker from "./running-tracker";
import {
  Dumbbell,
  Bird as YogaIcon,
  Timer,
  Wind,
} from "lucide-react";

type TabType = "meditation" | "weightlifting" | "yoga" | "running";

// Wellness green from design system
const WELLNESS_COLOR = "#10b981";

interface ActiveYouProps {
  defaultTab: TabType;
}

export default function ActiveYou({ defaultTab }: ActiveYouProps) {
  // Simplified implementation that follows the design system but without full-screen dialogs
  // The parent component should handle the dialog wrapping

  switch (defaultTab) {
    case "meditation":
      return <MeditationGuide />;
      
    case "weightlifting":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Dumbbell className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                AI Weight Lifting Guide
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Get personalized workout plans and form guidance
            </p>
          </div>
          <FitnessProgress />
        </div>
      );
      
    case "yoga":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <YogaIcon className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                Yoga Sessions
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Follow guided yoga sessions with AI assistance
            </p>
          </div>
          <FitnessProgress />
        </div>
      );
      
    case "running":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Timer className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                Running Tracker
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Track your runs, set goals, and improve your performance
            </p>
          </div>
          <RunningTracker />
        </div>
      );
      
    default:
      return null;
  }
}