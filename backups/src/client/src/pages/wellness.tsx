import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Heart, Apple, Book, MessageSquare, ShoppingBag, Calendar, AlertCircle, Plus, Dumbbell, Shield } from "lucide-react";
import { WELLNESS_CATEGORY } from "@/components/chat-interface";
import ChatRedirect, { ChatCategory } from "@/components/chat-redirect";
import NutritionTracker from "@/components/nutrition-tracker";
import ShoppingBuddy from "@/components/shopping-buddy";
import RiskAssessment from "@/components/risk-assessment";
import BrainTap from "@/components/brain-tap";
import ComprehensiveWellnessAssessment from "@/components/comprehensive-wellness-assessment";
import IntegratedNutrition from "@/components/integrated-nutrition";
// Emergency checklist has been moved to the Emergency section
import JournalPopOut from "@/components/journal-pop-out";
import RiskAssessmentPopOut from "@/components/risk-assessment-pop-out";
import IntegratedNutritionPopOut from "@/components/integrated-nutrition-pop-out";
import NutritionTrackerPopOut from "@/components/nutrition-tracker-pop-out";
import ShoppingBuddyPopOut from "@/components/shopping-buddy-pop-out";
import WellnessCoachPopOut from "@/components/wellness-coach-pop-out";
import BrainTapPopOut from "@/components/brain-tap-pop-out";
import ComprehensiveWellnessPopOut from "@/components/comprehensive-wellness-pop-out";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";
import { Button } from "@/components/ui/button";
import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogTrigger,
} from "@/components/ui/full-screen-dialog";

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
    id: 'comprehensive',
    title: 'Comprehensive Assessment',
    description: 'Complete physical and mental health evaluation with personalized recommendations',
    icon: Heart,
    component: ComprehensiveWellnessAssessment
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
  const [isComprehensiveOpen, setIsComprehensiveOpen] = useState(false);
  
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
    else if (sectionId === 'comprehensive') {
      setIsComprehensiveOpen(true);
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

        {/* Full-screen dialogs */}
        <FullScreenDialog open={isJournalOpen} onOpenChange={setIsJournalOpen}>
          <FullScreenDialogContent themeColor="#a855f7">
            <JournalPopOut />
          </FullScreenDialogContent>
        </FullScreenDialog>

        <FullScreenDialog open={isRiskOpen} onOpenChange={setIsRiskOpen}>
          <FullScreenDialogContent themeColor="#a855f7">
            <RiskAssessmentPopOut />
          </FullScreenDialogContent>
        </FullScreenDialog>

        <FullScreenDialog open={isNutritionOpen} onOpenChange={setIsNutritionOpen}>
          <FullScreenDialogContent themeColor="#a855f7">
            <IntegratedNutritionPopOut />
          </FullScreenDialogContent>
        </FullScreenDialog>

        <FullScreenDialog open={isTrackerOpen} onOpenChange={setIsTrackerOpen}>
          <FullScreenDialogContent themeColor="#a855f7">
            <NutritionTrackerPopOut />
          </FullScreenDialogContent>
        </FullScreenDialog>

        <FullScreenDialog open={isShoppingOpen} onOpenChange={setIsShoppingOpen}>
          <FullScreenDialogContent themeColor="#a855f7">
            <ShoppingBuddyPopOut />
          </FullScreenDialogContent>
        </FullScreenDialog>
        
        <FullScreenDialog open={isBrainTapOpen} onOpenChange={setIsBrainTapOpen}>
          <FullScreenDialogContent themeColor="#a855f7">
            <BrainTapPopOut />
          </FullScreenDialogContent>
        </FullScreenDialog>
        
        <FullScreenDialog open={isComprehensiveOpen} onOpenChange={setIsComprehensiveOpen}>
          <FullScreenDialogContent themeColor="#a855f7">
            <ComprehensiveWellnessPopOut />
          </FullScreenDialogContent>
        </FullScreenDialog>
        
        {/* Emergency checklist has been moved to the Emergency section */}

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
                    className={`relative flex flex-col items-center justify-between p-4 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-purple-500 min-h-[130px] sm:min-h-[160px] md:min-h-[170px] lg:min-h-[180px] w-full h-full ${section.id === 'shopping' ? 'sm:flex-row sm:items-start sm:text-left sm:justify-start sm:min-h-[140px] md:min-h-[150px]' : ''}`}
                    aria-label={`Open ${section.title}`}
                  >
                    <div className={`flex items-center justify-center h-12 sm:h-14 md:h-14 ${section.id === 'shopping' ? 'sm:mr-6' : 'w-full'} mb-2`}>
                      <section.icon className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 text-purple-500" />
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
