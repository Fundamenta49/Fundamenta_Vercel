import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, DollarSign, Briefcase, Heart, GraduationCap, Activity, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Import all the components we'll show in dialogs
import Learning from "./learning";
import Finance from "./finance";
import Career from "./career";
import Wellness from "./wellness";
import Active from "./active";
import EmergencyGuide from "@/components/emergency-guide";

const features = [
  {
    title: "Life Skills",
    description: "Learn essential skills, personal development, and continuous learning",
    icon: GraduationCap,
    href: "/learning",
    color: "text-orange-500",
    component: Learning
  },
  {
    title: "Financial Literacy",
    description: "Learn budgeting, savings, and financial planning",
    icon: DollarSign,
    href: "/finance",
    color: "text-green-500",
    component: Finance
  },
  {
    title: "Career Development",
    description: "Build your resume and prepare for interviews",
    icon: Briefcase,
    href: "/career",
    color: "text-blue-500",
    component: Career
  },
  {
    title: "Wellness & Nutrition",
    description: "Access mental health resources, meditation guides, and nutrition advice",
    icon: Heart,
    href: "/wellness",
    color: "text-purple-500",
    component: Wellness
  },
  {
    title: "Active You",
    description: "Get personalized fitness guidance with AI-powered workout plans",
    icon: Activity,
    href: "/active",
    color: "text-pink-500",
    component: Active
  },
  {
    title: "Emergency Guidance",
    description: "Get instant step-by-step guidance for emergency situations",
    icon: AlertCircle,
    href: "/emergency",
    color: "text-red-500",
    component: EmergencyGuide
  },
];

export default function Home() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const restartTour = () => {
    localStorage.removeItem("hasSeenTour");
    window.location.reload();
  };

  const handleCardClick = (feature: typeof features[0]) => {
    setSelectedFeature(feature.title);
  };

  const selectedFeatureData = features.find(f => f.title === selectedFeature);
  const FeatureComponent = selectedFeatureData?.component;

  return (
    <div className="px-4 py-8">
      <div className="text-center mb-12 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={restartTour}
          className="absolute right-0 top-0 text-muted-foreground hover:text-primary"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-[#1C3D5A]">
          Welcome to Fundamenta
        </h1>
        <p className="text-lg text-muted-foreground">
          Your AI-powered assistant for life skills and wellness
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.href}
            className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-white border border-gray-200"
            onClick={() => handleCardClick(feature)}
          >
            <CardHeader>
              <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
              <CardTitle className="text-[#1C3D5A]">{feature.title}</CardTitle>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {selectedFeatureData && (
                <>
                  <selectedFeatureData.icon 
                    className={`h-6 w-6 ${selectedFeatureData.color}`} 
                  />
                  <DialogTitle className="text-2xl">
                    {selectedFeatureData.title}
                  </DialogTitle>
                </>
              )}
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-8rem)]">
            {FeatureComponent && <FeatureComponent />}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}