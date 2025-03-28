import { useState } from "react";
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

  const handleCardClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Emergency Assistance</h1>

      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          In case of a life-threatening emergency, immediately call your local emergency services (911 in the US).
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
                {section.alert}
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