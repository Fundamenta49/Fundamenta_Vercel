import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChatInterface from "@/components/chat-interface";
import ActiveYou from "@/components/active-you";
import FitnessProfile, { FitnessProfile as ProfileType } from "@/components/fitness-profile";
import ProfileManager from "@/components/profile-manager";
import { Brain, Dumbbell, Bird as YogaIcon, Timer, User } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: 'chat',
    title: 'AI Fitness Coach',
    description: 'Get personalized workout guidance and fitness tips',
    icon: Brain,
    component: ChatInterface,
    props: { category: "fitness" as const }
  },
  {
    id: 'activeyou',
    title: 'ActiveYou Profile',
    description: 'Manage your fitness profile and track your progress',
    icon: User,
    component: ProfileManager,
    props: { onUpdate: undefined as unknown as (profile: ProfileType) => void }
  },
  {
    id: 'meditation',
    title: 'Meditation',
    description: 'Find peace and balance with guided meditation sessions',
    icon: Brain,
    component: ActiveYou,
    props: { defaultTab: "meditation" as const }
  },
  {
    id: 'weightlifting',
    title: 'Weight Lifting',
    description: 'Build strength with personalized workout plans',
    icon: Dumbbell,
    component: ActiveYou,
    props: { defaultTab: "weightlifting" as const }
  },
  {
    id: 'yoga',
    title: 'Yoga',
    description: 'Improve flexibility and mindfulness through yoga',
    icon: YogaIcon,
    component: ActiveYou,
    props: { defaultTab: "yoga" as const }
  },
  {
    id: 'running',
    title: 'Running',
    description: 'Track your runs and improve your endurance',
    icon: Timer,
    component: ActiveYou,
    props: { defaultTab: "running" as const }
  }
];

export default function Active() {
  const { toast } = useToast();
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [skipProfile, setSkipProfile] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleProfileComplete = (profile: ProfileType) => {
    try {
      localStorage.setItem('fitnessProfile', JSON.stringify(profile));
      setHasProfile(true);
      setExpandedSection("chat");

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
          setHasProfile(true);
        }
      } catch (error) {
        console.error("Error loading saved profile:", error);
        localStorage.removeItem('fitnessProfile');
      }
    }
  }, []);

  const handleCardClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (!hasProfile && !skipProfile) {
    return (
      <div className="px-4 py-8">
        <div className="space-y-4">
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
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#1C3D5A]">Active You</h1>

      <div className="grid gap-6">
        {SECTIONS.map((section) => {
          // Update props for Profile Manager
          if (section.id === 'activeyou') {
            section.props = { onUpdate: handleProfileComplete };
          }

          return (
            <Card 
              key={section.id}
              className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden",
                "hover:shadow-md bg-white w-full max-w-full",
                expandedSection === section.id ? "shadow-lg" : "shadow-sm"
              )}
            >
              {/* Only make the header clickable */}
              <div 
                onClick={() => handleCardClick(section.id)}
                className="cursor-pointer"
              >
                <CardHeader className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <section.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">{section.title}</CardTitle>
                  </div>
                  <CardDescription className="text-lg">
                    {section.description}
                  </CardDescription>
                </CardHeader>
              </div>
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  "overflow-hidden w-full",
                  expandedSection === section.id ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <CardContent className="p-6">
                  {expandedSection === section.id && (
                    <section.component {...section.props} />
                  )}
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}