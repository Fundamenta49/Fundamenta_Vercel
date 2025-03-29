import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Heart, Apple, Book, MessageSquare, ShoppingBag, Calendar, AlertCircle, Plus } from "lucide-react";
import ChatInterface, { 
  ChatInterfaceComponent, 
  WELLNESS_CATEGORY 
} from "@/components/chat-interface";
import NutritionGuide from "@/components/nutrition-guide";
import NutritionTracker from "@/components/nutrition-tracker";
import ShoppingBuddy from "@/components/shopping-buddy";
import RiskAssessment from "@/components/risk-assessment";
import JournalPopOut from "@/components/journal-pop-out";
import RiskAssessmentPopOut from "@/components/risk-assessment-pop-out";
import NutritionGuidePopOut from "@/components/nutrition-guide-pop-out";
import NutritionTrackerPopOut from "@/components/nutrition-tracker-pop-out";
import ShoppingBuddyPopOut from "@/components/shopping-buddy-pop-out";
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
    component: ChatInterface as ChatInterfaceComponent,
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
    id: 'braintap',
    title: 'BrainTap',
    description: 'Check in with yourself and discover personalized mental wellness resources',
    icon: Heart,
    component: RiskAssessment
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
    description: 'Learn about healthy eating and meal planning',
    icon: Apple,
    component: NutritionGuide
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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isShoppingOpen, setIsShoppingOpen] = useState(false);

  const handleCardClick = (sectionId: string) => {
    // For the regular sections (like AI coach), we'll use the existing card expansion
    if (sectionId === 'coach') {
      setExpandedSection(expandedSection === sectionId ? null : sectionId);
    } 
    // For sections that should pop out, open the appropriate dialog
    else if (sectionId === 'journal') {
      setIsJournalOpen(true);
    }
    else if (sectionId === 'braintap') {
      setIsRiskOpen(true);
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
          <NutritionGuidePopOut />
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

      {/* Book-style card carousel */}
      <div ref={carouselRef} className="book-carousel">
        <BookCarousel>
          {SECTIONS.map((section) => {
            // Only expand the AI coach section using the card expanding functionality
            const isExpanded = section.id === 'coach' && expandedSection === section.id;
            
            return (
              <BookPage key={section.id} id={section.id}>
                <BookCard
                  id={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon as any}
                  isExpanded={isExpanded}
                  onToggle={handleCardClick}
                  color="text-purple-500" // Wellness section color from the home page
                >
                  {section.id === 'coach' && isExpanded && (
                    <div className="w-full">
                      {section.alert && (
                        <div className="mb-4">{section.alert}</div>
                      )}
                      <ChatInterface category={WELLNESS_CATEGORY} />
                    </div>
                  )}
                </BookCard>
              </BookPage>
            );
          })}
        </BookCarousel>
      </div>
    </div>
  );
}