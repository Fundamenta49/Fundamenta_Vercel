import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Phone, 
  MessageSquare, 
  Shield, 
  AlertTriangle,
  Heart,
  LogOut,
  Check
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Quick exit functionality
const handleQuickExit = () => {
  // Redirect to a safe site (weather.com is commonly used as it's innocuous)
  window.location.href = "https://weather.com";
};

// Safety planning information
const safetyPlanSteps = [
  {
    title: "Create a Safety Word",
    content: "Choose a code word to alert friends/family when you need help"
  },
  {
    title: "Important Documents",
    content: "Keep copies of important documents (ID, birth certificates, financial records) in a safe place or with a trusted person"
  },
  {
    title: "Emergency Bag",
    content: "Pack an emergency bag with essentials (clothes, medications, money, copies of keys) and keep it somewhere safe"
  },
  {
    title: "Safe Contacts",
    content: "Memorize or safely store important phone numbers of trusted friends, family, or shelters"
  },
  {
    title: "Plan Escape Routes",
    content: "Know the quickest and safest ways to leave your home and workplace"
  }
];

export default function DomesticViolenceHelp() {
  const [showContent, setShowContent] = useState(true);
  
  // Listen for Escape key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleQuickExit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!showContent) return null;

  return (
    <div className="space-y-6 relative">
      {/* Quick Exit Button */}
      <Button
        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600"
        onClick={handleQuickExit}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Exit Now
      </Button>

      {/* Emergency Notice */}
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <AlertDescription className="text-red-800">
          If you are in immediate danger, call 911 or your local emergency number immediately.
        </AlertDescription>
      </Alert>

      {/* Hotlines Section */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-purple-600" />
            24/7 Crisis Hotlines
          </CardTitle>
          <CardDescription>
            Free, confidential support available anytime
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Button
              variant="default"
              className="justify-between"
              onClick={() => window.location.href = "tel:18007997233"}
            >
              National Domestic Violence Hotline
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="justify-between"
              onClick={() => window.location.href = "sms:88788"}
            >
              Text HELP to 88788
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Safety Planning */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Safety Planning
          </CardTitle>
          <CardDescription>
            Steps to help protect yourself and plan for your safety
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {safetyPlanSteps.map((step, index) => (
              <AccordionItem key={index} value={`step-${index}`}>
                <AccordionTrigger>{step.title}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{step.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-600" />
            Additional Resources
          </CardTitle>
          <CardDescription>
            Organizations and resources for support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Button
              variant="outline"
              className="justify-between"
              onClick={() => window.open("https://www.thehotline.org", "_blank")}
            >
              National Domestic Violence Hotline Website
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="justify-between"
              onClick={() => window.open("https://www.rainn.org", "_blank")}
            >
              RAINN - Sexual Assault Support
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="justify-between"
              onClick={() => window.open("https://www.loveisrespect.org", "_blank")}
            >
              Love Is Respect - Teen Dating Violence
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Browser Safety Notice */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          For your safety: Learn how to delete browser history, use private browsing, 
          or call from a safe phone. Press ESC key anytime for quick exit.
        </AlertDescription>
      </Alert>
    </div>
  );
}
