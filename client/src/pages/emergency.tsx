import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Brain, Flame, Heart, PhoneCall } from "lucide-react";
import ChatInterface, { 
  ChatInterfaceComponent, 
  EMERGENCY_CATEGORY
} from "@/components/chat-interface";
import EmergencyGuide from "@/components/emergency-guide";
import CPRGuide from "@/components/cpr-guide";
import FireSafety from "@/components/fire-safety";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";

// Define a type for our sections to improve TypeScript support
type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  alert?: React.ReactNode;
};

const SECTIONS: SectionType[] = [
  {
    id: 'chat',
    title: 'Emergency AI Assistant',
    description: 'Get immediate guidance for emergency situations',
    icon: Brain,
    component: ChatInterface as ChatInterfaceComponent,
    props: { category: EMERGENCY_CATEGORY },
    alert: (
      <Alert className="mt-4 border-red-500 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-800 text-sm">
          For immediate emergency assistance, always call your local emergency services first.
          This AI assistant provides general guidance only.
        </AlertDescription>
      </Alert>
    )
  },
  {
    id: 'guides',
    title: 'Emergency Guides',
    description: 'Step-by-step guides for various emergency situations',
    icon: PhoneCall,
    component: EmergencyGuide
  },
  {
    id: 'fire',
    title: 'Fire Safety',
    description: 'Learn about fire prevention and emergency procedures',
    icon: Flame,
    component: FireSafety
  },
  {
    id: 'cpr',
    title: 'CPR Training',
    description: 'Learn essential CPR and first aid techniques',
    icon: Heart,
    component: CPRGuide
  }
];

export default function Emergency() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center pt-2">
        Emergency Assistance
      </h1>

      <Alert variant="destructive" className="mx-4 sm:mx-6 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          In case of a life-threatening emergency, immediately call your local emergency services (911 in the US).
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
                    {section.alert && (
                      <div className="mb-4">{section.alert}</div>
                    )}
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