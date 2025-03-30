import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Heart, Apple, Book, MessageSquare, ShoppingBag, Calendar, AlertCircle, Plus, Dumbbell } from "lucide-react";
import ChatInterface, { 
  WELLNESS_CATEGORY 
} from "@/components/chat-interface";
import NutritionTracker from "@/components/nutrition-tracker";
import ShoppingBuddy from "@/components/shopping-buddy";
import RiskAssessment from "@/components/risk-assessment";
import BrainTap from "@/components/brain-tap";
import ComprehensiveWellnessAssessment from "@/components/comprehensive-wellness-assessment";
import IntegratedNutrition from "@/components/integrated-nutrition";
import JournalPopOut from "@/components/journal-pop-out";
import RiskAssessmentPopOut from "@/components/risk-assessment-pop-out";
import IntegratedNutritionPopOut from "@/components/integrated-nutrition-pop-out";
import NutritionTrackerPopOut from "@/components/nutrition-tracker-pop-out";
import ShoppingBuddyPopOut from "@/components/shopping-buddy-pop-out";
import WellnessCoachPopOut from "@/components/wellness-coach-pop-out";
import BrainTapPopOut from "@/components/brain-tap-pop-out";
import ComprehensiveWellnessPopOut from "@/components/comprehensive-wellness-pop-out";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";
import { Button } from "@/components/ui/button";
import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogTrigger,
} from "@/components/ui/full-screen-dialog";

type ChatInterfaceProps = {
  category: typeof WELLNESS_CATEGORY;
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
    title: 'Wellness AI Coach',
    description: 'Get personalized guidance on nutrition, mental health, and wellness',
    icon: Brain,
    component: ChatInterface,
    props: { category: WELLNESS_CATEGORY },
    alert: (
      <Alert className="mt-4 border-purple-500 bg-purple-50">
        <AlertCircle className="h-4 w-4 text-purple-500" />
        <AlertDescription className="text-purple-800 text-sm">
          The AI coach provides general wellness guidance based on public health information.
          Always consult healthcare professionals for medical advice.
        </AlertDescription>
      </Alert>
    )
  },
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

  const handleCardClick = (sectionId: string) => {
    // Open the appropriate dialog based on the section clicked
    if (sectionId === 'coach') {
      setIsCoachOpen(true);
    }
    else if (sectionId === 'journal') {
      setIsJournalOpen(true);
    }
    else if (sectionId === 'braintap') {
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
  };

  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-6">
        Wellness & Nutrition
      </h1>

      <Alert variant="default" className="mx-4 sm:mx-6 mb-4 border-blue-500 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-800">
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
      
      <FullScreenDialog open={isCoachOpen} onOpenChange={setIsCoachOpen}>
        <FullScreenDialogContent themeColor="#a855f7">
          <WellnessCoachPopOut />
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

      {/* Grid-style cards layout (similar to Learning section) */}
      <div className="px-3 sm:px-5 pt-2">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 px-2 py-2 bg-purple-50 text-purple-800 rounded-md border-l-4 border-purple-500">
            Wellness Tools
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 mt-4">
            {SECTIONS.map((section) => (
              <div key={section.id} className="flex flex-col">
                <button
                  onClick={() => handleCardClick(section.id)}
                  className="relative flex flex-col items-center justify-between p-3 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-purple-500 min-h-[80px] sm:min-h-[100px] lg:min-h-[110px] w-full"
                  aria-label={`Open ${section.title}`}
                >
                  <div className="flex items-center justify-center h-10 sm:h-12 w-full">
                    <section.icon className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500" />
                  </div>
                  
                  <span className="text-xs sm:text-sm md:text-base font-medium text-center line-clamp-2 w-full mt-2">{section.title}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}