import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Heart, Apple, Book, MessageSquare, ShoppingBag, Calendar, AlertCircle, Plus, Dumbbell, Shield, ArrowRight, Activity, Clipboard, Coffee } from "lucide-react";
import { WELLNESS_CATEGORY } from "@/components/chat-interface";
import ChatRedirect, { ChatCategory } from "@/components/chat-redirect";
import { useState, useRef, useEffect, Suspense, lazy } from "react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";
import { Button } from "@/components/ui/button";
import {
  MegaDialog,
  MegaDialogContent,
  MegaDialogHeader,
  MegaDialogTitle,
  MegaDialogBody,
} from "@/components/ui/mega-dialog";

// Use lazy loading for all components for better performance
const NutritionTracker = lazy(() => import("@/components/nutrition-tracker"));
const ShoppingBuddy = lazy(() => import("@/components/shopping-buddy"));
const RiskAssessment = lazy(() => import("@/components/risk-assessment"));
const BrainTap = lazy(() => import("@/components/brain-tap"));
// Comprehensive wellness assessment components removed as they were redundant
const WellnessIntegration = lazy(() => import("@/components/wellness-integration"));
const PHQ9Assessment = lazy(() => import("@/components/phq9-assessment"));
const PAVSAssessment = lazy(() => import("@/components/pavs-assessment"));
const IntegratedNutrition = lazy(() => import("@/components/integrated-nutrition"));
const JournalPopOut = lazy(() => import("@/components/journal-pop-out"));
const RiskAssessmentPopOut = lazy(() => import("@/components/risk-assessment-pop-out"));
const IntegratedNutritionPopOut = lazy(() => import("@/components/integrated-nutrition-pop-out"));
const NutritionTrackerPopOut = lazy(() => import("@/components/nutrition-tracker-pop-out"));
const ShoppingBuddyPopOut = lazy(() => import("@/components/shopping-buddy-pop-out"));
const WellnessCoachPopOut = lazy(() => import("@/components/wellness-coach-pop-out"));
const BrainTapPopOut = lazy(() => import("@/components/brain-tap-pop-out"));

type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  props?: Record<string, any> | { category: ChatCategory };
  alert?: React.ReactNode;
};

const SECTIONS: SectionType[] = [
  {
    id: 'wellness-profile',
    title: 'Wellness Profile',
    description: 'View your personalized wellness assessment results and recommendations',
    icon: Heart,
    component: WellnessIntegration
  },
  {
    id: 'mental-health',
    title: 'Coffee Talk',
    description: "Let's connect—and realign—with what really matters",
    icon: Coffee,
    component: PHQ9Assessment
  },
  {
    id: 'physical-activity',
    title: 'Physical Activity Assessment',
    description: 'Evaluate your activity level and get personalized recommendations',
    icon: Activity, 
    component: PAVSAssessment
  },
  {
    id: 'journal',
    title: 'Wellness Journal',
    description: 'Track your thoughts, feelings, and personal growth',
    icon: Book,
    component: JournalPopOut
  },
  {
    id: 'nutrition',
    title: 'Nutrition Guide',
    description: 'Learn about nutrition and get personalized recommendations',
    icon: Apple,
    component: IntegratedNutrition
  },
  {
    id: 'tracker',
    title: 'Food Tracker',
    description: 'Monitor your daily nutrition and eating habits',
    icon: Calendar,
    component: NutritionTracker
  },
  {
    id: 'shopping',
    title: 'Shopping Buddy',
    description: 'Get help with grocery planning and healthy food choices',
    icon: ShoppingBag,
    component: ShoppingBuddy
  }
];

export default function Wellness() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const [isBrainTapOpen, setIsBrainTapOpen] = useState(false);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isShoppingOpen, setIsShoppingOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  // Comprehensive assessment removed as it was redundant
  const [isWellnessProfileOpen, setIsWellnessProfileOpen] = useState(false);
  const [isMentalHealthOpen, setIsMentalHealthOpen] = useState(false);
  const [isPhysicalActivityOpen, setIsPhysicalActivityOpen] = useState(false);
  
  // Check URL for parameters to automatically open certain sections
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const section = params.get('section');
  
  // Effect to open appropriate dialog based on URL parameters
  useEffect(() => {
    if (section) {
      console.log("Opening section from URL parameter:", section);
      handleSectionOpen(section);
    }
  }, [section]);

  const handleCardClick = (sectionId: string) => {
    handleSectionOpen(sectionId);
  };
  
  const handleSectionOpen = (sectionId: string) => {
    // Open the appropriate dialog based on the section clicked or URL parameter
    if (sectionId === 'coach') {
      setIsCoachOpen(true);
    }
    else if (sectionId === 'journal') {
      setIsJournalOpen(true);
    }
    else if (sectionId === 'braintap') {
      setIsBrainTapOpen(true);
    }
    else if (sectionId === 'meditation' || sectionId === 'mindfulness') {
      // Map meditation and mindfulness URLs to the brain tap component
      setIsBrainTapOpen(true);
    }
    else if (sectionId === 'nutrition') {
      setIsNutritionOpen(true);
    }
    else if (sectionId === 'tracker') {
      setIsTrackerOpen(true);
    }
    else if (sectionId === 'shopping') {
      setIsShoppingOpen(true);
    }
    // Comprehensive section removed as it was redundant
    else if (sectionId === 'wellness-profile') {
      setIsWellnessProfileOpen(true);
    }
    else if (sectionId === 'mental-health') {
      setIsMentalHealthOpen(true);
    }
    else if (sectionId === 'physical-activity') {
      setIsPhysicalActivityOpen(true);
    }
    // Emergency section removed - now only in Emergency page
    else if (sectionId === 'stress-management') {
      // Map stress management to the coach with a stress management focus
      setIsCoachOpen(true);
    }
  };

  return (
    <div className="w-full h-full mx-auto p-0 md:p-2 lg:p-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-2 md:mb-4">
          Wellness & Nutrition
        </h1>

        <Alert variant="default" className="mx-3 sm:mx-5 mb-2 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            Remember to consult with healthcare professionals for medical advice. Our AI provides general wellness guidance only.
          </AlertDescription>
        </Alert>

        {/* MegaDialog implementations for each section */}
        <MegaDialog open={isJournalOpen} onOpenChange={setIsJournalOpen}>
          <MegaDialogContent>
            <MegaDialogHeader>
              <MegaDialogTitle>Wellness Journal</MegaDialogTitle>
            </MegaDialogHeader>
            <MegaDialogBody>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="text-muted-foreground">Loading Wellness Journal...</p>
                </div>
              }>
                <JournalPopOut />
              </Suspense>
            </MegaDialogBody>
          </MegaDialogContent>
        </MegaDialog>

        <MegaDialog open={isRiskOpen} onOpenChange={setIsRiskOpen}>
          <MegaDialogContent>
            <MegaDialogHeader>
              <MegaDialogTitle>Risk Assessment</MegaDialogTitle>
            </MegaDialogHeader>
            <MegaDialogBody>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="text-muted-foreground">Loading Risk Assessment...</p>
                </div>
              }>
                <RiskAssessmentPopOut />
              </Suspense>
            </MegaDialogBody>
          </MegaDialogContent>
        </MegaDialog>

        <MegaDialog open={isNutritionOpen} onOpenChange={setIsNutritionOpen}>
          <MegaDialogContent>
            <MegaDialogHeader>
              <MegaDialogTitle>Nutrition Guide</MegaDialogTitle>
            </MegaDialogHeader>
            <MegaDialogBody>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="text-muted-foreground">Loading Nutrition Guide...</p>
                </div>
              }>
                <IntegratedNutritionPopOut />
              </Suspense>
            </MegaDialogBody>
          </MegaDialogContent>
        </MegaDialog>

        <MegaDialog open={isTrackerOpen} onOpenChange={setIsTrackerOpen}>
          <MegaDialogContent>
            <MegaDialogHeader>
              <MegaDialogTitle>Food Tracker</MegaDialogTitle>
            </MegaDialogHeader>
            <MegaDialogBody>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="text-muted-foreground">Loading Food Tracker...</p>
                </div>
              }>
                <NutritionTrackerPopOut />
              </Suspense>
            </MegaDialogBody>
          </MegaDialogContent>
        </MegaDialog>

        <MegaDialog open={isShoppingOpen} onOpenChange={setIsShoppingOpen}>
          <MegaDialogContent>
            <MegaDialogHeader>
              <MegaDialogTitle>Shopping Buddy</MegaDialogTitle>
            </MegaDialogHeader>
            <MegaDialogBody>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="text-muted-foreground">Loading Shopping Buddy...</p>
                </div>
              }>
                <ShoppingBuddyPopOut />
              </Suspense>
            </MegaDialogBody>
          </MegaDialogContent>
        </MegaDialog>
        
        <MegaDialog open={isBrainTapOpen} onOpenChange={setIsBrainTapOpen}>
          <MegaDialogContent>
            <MegaDialogHeader>
              <MegaDialogTitle>BrainTap Mindfulness</MegaDialogTitle>
            </MegaDialogHeader>
            <MegaDialogBody>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="text-muted-foreground">Loading BrainTap Mindfulness...</p>
                </div>
              }>
                <BrainTapPopOut />
              </Suspense>
            </MegaDialogBody>
          </MegaDialogContent>
        </MegaDialog>
        
        {/* Comprehensive Assessment dialog removed as it was redundant */}

        <MegaDialog open={isCoachOpen} onOpenChange={setIsCoachOpen}>
          <MegaDialogContent>
            <MegaDialogHeader>
              <MegaDialogTitle>Wellness Coach</MegaDialogTitle>
            </MegaDialogHeader>
            <MegaDialogBody>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="text-muted-foreground">Loading Wellness Coach...</p>
                </div>
              }>
                <WellnessCoachPopOut />
              </Suspense>
            </MegaDialogBody>
          </MegaDialogContent>
        </MegaDialog>

        <MegaDialog open={isWellnessProfileOpen} onOpenChange={setIsWellnessProfileOpen}>
          <MegaDialogContent>
            <MegaDialogHeader>
              <MegaDialogTitle>Your Wellness Profile</MegaDialogTitle>
            </MegaDialogHeader>
            <MegaDialogBody>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="text-muted-foreground">Loading Wellness Profile...</p>
                </div>
              }>
                <WellnessIntegration />
              </Suspense>
            </MegaDialogBody>
          </MegaDialogContent>
        </MegaDialog>

        <MegaDialog open={isMentalHealthOpen} onOpenChange={setIsMentalHealthOpen}>
          <MegaDialogContent>
            <MegaDialogHeader>
              <MegaDialogTitle>Coffee Talk</MegaDialogTitle>
            </MegaDialogHeader>
            <MegaDialogBody>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                  <p className="text-muted-foreground">Brewing your Coffee Talk experience...</p>
                </div>
              }>
                <PHQ9Assessment />
              </Suspense>
            </MegaDialogBody>
          </MegaDialogContent>
        </MegaDialog>

        <MegaDialog open={isPhysicalActivityOpen} onOpenChange={setIsPhysicalActivityOpen}>
          <MegaDialogContent>
            <MegaDialogHeader>
              <MegaDialogTitle>Physical Activity Assessment (PAVS)</MegaDialogTitle>
            </MegaDialogHeader>
            <MegaDialogBody>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="text-muted-foreground">Loading Physical Activity Assessment...</p>
                </div>
              }>
                <PAVSAssessment />
              </Suspense>
            </MegaDialogBody>
          </MegaDialogContent>
        </MegaDialog>

        {/* Grid-style cards layout (similar to Learning section) */}
        <div className="px-2">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2 px-2 py-1 bg-purple-50 text-purple-800 rounded-md border-l-4 border-purple-500">
              Wellness Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-4 px-1 sm:px-0 max-w-6xl mx-auto">
              {SECTIONS.map((section) => (
                <div 
                  key={section.id} 
                  className={`flex flex-col h-full ${section.id === 'shopping' ? 'col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-4 xl:col-span-4' : ''}`}
                >
                  <button
                    onClick={() => handleCardClick(section.id)}
                    className={`relative flex flex-col items-center justify-between p-4 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${section.id === 'mental-health' ? 'hover:border-amber-500' : 'hover:border-purple-500'} min-h-[130px] sm:min-h-[160px] md:min-h-[170px] lg:min-h-[180px] w-full h-full ${section.id === 'shopping' ? 'sm:flex-row sm:items-start sm:text-left sm:justify-start sm:min-h-[140px] md:min-h-[150px]' : ''}`}
                    aria-label={`Open ${section.title}`}
                  >
                    <div className={`flex items-center justify-center h-12 sm:h-14 md:h-14 ${section.id === 'shopping' ? 'sm:mr-6' : 'w-full'} mb-2`}>
                      <section.icon className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 ${section.id === 'mental-health' ? 'text-amber-600' : 'text-purple-500'}`} />
                    </div>
                    
                    <div className={`flex flex-col ${section.id === 'shopping' ? 'sm:items-start items-center' : 'items-center'} w-full`}>
                      <span className={`text-sm sm:text-base md:text-lg font-medium ${section.id === 'shopping' ? 'sm:text-left text-center' : 'text-center'} line-clamp-2 w-full`}>{section.title}</span>
                      
                      <p className={`text-xs sm:text-sm text-gray-500 mt-1 md:mt-2 line-clamp-3 ${section.id === 'shopping' ? 'sm:text-left text-center' : 'text-center'} block`}>
                        {section.description.length > (section.id === 'shopping' ? 100 : 80) 
                          ? `${section.description.substring(0, section.id === 'shopping' ? 100 : 80)}...` 
                          : section.description}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
