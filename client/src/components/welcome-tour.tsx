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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tourSteps = [
  {
    title: "Welcome to Fundamenta! 👋",
    description: "Hi! I'm your AI guide. I'll walk you through our amazing features and help you get started. Ready for a quick tour?",
    icon: null,
    path: "/",
    suggestedQuestions: [
      "What can Fundamenta help me with?",
      "How long will the tour take?",
      "Can I skip parts of the tour?"
    ]
  },
  {
    title: "Life Skills",
    description: "Let's start with Life Skills - your personal growth hub! Here you can learn everything from home repairs to communication skills. Want to see how it works?",
    icon: <GraduationCap className="h-8 w-8 text-orange-500" />,
    path: "/learning",
    suggestedQuestions: [
      "What kind of skills can I learn?",
      "How does the learning path work?",
      "Can I track my progress?"
    ]
  },
  {
    title: "Financial Literacy",
    description: "Now, let's check out our smart money tools! I can help you create budgets, track spending, and plan for your future. Shall we look at the budget calculator?",
    icon: <DollarSign className="h-8 w-8 text-green-500" />,
    path: "/finance",
    suggestedQuestions: [
      "How can I start budgeting?",
      "What financial tools are available?",
      "Can you help with investment planning?"
    ]
  },
  {
    title: "Career Development",
    description: "Time to boost your career! Let me show you how our AI helps with resumes, interview prep, and finding your dream job.",
    icon: <Briefcase className="h-8 w-8 text-blue-500" />,
    path: "/career",
    suggestedQuestions: [
      "Can you help improve my resume?",
      "How do I prepare for interviews?",
      "What career paths suit me?"
    ]
  },
  {
    title: "Wellness & Nutrition",
    description: "Your well-being matters! Let's explore our meditation guides and nutrition planning tools. Want to try a quick meditation session?",
    icon: <Heart className="h-8 w-8 text-purple-500" />,
    path: "/wellness",
    suggestedQuestions: [
      "How do I start meditating?",
      "Can you help with meal planning?",
      "What wellness programs are available?"
    ]
  },
  {
    title: "Active You",
    description: "Ready to get moving? I'll show you our personalized workout plans and progress tracking. Let's check out some exercises!",
    icon: <Activity className="h-8 w-8 text-pink-500" />,
    path: "/active",
    suggestedQuestions: [
      "How do I create a workout plan?",
      "Can you track my progress?",
      "What types of exercises are included?"
    ]
  },
  {
    title: "Emergency Guidance",
    description: "Lastly, here's our Emergency Guidance section - quick help when you need it most. Let's see where to find crucial information.",
    icon: <AlertCircle className="h-8 w-8 text-red-500" />,
    path: "/emergency",
    suggestedQuestions: [
      "What emergency resources are available?",
      "How quickly can I access help?",
      "Are there offline guides?"
    ]
  },
  {
    title: "You're All Set! 🎉",
    description: "Great job completing the tour! Remember, I'm here to help anytime - just click the chat icon in any section. Want to explore something specific?",
    icon: null,
    path: "/",
    suggestedQuestions: [
      "Where should I start first?",
      "How do I contact support?",
      "Can you show me around again?"
    ]
  },
];

export default function WelcomeTour() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userQuestion, setUserQuestion] = useState("");
  const [showQuestions, setShowQuestions] = useState(false);
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
      setShowQuestions(false);
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

  const handleSuggestedQuestion = (question: string) => {
    setUserQuestion(question);
    handleAskQuestion(question);
  };

  const handleAskQuestion = async (question?: string) => {
    const queryQuestion = question || userQuestion;
    if (!queryQuestion.trim()) return;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryQuestion,
          category: "tour",
          context: `User is on step ${currentStep + 1} of the tour: ${tourSteps[currentStep].title}`
        })
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const data = await response.json();
      setAiResponse(data.response);
      setUserQuestion("");
      setShowQuestions(false);
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

        <div className="mt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything..."
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowQuestions(!showQuestions)}
            >
              {showQuestions ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleAskQuestion()}
              disabled={!userQuestion.trim()}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>

          <AnimatePresence>
            {showQuestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid gap-2 mt-2">
                  {tourSteps[currentStep].suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="justify-start text-sm"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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