import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MeditationGuide from "./meditation-guide";
import FitnessProgress from "./fitness-progress";
import RunningTracker from "./running-tracker";
import {
  Dumbbell,
  Bird as YogaIcon,
  Timer as RunningIcon,
  Brain,
  Video,
  Trophy,
  CalendarDays,
  Timer as TimerIcon,
  TrendingUp,
} from "lucide-react";

interface ActiveYouProps {
  defaultTab?: "meditation" | "weightlifting" | "yoga" | "running";
}

export default function ActiveYou({ defaultTab = "weightlifting" }: ActiveYouProps) {
  if (defaultTab === "meditation") {
    return <MeditationGuide />;
  }

  if (defaultTab === "weightlifting") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              AI Weight Lifting Guide
            </CardTitle>
            <CardDescription>
              Get personalized workout plans and form guidance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/videoseries?list=PLdemonic"
                title="Interactive Workout Guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <Alert>
              <AlertDescription>
                AI form analysis and personalized recommendations coming soon!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        <FitnessProgress />
      </div>
    );
  }

  if (defaultTab === "yoga") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <YogaIcon className="h-5 w-5 text-primary" />
              Yoga Buddy
            </CardTitle>
            <CardDescription>
              Interactive yoga sessions with AI guidance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/videoseries?list=PLyoga"
                title="Interactive Yoga Session"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <Alert>
              <AlertDescription>
                AI pose correction and personalized flows coming soon!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        <FitnessProgress />
      </div>
    );
  }

  if (defaultTab === "running") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RunningIcon className="h-5 w-5 text-primary" />
              Running Tracker
            </CardTitle>
            <CardDescription>
              Track your runs and get AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RunningTracker />
          </CardContent>
        </Card>
        <FitnessProgress />
      </div>
    );
  }

  return null;
}