import * as React from "react";
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

import ActiveYou from "@/components/active-you";
import FitnessProfile, { FitnessProfile as ProfileType } from "@/components/fitness-profile";
import ProfileManager from "@/components/profile-manager";
import { AlertCircle, Brain, Dumbbell, Bird as YogaIcon, Timer, User, X as CloseIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";
import * as Dialog from "@radix-ui/react-dialog";

// Create our own FullScreenDialog components to avoid any potential import issues
const FullScreenDialog = Dialog.Root;
const FullScreenDialogTrigger = Dialog.Trigger;
const FullScreenDialogClose = Dialog.Close;

// Override Content to add styling
type FullScreenDialogContentProps = React.ComponentPropsWithoutRef<typeof Dialog.Content> & {
  themeColor?: string;
};

const FullScreenDialogContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  FullScreenDialogContentProps
>(({ className, themeColor = "#ec4899", children, ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <Dialog.Content
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 w-full h-full overflow-auto bg-white shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    >
      {children}
      
      <Dialog.Close 
        className="absolute right-4 top-4 rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
        style={{ backgroundColor: `${themeColor}20` }}
      >
        <CloseIcon className="h-6 w-6" style={{ color: themeColor }} />
        <span className="sr-only">Close</span>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
));
FullScreenDialogContent.displayName = "FullScreenDialogContent";

// Simple styled components
const FullScreenDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("sticky top-0 z-10 px-6 py-4 flex flex-col gap-1.5 border-b bg-white", className)} {...props} />
);

const FullScreenDialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 py-4 pb-16", className)} {...props} />
);

const FullScreenDialogTitle = React.forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
FullScreenDialogTitle.displayName = "FullScreenDialogTitle";

const FullScreenDialogDescription = React.forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground mt-2", className)}
    {...props}
  />
));
FullScreenDialogDescription.displayName = "FullScreenDialogDescription";

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
      <Alert className="mt-4 border-pink-500 bg-pink-50">
        <AlertCircle className="h-4 w-4 text-pink-500" />
        <AlertDescription className="text-pink-800 text-sm">
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
      <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
        Active You
      </h1>

      {/* Grid-style cards layout */}
      <div className="px-2">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2 px-2 py-1 bg-pink-50 text-pink-800 rounded-md border-l-4 border-pink-500">
            Fitness Tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 mt-4">
            {SECTIONS.map((section) => {
              // Update props for Profile Manager
              if (section.id === 'activeyou') {
                section.props = { onUpdate: handleProfileComplete };
              }
              
              return (
                <FullScreenDialog key={section.id}>
                  <FullScreenDialogTrigger asChild>
                    <div className="flex flex-col h-full">
                      <button
                        className="relative flex flex-col items-center justify-between p-4 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-pink-500 min-h-[130px] sm:min-h-[160px] w-full h-full"
                        aria-label={`Open ${section.title}`}
                      >
                        <div className="flex items-center justify-center h-12 sm:h-14 w-full mb-2">
                          <section.icon className="w-9 h-9 sm:w-10 sm:h-10 text-pink-500" />
                        </div>
                        
                        <span className="text-sm sm:text-base font-medium text-center line-clamp-2 w-full">{section.title}</span>
                        
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 text-center hidden sm:block">
                          {section.description.length > 60 
                            ? `${section.description.substring(0, 60)}...` 
                            : section.description}
                        </p>
                      </button>
                    </div>
                  </FullScreenDialogTrigger>
                  
                  <FullScreenDialogContent themeColor="#ec4899">
                    <FullScreenDialogHeader>
                      <FullScreenDialogTitle className="flex items-center gap-2">
                        <section.icon className="h-6 w-6 text-pink-500" />
                        {section.title}
                      </FullScreenDialogTitle>
                      <FullScreenDialogDescription>
                        {section.description}
                      </FullScreenDialogDescription>
                      
                      {section.alert && (
                        <div className="mt-2">{section.alert}</div>
                      )}
                    </FullScreenDialogHeader>
                    
                    <FullScreenDialogBody>
                      {(() => {
                        if (section.id === 'coach') {
                          // Use the component's required "category" prop
                          return <ChatInterface category={FITNESS_CATEGORY} />;
                        } else {
                          // For regular components
                          return <section.component {...section.props} />;
                        }
                      })()}
                    </FullScreenDialogBody>
                  </FullScreenDialogContent>
                </FullScreenDialog>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}