import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Flame, Heart, PhoneCall, X } from "lucide-react";
import ChatInterface, { 
  ChatInterfaceComponent, 
  EMERGENCY_CATEGORY
} from "@/components/chat-interface";
import EmergencyGuide from "@/components/emergency-guide";
import CPRGuide from "@/components/cpr-guide";
import FireSafety from "@/components/fire-safety";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Define a type for our sections to improve TypeScript support
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
    title: 'Emergency AI Assistant',
    description: 'Get immediate guidance for emergency situations',
    icon: Brain,
    component: ChatInterface as ChatInterfaceComponent,
    props: { category: EMERGENCY_CATEGORY }
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
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Show disclaimer as a dismissable toast
    if (showDisclaimer) {
      toast({
        title: "Emergency Disclaimer",
        description: "In case of a life-threatening emergency, immediately call your local emergency services (911 in the US).",
        variant: "destructive",
        duration: 15000, // 15 seconds
        action: (
          <Button variant="outline" size="sm" onClick={() => setShowDisclaimer(false)}>
            <X className="h-4 w-4" />
          </Button>
        ),
      });
    }
  }, [showDisclaimer, toast]);

  const handleCardClick = (sectionId: string) => {
    const newExpandedState = expandedSection === sectionId ? null : sectionId;
    setExpandedSection(newExpandedState);
    
    // Show section-specific disclaimer toast when opening a card
    if (newExpandedState) {
      if (newExpandedState === 'chat') {
        toast({
          title: "AI Assistant Disclaimer",
          description: "For immediate emergency assistance, always call your local emergency services first. This AI assistant provides general guidance only.",
          duration: 10000,
          action: (
            <Button variant="outline" size="sm" onClick={() => {}}>
              <X className="h-4 w-4" />
            </Button>
          ),
        });
      } else if (newExpandedState === 'cpr') {
        toast({
          title: "CPR Training Disclaimer",
          description: "This guide is not a substitute for professional CPR training. Please seek certified training for proper CPR techniques.",
          duration: 10000,
          action: (
            <Button variant="outline" size="sm" onClick={() => {}}>
              <X className="h-4 w-4" />
            </Button>
          ),
        });
      }
    }
  };

  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-6">
        Emergency Assistance
      </h1>

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
                  color="text-red-500" // Emergency section color from the home page
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