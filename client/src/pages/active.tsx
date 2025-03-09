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
import { useToast } from "@/hooks/use-toast";
import ChatInterface from "@/components/chat-interface";
import ActiveYou from "@/components/active-you";
import FitnessProfile, { FitnessProfile as ProfileType } from "@/components/fitness-profile";
import ProfileManager from "@/components/profile-manager";

export default function Active() {
  const { toast } = useToast();
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [skipProfile, setSkipProfile] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("chat");

  const handleProfileComplete = (profile: ProfileType) => {
    console.log("Profile completion handler called with:", profile);
    try {
      localStorage.setItem('fitnessProfile', JSON.stringify(profile));
      setHasProfile(true);
      setActiveTab("chat");

      toast({
        title: "Success!",
        description: "Your fitness profile has been created successfully!",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile. Please try again.",
      });
      setHasProfile(false);
      localStorage.removeItem('fitnessProfile');
    }
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('fitnessProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile) {
          console.log("Found existing profile:", parsedProfile);
          setHasProfile(true);
        }
      } catch (error) {
        console.error("Error loading saved profile:", error);
        localStorage.removeItem('fitnessProfile');
      }
    }
  }, []);

  if (!hasProfile && !skipProfile) {
    return (
      <div className="min-h-screen bg-white px-4 py-8">
        <div className="space-y-4 max-w-4xl mx-auto">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-[#1C3D5A]">Welcome to Active You! 🎉</CardTitle>
              <CardDescription className="text-muted-foreground">
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
              className="text-muted-foreground hover:text-primary"
            >
              Skip for now and explore
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#1C3D5A]">Active You</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chat">AI Fitness Coach</TabsTrigger>
            <TabsTrigger value="activeyou">ActiveYou</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="weightlifting">Weight Lifting</TabsTrigger>
            <TabsTrigger value="yoga">Yoga</TabsTrigger>
            <TabsTrigger value="running">Running</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-[#1C3D5A]">Fitness AI Coach</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Get personalized workout guidance and fitness tips
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ChatInterface category="fitness" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activeyou">
            <ProfileManager onUpdate={handleProfileComplete} />
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
    </div>
  );
}