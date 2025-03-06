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
import ProfileManager from "./profile-manager";
import { useToast } from "@/hooks/use-toast";
import {
  Dumbbell,
  Bird as YogaIcon,
  Timer as RunningIcon,
  Brain,
  Video,
  User,
} from "lucide-react";

interface ActiveYouProps {
  defaultTab?: "meditation" | "weightlifting" | "yoga" | "running" | "profile";
}

export default function ActiveYou({ defaultTab = "weightlifting" }: ActiveYouProps) {
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const { toast } = useToast();

  const handleProfileUpdate = (profile: any) => {
    try {
      localStorage.setItem('fitnessProfile', JSON.stringify(profile));
      toast({
        title: "Success!",
        description: "Your fitness profile has been updated successfully!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active You Dashboard</CardTitle>
          <CardDescription>Track and manage your fitness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="weightlifting">
                <Dumbbell className="h-4 w-4 mr-2" />
                Weight Lifting
              </TabsTrigger>
              <TabsTrigger value="yoga">
                <YogaIcon className="h-4 w-4 mr-2" />
                Yoga
              </TabsTrigger>
              <TabsTrigger value="running">
                <RunningIcon className="h-4 w-4 mr-2" />
                Running
              </TabsTrigger>
              <TabsTrigger value="meditation">
                <Brain className="h-4 w-4 mr-2" />
                Meditation
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                My Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="meditation">
              <MeditationGuide />
            </TabsContent>

            <TabsContent value="weightlifting">
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
                <CardContent>
                  <FitnessProgress />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="yoga">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <YogaIcon className="h-5 w-5 text-primary" />
                    Yoga Sessions
                  </CardTitle>
                  <CardDescription>
                    Follow guided yoga sessions with AI assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FitnessProgress />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="running">
              <RunningTracker />
            </TabsContent>

            <TabsContent value="profile">
              <ProfileManager onUpdate={handleProfileUpdate} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}