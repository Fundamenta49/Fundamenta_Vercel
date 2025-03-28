import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Heart, Apple, Book, MessageSquare, ShoppingBag, Calendar, AlertCircle } from "lucide-react";
import ChatInterface, { 
  ChatInterfaceComponent, 
  WELLNESS_CATEGORY 
} from "@/components/chat-interface";
import NutritionGuide from "@/components/nutrition-guide";
import NutritionTracker from "@/components/nutrition-tracker";
import ShoppingBuddy from "@/components/shopping-buddy";
import RiskAssessment from "@/components/risk-assessment";
import JournalEntry from "@/components/journal-entry";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";

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
    id: 'chat',
    title: 'Wellness AI Coach',
    description: 'Get guidance for mental health, well-being, and nutrition',
    icon: Brain,
    component: ChatInterface as ChatInterfaceComponent,
    props: { category: WELLNESS_CATEGORY }
  },
  {
    id: 'braintap',
    title: 'BrainTap',
    description: 'Check in with yourself and discover personalized mental wellness resources',
    icon: Heart,
    component: RiskAssessment,
    props: { category: WELLNESS_CATEGORY }
  },
  {
    id: 'journal',
    title: 'Wellness Journal',
    description: 'Track your thoughts, feelings, and personal growth',
    icon: Book,
    component: JournalEntry
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

  const handleCardClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
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

      {/* Book-style card carousel */}
      <div ref={carouselRef} className="book-carousel">
        <BookCarousel>
          {SECTIONS.map((section) => {
            const isExpanded = expandedSection === section.id;
            
            return (
              <BookPage key={section.id} id={section.id}>
                <BookCard
                  id={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon as any}
                  isExpanded={isExpanded}
                  onToggle={handleCardClick}
                >
                  <div className="w-full">
                    <section.component {...(section.props || {})} />
                  </div>
                </BookCard>
              </BookPage>
            );
          })}
        </BookCarousel>
      </div>
    </div>
  );
}