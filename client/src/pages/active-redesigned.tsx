import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChatInterface, { FITNESS_CATEGORY } from "@/components/chat-interface";
import {
  FullScreenDialog,
  FullScreenDialogTrigger,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";

import ActiveYou from "@/components/active-you";
import FitnessProfile, { FitnessProfile as ProfileType } from "@/components/fitness-profile";
import ProfileManager from "@/components/profile-manager";
import { AlertCircle, Brain, Dumbbell, Bird as YogaIcon, Timer, User, Menu, ArrowRight, Flame, Activity, Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";

// Section colors from the design system
const SECTION_COLORS = {
  wellness: "#10b981", // Wellness Green
};

// Define a type for our sections to improve TypeScript support
type ChatInterfaceProps = {
  category: typeof FITNESS_CATEGORY;
};

type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  props?: Record<string, any> | ChatInterfaceProps;
  alert?: React.ReactNode;
};

const SECTIONS: SectionType[] = [
  {
    id: 'coach',
    title: 'Fitness AI Coach',
    description: 'Get personalized workout plans and fitness advice',
    icon: Brain,
    component: ChatInterface,
    props: { category: FITNESS_CATEGORY },
    alert: (
      <Alert className="mt-4 border border-wellness-500 bg-wellness-50 rounded-md p-4 flex items-start space-x-2">
        <AlertCircle className="h-5 w-5 text-wellness-500 mt-0.5 flex-shrink-0" />
        <AlertDescription className="text-wellness-700 text-sm">
          The AI coach provides general fitness guidance. Always consult with a healthcare 
          professional before starting a new fitness program.
        </AlertDescription>
      </Alert>
    )
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
  },
  {
    id: 'hiit',
    title: 'HIIT',
    description: 'High-Intensity Interval Training for maximum results',
    icon: Flame,
    component: ActiveYou,
    props: { defaultTab: "hiit" as const }
  },
  // Plyometrics section removed
  {
    id: 'stretch',
    title: 'Stretch Zone',
    description: 'Improve flexibility and recovery with guided stretching',
    icon: Brain, // Using Brain as a temporary icon for stretch
    component: ActiveYou,
    props: { defaultTab: "stretch" as const }
  },
  // Calisthenics section removed
];

// Component for section cards following design system guidelines
function SectionCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick 
}: { 
  title: string; 
  description: string; 
  icon: React.ComponentType<{ className?: string }>; 
  onClick: () => void 
}) {
  const themeColor = SECTION_COLORS.wellness; // Using wellness green for Active section
  
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden relative h-full"
      onClick={onClick}
      style={{ borderColor: themeColor }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 mr-2 text-[${themeColor}]`} />
          <CardTitle className="text-lg" style={{ color: themeColor }}>
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-4 line-clamp-2">
          {description}
        </CardDescription>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-muted-foreground">View details</span>
          <ArrowRight className="h-4 w-4" color={themeColor} />
        </div>
      </CardContent>
    </Card>
  );
}

// Component for section dialog following design system guidelines
function SectionDialog({ 
  section,
  onProfileUpdate,
  onClose
}: { 
  section: SectionType; 
  onProfileUpdate?: (profile: ProfileType) => void;
  onClose: () => void;
}) {
  const themeColor = SECTION_COLORS.wellness;
  
  // Update props for Profile Manager if needed
  const componentProps = section.id === 'activeyou' && onProfileUpdate
    ? { ...section.props, onUpdate: onProfileUpdate }
    : section.props;
  
  return (
    <FullScreenDialogContent themeColor={themeColor}>
      {/* Menu button with proper positioning and z-index */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ 
            backgroundColor: `${themeColor}10`,
            pointerEvents: "auto"
          }}
        >
          <Menu style={{ color: themeColor }} />
        </button>
      </div>
      
      <FullScreenDialogHeader>
        <FullScreenDialogTitle>
          <div className="flex items-center">
            <div className="h-6 w-6 mr-2 text-wellness-600 flex items-center">
              <section.icon />
            </div>
            <span style={{ color: themeColor }}>{section.title}</span>
          </div>
        </FullScreenDialogTitle>
        <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        {section.alert && (
          <div className="mb-6">{section.alert}</div>
        )}
        
        {section.id === 'coach' ? (
          <ChatInterface category={FITNESS_CATEGORY} />
        ) : (
          <section.component {...componentProps} />
        )}
      </FullScreenDialogBody>
    </FullScreenDialogContent>
  );
}

export default function ActiveRedesigned() {
  const { toast } = useToast();
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [skipProfile, setSkipProfile] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const themeColor = SECTION_COLORS.wellness;

  const handleProfileComplete = (profile: ProfileType) => {
    try {
      localStorage.setItem('fitnessProfile', JSON.stringify(profile));
      setHasProfile(true);
      
      toast({
        title: "Success!",
        description: "Your fitness profile has been created successfully!",
        style: { borderColor: themeColor, borderWidth: "1px" },
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

  if (!hasProfile && !skipProfile) {
    return (
      <div className="container max-w-4xl px-4 py-8">
        <div className="space-y-6">
          <div className="pb-4 mb-6 border-b" style={{ borderColor: themeColor }}>
            <h2 className="text-2xl font-bold" style={{ color: themeColor }}>
              Welcome to Active You! 🎉
            </h2>
            <p className="text-muted-foreground mt-2">
              Let's create your personalized fitness profile to help you achieve your goals.
              This will help us provide customized recommendations across all features.
            </p>
          </div>
          
          <FitnessProfile onComplete={handleProfileComplete} />
          
          <div className="text-center mt-8">
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
    <div className="container max-w-7xl mx-auto px-4 py-6">
      {/* Section Header following design system */}
      <div 
        className="pb-4 mb-6 border-b flex flex-col space-y-2"
        style={{ borderColor: themeColor }}
      >
        <div className="flex items-center">
          <Dumbbell className="mr-2" style={{ color: themeColor }} />
          <h2 className="text-2xl font-bold" style={{ color: themeColor }}>Active You</h2>
        </div>
        
        <p className="text-muted-foreground">
          Tools and resources to support your wellness journey
        </p>
      </div>

      {/* Grid layout for section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTIONS.map((section) => (
          <FullScreenDialog key={section.id}>
            <FullScreenDialogTrigger asChild>
              <div className="h-full">
                <SectionCard
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  onClick={() => setActiveSection(section.id)}
                />
              </div>
            </FullScreenDialogTrigger>
            
            <SectionDialog 
              section={section}
              onProfileUpdate={section.id === 'activeyou' ? handleProfileComplete : undefined}
              onClose={() => setActiveSection(null)}
            />
          </FullScreenDialog>
        ))}
      </div>
    </div>
  );
}