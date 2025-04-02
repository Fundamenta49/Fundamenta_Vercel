import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Brain, Flame, Heart, PhoneCall, ClipboardList, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  FullScreenDialog,
  FullScreenDialogContent,
} from "@/components/ui/full-screen-dialog";

// Import pop-out components
import EmergencyAIPopOut from "@/components/emergency-ai-pop-out";
import EmergencyGuidePopOut from "@/components/emergency-guide-pop-out";
import FireSafetyPopOut from "@/components/fire-safety-pop-out";
import CPRGuidePopOut from "@/components/cpr-guide-pop-out";
import EmergencyChecklistPopOut from "@/components/emergency-checklist-pop-out";
import AutoAccidentPopOut from "@/components/auto-accident-pop-out";

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
    id: 'checklists',
    title: 'Emergency Checklists',
    description: 'Preparation steps for different types of emergencies',
    icon: ClipboardList,
  },
  {
    id: 'guides',
    title: 'Emergency Guides',
    description: 'Step-by-step guides for various emergency situations',
    icon: PhoneCall,
  },
  {
    id: 'auto',
    title: 'Auto Accident Response',
    description: "What to do if you're involved in a vehicle accident",
    icon: Car,
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
  const { toast } = useToast();
  
  // Dialog states
  const [isEmergencyAIOpen, setIsEmergencyAIOpen] = useState(false);
  const [isEmergencyGuideOpen, setIsEmergencyGuideOpen] = useState(false);
  const [isFireSafetyOpen, setIsFireSafetyOpen] = useState(false);
  const [isCPRGuideOpen, setIsCPRGuideOpen] = useState(false);
  const [isChecklistsOpen, setIsChecklistsOpen] = useState(false);
  const [isAutoAccidentOpen, setIsAutoAccidentOpen] = useState(false);

  useEffect(() => {
    // Show disclaimer as a dismissable toast
    if (showDisclaimer) {
      const { dismiss } = toast({
        title: "Emergency Disclaimer",
        description: "In case of a life-threatening emergency, immediately call your local emergency services (911 in the US).",
        variant: "destructive",
        duration: 15000, // 15 seconds
      });
      
      // Set up a cleanup function to track when the toast is dismissed
      return () => {
        setShowDisclaimer(false);
      };
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
        duration: 5000, // Reduced duration for better responsiveness
      });
    }
    else if (sectionId === 'checklists') {
      setIsChecklistsOpen(true);
      
      // Show Emergency Checklists disclaimer toast
      toast({
        title: "Emergency Checklists",
        description: "These checklists provide general preparation guidelines. Adapt them to your specific situation and local emergency protocols.",
        duration: 5000, // Reduced duration for better responsiveness
      });
    }
    else if (sectionId === 'guides') {
      setIsEmergencyGuideOpen(true);
    }
    else if (sectionId === 'auto') {
      setIsAutoAccidentOpen(true);
      
      // Show Auto Accident disclaimer toast
      toast({
        title: "Auto Accident Response",
        description: "In case of a serious accident with injuries, immediately call your local emergency services (911 in the US).",
        variant: "destructive",
        duration: 5000, // Reduced duration for better responsiveness
      });
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
        duration: 5000, // Reduced duration for better responsiveness
      });
    }
  };

  return (
    <div className="w-full h-full mx-auto p-0 overflow-hidden">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
        Emergency Assistance
      </h1>

      <Alert variant="default" className="mx-3 sm:mx-5 mb-2 border-red-500 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-800 text-sm">
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

      <FullScreenDialog open={isChecklistsOpen} onOpenChange={setIsChecklistsOpen}>
        <FullScreenDialogContent themeColor="#ef4444">
          <EmergencyChecklistPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isAutoAccidentOpen} onOpenChange={setIsAutoAccidentOpen}>
        <FullScreenDialogContent themeColor="#ef4444" className="overflow-x-hidden">
          <AutoAccidentPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      {/* Grid-style cards layout */}
      <div className="px-2">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2 px-2 py-1 bg-red-50 text-red-800 rounded-md border-l-4 border-red-500">
            Emergency Resources
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 mt-4">
            {SECTIONS.map((section) => (
              <div key={section.id} className="flex flex-col h-full">
                <button
                  onClick={() => handleCardClick(section.id)}
                  className="relative flex flex-col items-center justify-between p-4 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-red-500 min-h-[130px] sm:min-h-[160px] w-full h-full"
                  aria-label={`Open ${section.title}`}
                >
                  <div className="flex items-center justify-center h-12 sm:h-14 w-full mb-2">
                    <section.icon className="w-9 h-9 sm:w-10 sm:h-10 text-red-500" />
                  </div>
                  
                  <span className="text-sm sm:text-base font-medium text-center line-clamp-2 w-full">{section.title}</span>
                  
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 text-center hidden sm:block">
                    {section.description.length > 60 
                      ? `${section.description.substring(0, 60)}...` 
                      : section.description}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}