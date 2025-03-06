import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/chat-interface";
import ActiveYou from "@/components/active-you";
import FitnessProfile, { FitnessProfile as ProfileType } from "@/components/fitness-profile";
import InitialGreeting from "@/components/initial-greeting";

export default function Active() {
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [skipProfile, setSkipProfile] = useState<boolean>(false);
  const [hasCompletedGreeting, setHasCompletedGreeting] = useState<boolean>(false);

  const handleProfileComplete = (profile: ProfileType) => {
    // In a real app, we would save this to a database
    localStorage.setItem('fitnessProfile', JSON.stringify(profile));
    setHasProfile(true);
  };

  // Check for existing profile and greeting completion
  useEffect(() => {
    const savedProfile = localStorage.getItem('fitnessProfile');
    const completedGreeting = localStorage.getItem('completedInitialGreeting');

    if (savedProfile) {
      setHasProfile(true);
    }
    if (completedGreeting) {
      setHasCompletedGreeting(true);
    }
  }, []);

  const handleGreetingComplete = () => {
    setHasCompletedGreeting(true);
    localStorage.setItem('completedInitialGreeting', 'true');
  };

  // For development/testing - clear localStorage
  useEffect(() => {
    // Comment out these lines in production
    localStorage.removeItem('completedInitialGreeting');
    localStorage.removeItem('fitnessProfile');
    localStorage.removeItem('userPreferences');
  }, []);

  // Show initial greeting if not completed
  if (!hasCompletedGreeting) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <InitialGreeting onComplete={handleGreetingComplete} />
      </div>
    );
  }

  // Show profile creation if not skipped
  if (!hasProfile && !skipProfile) {
    return (
      <div className="space-y-4">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Welcome to Active You! 🎉</CardTitle>
            <CardDescription>
              Let's create your personalized fitness profile to help you achieve your goals.
              This will help us provide customized recommendations across all features.
            </CardDescription>
          </CardHeader>
        </Card>
        <FitnessProfile onComplete={handleProfileComplete} />
        <div className="text-center mt-4">
          <Button
            variant="ghost"
            onClick={() => setSkipProfile(true)}
          >
            Skip for now and explore
          </Button>
        </div>
      </div>
    );
  }

  // Main interface
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Active You</h1>

      <Tabs defaultValue="chat">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="chat">AI Fitness Coach</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="weightlifting">Weight Lifting</TabsTrigger>
            <TabsTrigger value="yoga">Yoga</TabsTrigger>
            <TabsTrigger value="running">Running</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="mt-6">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>Fitness AI Coach</CardTitle>
              <CardDescription>
                Get personalized workout guidance and fitness tips
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ChatInterface category="fitness" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meditation">
          <ActiveYou defaultTab="meditation" />
        </TabsContent>

        <TabsContent value="weightlifting">
          <ActiveYou defaultTab="weightlifting" />
        </TabsContent>

        <TabsContent value="yoga">
          <ActiveYou defaultTab="yoga" />
        </TabsContent>

        <TabsContent value="running">
          <ActiveYou defaultTab="running" />
        </TabsContent>
      </Tabs>
    </div>
  );
}