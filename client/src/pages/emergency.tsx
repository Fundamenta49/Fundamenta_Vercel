import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Brain, Flame, Heart, PhoneCall, ClipboardList, Car, ShoppingBag } from "lucide-react";
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
import EmergencyChecklistPopOut from "@/components/emergency-checklist-pop-out-new";
import AutoAccidentPopOut from "@/components/auto-accident-pop-out";
import SimpleEmergencyChecklist from "@/components/simple-emergency-checklist";

// Define section properties
type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SECTIONS: SectionType[] = [
  {
    id: 'supplies',
    title: 'Emergency Checklist',
    description: 'Checklist of essential items for emergency preparedness',
    icon: ShoppingBag,
  },
  /* Removed duplicate checklist button
  {
    id: 'checklists',
    title: 'Emergency Checklists',
    description: 'Preparation steps for different types of emergencies',
    icon: ClipboardList,
  }, */
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
    title: 'Fire Safety Guide',
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
  const [isSuppliesOpen, setIsSuppliesOpen] = useState(false);

  useEffect(() => {
    // Show disclaimer as a dismissable toast
    if (showDisclaimer) {
      const { dismiss } = toast({
        title: "Emergency Disclaimer",
        description: "In case of a life-threatening emergency, immediately call your local emergency services (911 in the US).",
        variant: "destructive",
        duration: 8000, // 8 seconds - reduced from 15
        className: "emergency-toast border-2 border-red-500 shadow-lg", // Make the toast more prominent
        action: (
          <button 
            onClick={() => dismiss()}
            className="rounded-md px-3 py-1 bg-red-50 text-red-900 text-xs font-medium hover:bg-red-100"
          >
            Dismiss
          </button>
        ),
      });
      
      // Set up a cleanup function to track when the toast is dismissed
      return () => {
        setShowDisclaimer(false);
      };
    }
  }, [showDisclaimer, toast]);

  const handleCardClick = (sectionId: string) => {
    // Open the appropriate dialog based on the section clicked
    if (sectionId === 'supplies') {
      setIsSuppliesOpen(true);
      
      // Show Emergency Checklist disclaimer toast
      const { dismiss: dismissChecklist } = toast({
        title: "Emergency Checklist",
        description: "Keep these essential supplies ready for emergencies. Check off items as you acquire them and add your own custom items.",
        duration: 4000, // Reduced duration for better responsiveness
        className: "emergency-toast shadow-md",
        action: (
          <button 
            onClick={() => dismissChecklist()}
            className="rounded-md px-2 py-1 bg-slate-50 text-slate-900 text-xs font-medium hover:bg-slate-100"
          >
            Got it
          </button>
        ),
      });
    }
    else if (sectionId === 'checklists') {
      setIsChecklistsOpen(true);
      
      // Show Emergency Checklists disclaimer toast
      const { dismiss: dismissChecklists } = toast({
        title: "Emergency Checklists",
        description: "These checklists provide general preparation guidelines. Adapt them to your specific situation and local emergency protocols.",
        duration: 4000, // Reduced duration for better responsiveness
        className: "emergency-toast shadow-md",
        action: (
          <button 
            onClick={() => dismissChecklists()}
            className="rounded-md px-2 py-1 bg-slate-50 text-slate-900 text-xs font-medium hover:bg-slate-100"
          >
            Got it
          </button>
        ),
      });
    }
    else if (sectionId === 'guides') {
      setIsEmergencyGuideOpen(true);
    }
    else if (sectionId === 'auto') {
      setIsAutoAccidentOpen(true);
      
      // Show Auto Accident disclaimer toast
      const { dismiss: dismissAccident } = toast({
        title: "Auto Accident Response",
        description: "In case of a serious accident with injuries, immediately call your local emergency services (911 in the US).",
        variant: "destructive",
        duration: 4000, // Reduced duration for better responsiveness
        className: "emergency-toast border-2 border-red-500 shadow-lg",
        action: (
          <button 
            onClick={() => dismissAccident()}
            className="rounded-md px-2 py-1 bg-red-50 text-red-900 text-xs font-medium hover:bg-red-100"
          >
            Got it
          </button>
        ),
      });
    }
    else if (sectionId === 'fire') {
      setIsFireSafetyOpen(true);
    }
    else if (sectionId === 'cpr') {
      setIsCPRGuideOpen(true);
      
      // Show CPR Training disclaimer toast
      const { dismiss: dismissCPR } = toast({
        title: "CPR Training Disclaimer",
        description: "This guide is not a substitute for professional CPR training. Please seek certified training for proper CPR techniques.",
        duration: 4000, // Reduced duration for better responsiveness
        className: "emergency-toast shadow-md",
        action: (
          <button 
            onClick={() => dismissCPR()}
            className="rounded-md px-2 py-1 bg-slate-50 text-slate-900 text-xs font-medium hover:bg-slate-100"
          >
            Got it
          </button>
        ),
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

      {/* We're not using the EmergencyChecklistPopOut anymore, using SimpleEmergencyChecklist instead */}

      <FullScreenDialog open={isAutoAccidentOpen} onOpenChange={setIsAutoAccidentOpen}>
        <FullScreenDialogContent themeColor="#ef4444" className="overflow-x-hidden">
          <AutoAccidentPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isSuppliesOpen} onOpenChange={setIsSuppliesOpen}>
        <FullScreenDialogContent themeColor="#ef4444" className="w-full max-w-full h-full">
          <div className="p-4 md:p-6 h-full">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-red-500" />
              Emergency Preparedness Checklist
            </h2>
            <SimpleEmergencyChecklist />
          </div>
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
              <div key={section.id} className={`flex flex-col h-full ${section.id === 'cpr' ? 'col-span-2' : ''}`}>
                <button
                  onClick={() => handleCardClick(section.id)}
                  className={`relative flex flex-col items-center justify-between p-4 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-red-500 min-h-[130px] sm:min-h-[160px] w-full h-full ${section.id === 'cpr' ? 'sm:flex-row sm:items-start sm:text-left sm:justify-start' : ''}`}
                  aria-label={`Open ${section.title}`}
                >
                  <div className={`flex items-center justify-center h-12 sm:h-14 ${section.id === 'cpr' ? 'sm:mr-6' : 'w-full'} mb-2`}>
                    <section.icon className="w-9 h-9 sm:w-10 sm:h-10 text-red-500" />
                  </div>
                  
                  <div className={`flex flex-col ${section.id === 'cpr' ? 'sm:items-start items-center' : 'items-center'} w-full`}>
                    <span className={`text-sm sm:text-base font-medium ${section.id === 'cpr' ? 'sm:text-left text-center' : 'text-center'} line-clamp-2 w-full`}>{section.title}</span>
                    
                    <p className={`text-xs text-gray-500 mt-1 ${section.id === 'cpr' ? 'line-clamp-3 sm:block' : 'line-clamp-2 hidden sm:block'} ${section.id === 'cpr' ? 'sm:text-left text-center' : 'text-center'}`}>
                      {section.description.length > (section.id === 'cpr' ? 100 : 60) 
                        ? `${section.description.substring(0, section.id === 'cpr' ? 100 : 60)}...` 
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
  );
}