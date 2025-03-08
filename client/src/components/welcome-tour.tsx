import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  GraduationCap,
  DollarSign,
  Briefcase,
  Heart,
  Activity,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tourSteps = [
  {
    title: "Welcome to Fundamenta! 👋",
    description: "I'm your AI guide! Let me show you around our features. Feel free to ask any questions along the way!",
    icon: null,
    path: "/",
  },
  {
    title: "Life Skills",
    description: "This is where your growth journey begins! Let's take a look at the Life Skills section.",
    icon: <GraduationCap className="h-8 w-8 text-orange-500" />,
    path: "/learning",
  },
  {
    title: "Financial Literacy",
    description: "Master your finances with our AI-powered tools. Let's check out the budgeting features!",
    icon: <DollarSign className="h-8 w-8 text-green-500" />,
    path: "/finance",
  },
  {
    title: "Career Development",
    description: "Build your professional future. Want to see how our AI helps with resume building?",
    icon: <Briefcase className="h-8 w-8 text-blue-500" />,
    path: "/career",
  },
  {
    title: "Wellness & Nutrition",
    description: "Take care of your mental and physical health. Let's explore meditation guides!",
    icon: <Heart className="h-8 w-8 text-purple-500" />,
    path: "/wellness",
  },
  {
    title: "Active You",
    description: "Stay fit with personalized workout plans. Shall we look at the fitness tracking features?",
    icon: <Activity className="h-8 w-8 text-pink-500" />,
    path: "/active",
  },
  {
    title: "Emergency Guidance",
    description: "Quick help when you need it most. Important to know where this is!",
    icon: <AlertCircle className="h-8 w-8 text-red-500" />,
    path: "/emergency",
  },
  {
    title: "You're All Set! 🎉",
    description: "Remember, I'm here to help anytime. Just click the chat icon in any section!",
    icon: null,
    path: "/",
  },
];

export default function WelcomeTour() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userQuestion, setUserQuestion] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    console.log("Welcome Tour - First Visit Check:", !hasSeenTour);
    if (!hasSeenTour) {
      console.log("Opening welcome tour...");
      setOpen(true);
    }
  }, []);

  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep < tourSteps.length) {
      setCurrentStep(nextStep);
      // Navigate to the feature's page
      if (tourSteps[nextStep].path !== "/") {
        setLocation(tourSteps[nextStep].path);
      }
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("hasSeenTour", "true");
    setOpen(false);
    setCurrentStep(0);
    setLocation("/");
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenTour", "true");
    setOpen(false);
    setLocation("/");
  };

  const handleAskQuestion = async () => {
    if (!userQuestion.trim()) return;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userQuestion,
          category: "tour",
          context: `User is on step ${currentStep + 1} of the tour: ${tourSteps[currentStep].title}`
        })
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const data = await response.json();
      setAiResponse(data.response);
      setUserQuestion("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Couldn't get an answer. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center mb-4"
          >
            {tourSteps[currentStep].icon}
          </motion.div>
          <DialogTitle className="text-center text-xl">
            {tourSteps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {tourSteps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-primary/10 p-4 rounded-lg mt-4"
            >
              <p className="text-sm">{aiResponse}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Ask me anything about this feature..."
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleAskQuestion}
            disabled={!userQuestion.trim()}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <div className="flex gap-1">
            {tourSteps.map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: index === currentStep ? 1.2 : 1,
                  backgroundColor: index === currentStep ? "var(--primary)" : "var(--muted)"
                }}
                className={`h-1.5 w-1.5 rounded-full`}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-6">
          {currentStep === 0 ? (
            <Button variant="ghost" onClick={handleSkip}>
              Skip Tour
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => {
              setCurrentStep(currentStep - 1);
              setLocation(tourSteps[currentStep - 1].path);
            }}>
              Back
            </Button>
          )}
          <Button onClick={handleNext}>
            {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}