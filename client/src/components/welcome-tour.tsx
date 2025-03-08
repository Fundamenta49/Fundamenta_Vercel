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
import { GraduationCap, DollarSign, Briefcase, Heart, Activity, AlertCircle } from "lucide-react";

const tourSteps = [
  {
    title: "Welcome to Fundamenta! 👋",
    description: "Your AI-powered assistant for life skills and wellness. Let me show you around!",
    icon: null,
  },
  {
    title: "Life Skills",
    description: "Start here to learn essential skills for personal growth and development. From basic home repairs to effective communication!",
    icon: <GraduationCap className="h-8 w-8 text-orange-500" />,
  },
  {
    title: "Financial Literacy",
    description: "Learn to manage your money wisely with our AI-powered budgeting tools and financial advice.",
    icon: <DollarSign className="h-8 w-8 text-green-500" />,
  },
  {
    title: "Career Development",
    description: "Build your professional future with resume help, interview practice, and personalized career guidance.",
    icon: <Briefcase className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Wellness & Nutrition",
    description: "Take care of your mental and physical health with guided meditation and nutrition planning.",
    icon: <Heart className="h-8 w-8 text-purple-500" />,
  },
  {
    title: "Active You",
    description: "Stay fit with personalized workout plans and progress tracking.",
    icon: <Activity className="h-8 w-8 text-pink-500" />,
  },
  {
    title: "Emergency Guidance",
    description: "Access quick help and step-by-step guidance when you need it most.",
    icon: <AlertCircle className="h-8 w-8 text-red-500" />,
  },
  {
    title: "You're All Set! 🎉",
    description: "Remember, each section has an AI assistant to help you along the way. Click any card to get started!",
    icon: null,
  },
];

export default function WelcomeTour() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("hasSeenTour", "true");
    setOpen(false);
    setCurrentStep(0);
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenTour", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {tourSteps[currentStep].icon}
          </div>
          <DialogTitle className="text-center text-xl">
            {tourSteps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {tourSteps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-2 mt-4">
          <div className="flex gap-1">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
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
            <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)}>
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
