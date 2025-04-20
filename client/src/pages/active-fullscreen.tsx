import { useState, useEffect, useRef, Suspense, lazy } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FITNESS_CATEGORY } from "@/components/chat-interface";
import { ScrollArea } from "@/components/ui/scroll-area";

// Use lazy loading for better performance
const ChatInterface = lazy(() => import("@/components/chat-interface"));
const ActiveYou = lazy(() => import("@/components/active-you"));
const FitnessProfile = lazy(() => import("@/components/fitness-profile"));
const ProfileManager = lazy(() => import("@/components/profile-manager"));

// Import FitnessProfile type
import { FitnessProfile as ProfileType } from "@/components/fitness-profile";
import { 
  AlertCircle, 
  Brain, 
  Dumbbell, 
  Bird as YogaIcon, 
  Timer, 
  User, 
  Menu, 
  ArrowRight, 
  Flame, 
  Activity, 
  Waypoints, 
  X,
  ChevronLeft,
  LayoutGrid,
  Maximize,
  Minimize
} from "lucide-react";
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
  {
    id: 'stretch',
    title: 'Stretch Zone',
    description: 'Improve flexibility and recovery with guided stretching',
    icon: Activity, // Using Activity icon for stretch
    component: ActiveYou,
    props: { defaultTab: "stretch" as const }
  },
];

// Component for sidebar navigation item
function SidebarNavItem({ 
  title, 
  icon: Icon, 
  isActive, 
  onClick 
}: { 
  title: string; 
  icon: React.ComponentType<{ className?: string }>; 
  isActive: boolean;
  onClick: () => void;
}) {
  const themeColor = SECTION_COLORS.wellness;
  
  return (
    <div 
      className={`flex items-center p-3 rounded-md cursor-pointer transition-all ${
        isActive 
          ? `bg-[${themeColor}]/10 text-[${themeColor}]` 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
      onClick={onClick}
    >
      <Icon className={`h-5 w-5 mr-3 ${isActive ? `text-[${themeColor}]` : ''}`} />
      <span className={`text-sm font-medium ${isActive ? `text-[${themeColor}]` : ''}`}>
        {title}
      </span>
    </div>
  );
}

// Component for skeleton loading states
function ComponentSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-4/6"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
      </div>
    </div>
  );
}

// New grid view component for module selection
function ModuleGrid({ 
  sections, 
  onSelectModule 
}: { 
  sections: SectionType[]; 
  onSelectModule: (id: string) => void;
}) {
  const themeColor = SECTION_COLORS.wellness;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {sections.map(section => (
        <Card 
          key={section.id}
          className="cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden relative h-full border-2"
          onClick={() => onSelectModule(section.id)}
          style={{ borderColor: section.id === 'yoga' || section.id === 'running' ? themeColor : 'transparent' }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <section.icon className={`h-5 w-5 mr-2 text-[${themeColor}]`} />
              <CardTitle className="text-lg" style={{ color: themeColor }}>
                {section.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm mb-4 line-clamp-2">
              {section.description}
            </CardDescription>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Open module</span>
              <ArrowRight className="h-4 w-4" color={themeColor} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ActiveFullscreen() {
  const { toast } = useToast();
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [skipProfile, setSkipProfile] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'module'>('grid');
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const themeColor = SECTION_COLORS.wellness;

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast({
          variant: "destructive",
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
        });
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

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

  // Handle selecting a module from the grid or sidebar
  const handleSelectModule = (sectionId: string) => {
    setActiveSection(sectionId);
    setViewMode('module');
  };

  // Handle closing a module and returning to grid view
  const handleCloseModule = () => {
    setActiveSection(null);
    setViewMode('grid');
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

  // Handle fullscreen change events
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', onFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  // If profile not set up and not skipped, show profile setup
  if (!hasProfile && !skipProfile) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-4xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
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
      </div>
    );
  }

  // Find the active section object
  const activeSectionObj = activeSection ? SECTIONS.find(s => s.id === activeSection) : null;
  
  // Prepare component props for the active section
  const componentProps = activeSectionObj && activeSectionObj.id === 'activeyou' && handleProfileComplete
    ? { ...activeSectionObj.props, onUpdate: handleProfileComplete }
    : activeSectionObj?.props;

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Top navigation bar */}
      <div 
        className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800"
        style={{ borderColor: themeColor }}
      >
        <div className="flex items-center">
          {viewMode === 'module' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCloseModule}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          
          <div className="flex items-center">
            <Dumbbell className="h-6 w-6 mr-2" style={{ color: themeColor }} />
            <h1 className="text-xl font-bold" style={{ color: themeColor }}>
              Active You
              {viewMode === 'module' && activeSectionObj && (
                <span className="ml-2 text-gray-500">/ {activeSectionObj.title}</span>
              )}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {viewMode === 'module' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSidebarVisible(!sidebarVisible)}
              className="hidden md:flex"
            >
              <Menu className="h-4 w-4" />
              <span className="ml-2">{sidebarVisible ? 'Hide' : 'Show'} Menu</span>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <>
                <Minimize className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Fullscreen</span>
              </>
            )}
          </Button>
          
          {viewMode === 'module' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCloseModule}
              className="md:hidden"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (only visible in module view and if sidebar is toggled on) */}
        {viewMode === 'module' && sidebarVisible && (
          <div className="w-64 border-r bg-white dark:bg-gray-800 flex-shrink-0 hidden md:block">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                  Fitness Modules
                </h2>
                <div className="space-y-1">
                  {SECTIONS.map(section => (
                    <SidebarNavItem 
                      key={section.id}
                      title={section.title}
                      icon={section.icon}
                      isActive={section.id === activeSection}
                      onClick={() => handleSelectModule(section.id)}
                    />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'grid' ? (
            <ModuleGrid 
              sections={SECTIONS} 
              onSelectModule={handleSelectModule} 
            />
          ) : activeSectionObj ? (
            <div className="h-full">
              {activeSectionObj.alert && (
                <div className="p-4 md:p-6">{activeSectionObj.alert}</div>
              )}
              
              <Suspense fallback={<ComponentSkeleton />}>
                <div className="p-0 h-full">
                  {activeSectionObj.id === 'coach' ? (
                    <ChatInterface category={FITNESS_CATEGORY} />
                  ) : (
                    <activeSectionObj.component {...componentProps} />
                  )}
                </div>
              </Suspense>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a module to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}