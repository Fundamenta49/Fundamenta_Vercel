import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ActiveYou from "@/components/active-you";
import FitnessProfile, { FitnessProfile as ProfileType } from "@/components/fitness-profile";
import ProfileManager from "@/components/profile-manager";
import { Brain, Dumbbell, Bird as YogaIcon, Timer, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";

// Define a type for our sections to improve TypeScript support
type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
};

const SECTIONS: SectionType[] = [
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
  const carouselRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-6">
        Active You
      </h1>

      {/* Book-style card carousel */}
      <div ref={carouselRef} className="book-carousel">
        <BookCarousel>
          {SECTIONS.map((section) => {
            // Update props for Profile Manager
            if (section.id === 'activeyou') {
              section.props = { onUpdate: handleProfileComplete };
            }
            
            const isExpanded = expandedSection === section.id;
            
            return (
              <BookPage key={section.id} id={section.id}>
                <BookCard
                  id={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  isExpanded={isExpanded}
                  onToggle={handleCardClick}
                  color="text-pink-500" // Active section color from the home page
                >
                  <section.component {...section.props} />
                </BookCard>
              </BookPage>
            );
          })}
        </BookCarousel>
      </div>
    </div>
  );
}