import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import ActiveYou from "@/components/active-you";
import FitnessProfile, { FitnessProfile as ProfileType } from "@/components/fitness-profile";

export default function Active() {
  const [hasProfile, setHasProfile] = useState<boolean>(false);

  const handleProfileComplete = (profile: ProfileType) => {
    // In a real app, we would save this to a database
    localStorage.setItem('fitnessProfile', JSON.stringify(profile));
    setHasProfile(true);
  };

  // Check for existing profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('fitnessProfile');
    if (savedProfile) {
      setHasProfile(true);
    }
  }, []);

  if (!hasProfile) {
    return <FitnessProfile onComplete={handleProfileComplete} />;
  }

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