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
import { AlertCircle, Brain, Dumbbell, Bird as YogaIcon, Timer, User, X as CloseIcon, ChevronDown, Flame, Activity, Waypoints } from "lucide-react";
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
>(({ className, themeColor = "#ec4899", children, ...props }, ref) => {
  // Add swipe-down-to-close functionality
  const contentRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const swipeIndicatorRef = React.useRef<HTMLDivElement>(null);
  const startY = React.useRef<number | null>(null);
  const currentY = React.useRef<number>(0);
  const [isDragging, setIsDragging] = React.useState(false);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only initiate swipe if touch starts at the top 100px of the dialog
    if (e.touches[0].clientY < 100) {
      startY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current !== null && contentRef.current && swipeIndicatorRef.current) {
      currentY.current = e.touches[0].clientY - startY.current;
      
      // Only allow downward swipe (positive delta)
      if (currentY.current > 0) {
        // Apply transform to the content
        contentRef.current.style.transform = `translateY(${currentY.current}px)`;
        contentRef.current.style.transition = 'none';
        
        // Calculate opacity based on swipe distance
        const opacity = Math.max(0, 1 - currentY.current / 400);
        contentRef.current.style.opacity = opacity.toString();
        
        // Make swipe indicator more visible during swipe
        if (swipeIndicatorRef.current) {
          swipeIndicatorRef.current.style.opacity = '1';
          swipeIndicatorRef.current.style.width = '3rem';
        }
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (contentRef.current && startY.current !== null && swipeIndicatorRef.current) {
      // If swiped down more than 150px, close the dialog
      if (currentY.current > 150 && closeButtonRef.current) {
        closeButtonRef.current.click();
      } else {
        // Otherwise, snap back
        contentRef.current.style.transform = 'translateY(0)';
        contentRef.current.style.opacity = '1';
        contentRef.current.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        
        // Reset swipe indicator
        if (swipeIndicatorRef.current) {
          swipeIndicatorRef.current.style.opacity = '0.5';
          swipeIndicatorRef.current.style.width = '2rem';
        }
      }
      
      // Reset values
      startY.current = null;
      currentY.current = 0;
      setIsDragging(false);
    }
  };
  
  return (
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
        <div 
          ref={contentRef}
          className="min-h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe indicator */}
          <div className="absolute top-2 left-0 right-0 flex justify-center items-center pointer-events-none">
            <div 
              ref={swipeIndicatorRef}
              className="h-1 w-8 bg-gray-400 rounded-full opacity-50 transition-all duration-200"
              style={{ backgroundColor: themeColor }}
            ></div>
          </div>
          
          {/* Swipe down hint */}
          <div className="absolute top-12 left-0 right-0 flex justify-center items-center pointer-events-none opacity-30">
            <ChevronDown className="w-6 h-6" style={{ color: themeColor }} />
          </div>
          
          {children}
        </div>
        
        <Dialog.Close 
          ref={closeButtonRef}
          className="absolute right-4 top-4 rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
          style={{ backgroundColor: `${themeColor}20` }}
        >
          <CloseIcon className="h-6 w-6" style={{ color: themeColor }} />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
});
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
    icon: Brain,
    component: ActiveYou,
    props: { defaultTab: "stretch" as const }
  },
  // Calisthenics section removed
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

  // Create refs for dialog buttons
  const sectionButtonRefs = useRef<Record<string, HTMLElement | null>>({});
  
  // Check URL params for section to automatically open
  useEffect(() => {
    // Get URL search params to check for section param
    const urlParams = new URLSearchParams(window.location.search);
    const sectionParam = urlParams.get('section');
    
    // Parse URL parameters to auto-open a specific section
    if (sectionParam) {
      const matchedSection = SECTIONS.find(section => 
        section.id.toLowerCase() === sectionParam.toLowerCase()
      );
      
      if (matchedSection) {
        // Store the section ID to be opened
        setExpandedSection(matchedSection.id);
        
        // Use setTimeout to ensure the component has fully mounted
        setTimeout(() => {
          // Get the button reference for this section
          const buttonElement = document.querySelector(`[aria-label="Open ${matchedSection.title}"]`) as HTMLElement;
          
          // If we found the button, click it to open the dialog
          if (buttonElement) {
            buttonElement.click();
          }
        }, 300);
      }
    }
    
    // Load saved profile data
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-4 max-w-6xl mx-auto">
            {SECTIONS.map((section) => {
              // Update props for Profile Manager
              if (section.id === 'activeyou') {
                section.props = { onUpdate: handleProfileComplete };
              }
              
              return (
                <FullScreenDialog key={section.id}>
                  <FullScreenDialogTrigger asChild>
                    <div className={`flex flex-col h-full ${section.id === 'stretch' ? 'col-span-2' : ''}`}>
                      <button
                        className={`relative flex flex-col items-center justify-between p-4 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-pink-500 min-h-[130px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px] w-full h-full ${section.id === 'stretch' ? 'sm:flex-row sm:items-start sm:text-left sm:justify-start' : ''}`}
                        aria-label={`Open ${section.title}`}
                      >
                        <div className={`flex items-center justify-center h-12 sm:h-14 md:h-16 ${section.id === 'stretch' ? 'sm:mr-6' : 'w-full'} mb-2 md:mb-3`}>
                          <section.icon className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-pink-500" />
                        </div>
                        
                        <div className={`flex flex-col ${section.id === 'stretch' ? 'sm:items-start items-center' : 'items-center'} w-full`}>
                          <span className={`text-sm sm:text-base md:text-lg font-medium ${section.id === 'stretch' ? 'sm:text-left text-center' : 'text-center'} line-clamp-2 w-full`}>{section.title}</span>
                          
                          <p className={`text-xs sm:text-sm text-gray-500 mt-1 md:mt-2 line-clamp-3 ${section.id === 'stretch' ? 'sm:text-left text-center' : 'text-center'} block`}>
                            {section.description.length > (section.id === 'stretch' ? 100 : 80) 
                              ? `${section.description.substring(0, section.id === 'stretch' ? 100 : 80)}...` 
                              : section.description}
                          </p>
                        </div>
                      </button>
                    </div>
                  </FullScreenDialogTrigger>
                  
                  <FullScreenDialogContent themeColor="#ec4899">
                    <div className="pt-16 relative">
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
                    </div>
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