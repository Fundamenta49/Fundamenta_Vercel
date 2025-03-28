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
import { useState } from "react";
import { cn } from "@/lib/utils";

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

  const handleCardClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Wellness & Nutrition</h1>

      <Alert variant="default" className="mb-6 border-blue-500 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-800">
          Remember to consult with healthcare professionals for medical advice. Our AI provides general wellness guidance only.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {SECTIONS.map((section) => (
          <Card 
            key={section.id}
            className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden",
              "hover:shadow-md bg-white w-full max-w-full",
              expandedSection === section.id ? "shadow-lg" : "shadow-sm"
            )}
          >
            {/* Only make the header clickable */}
            <div 
              onClick={() => handleCardClick(section.id)}
              className="cursor-pointer"
            >
              <CardHeader className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <section.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                </div>
                <CardDescription className="text-lg">
                  {section.description}
                </CardDescription>
              </CardHeader>
            </div>
            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                "overflow-hidden w-full",
                expandedSection === section.id ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <CardContent className="p-6">
                {expandedSection === section.id && (
                  <section.component {...(section.props || {})} />
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}