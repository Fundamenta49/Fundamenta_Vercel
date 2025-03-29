import { useState, useRef, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Brain, Flame, Heart, PhoneCall, X } from "lucide-react";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  FullScreenDialog,
  FullScreenDialogContent,
} from "@/components/ui/full-screen-dialog";

// Import pop-out components
import EmergencyAIPopOut from "@/components/emergency-ai-pop-out";
import EmergencyGuidePopOut from "@/components/emergency-guide-pop-out";
import FireSafetyPopOut from "@/components/fire-safety-pop-out";
import CPRGuidePopOut from "@/components/cpr-guide-pop-out";

// Define section properties
type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SECTIONS: SectionType[] = [
  {
    id: 'chat',
    title: 'Emergency AI Assistant',
    description: 'Get immediate guidance for emergency situations',
    icon: Brain,
  },
  {
    id: 'guides',
    title: 'Emergency Guides',
    description: 'Step-by-step guides for various emergency situations',
    icon: PhoneCall,
  },
  {
    id: 'fire',
    title: 'Fire Safety',
    description: 'Learn about fire prevention and emergency procedures',
    icon: Flame,
  },
  {
    id: 'cpr',
    title: 'CPR Training',
    description: 'Learn essential CPR and first aid techniques',
    icon: Heart,
  }
];

export default function Emergency() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Dialog states
  const [isEmergencyAIOpen, setIsEmergencyAIOpen] = useState(false);
  const [isEmergencyGuideOpen, setIsEmergencyGuideOpen] = useState(false);
  const [isFireSafetyOpen, setIsFireSafetyOpen] = useState(false);
  const [isCPRGuideOpen, setIsCPRGuideOpen] = useState(false);

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
    // Open the appropriate dialog based on the section clicked
    if (sectionId === 'chat') {
      setIsEmergencyAIOpen(true);
      
      // Show AI Assistant disclaimer toast
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
    }
    else if (sectionId === 'guides') {
      setIsEmergencyGuideOpen(true);
    }
    else if (sectionId === 'fire') {
      setIsFireSafetyOpen(true);
    }
    else if (sectionId === 'cpr') {
      setIsCPRGuideOpen(true);
      
      // Show CPR Training disclaimer toast
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
  };

  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-6">
        Emergency Assistance
      </h1>

      <Alert variant="default" className="mx-4 sm:mx-6 mb-4 border-red-500 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-800">
          In case of a life-threatening emergency, immediately call your local emergency services (911 in the US).
        </AlertDescription>
      </Alert>
      
      {/* Full-screen dialogs */}
      <FullScreenDialog open={isEmergencyAIOpen} onOpenChange={setIsEmergencyAIOpen}>
        <FullScreenDialogContent themeColor="#ef4444">
          <EmergencyAIPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isEmergencyGuideOpen} onOpenChange={setIsEmergencyGuideOpen}>
        <FullScreenDialogContent themeColor="#ef4444">
          <EmergencyGuidePopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isFireSafetyOpen} onOpenChange={setIsFireSafetyOpen}>
        <FullScreenDialogContent themeColor="#ef4444">
          <FireSafetyPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isCPRGuideOpen} onOpenChange={setIsCPRGuideOpen}>
        <FullScreenDialogContent themeColor="#ef4444">
          <CPRGuidePopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      {/* Book-style card carousel */}
      <div ref={carouselRef} className="book-carousel">
        <BookCarousel>
          {SECTIONS.map((section) => {
            return (
              <BookPage key={section.id} id={section.id}>
                <BookCard
                  id={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  isExpanded={false}
                  onToggle={handleCardClick}
                  color="text-red-500" // Emergency section color from the home page
                  children={null}
                />
              </BookPage>
            );
          })}
        </BookCarousel>
      </div>
    </div>
  );
}