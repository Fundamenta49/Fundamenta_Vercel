import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  X,
  Maximize2,
  Minimize2,
  Pause,
  Play,
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
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userQuestion, setUserQuestion] = useState("");
  const [showQuestions, setShowQuestions] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setIsActive(true);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && isAutoplaying && !isMinimized && !showQuestions) {
      timer = setTimeout(() => {
        handleNext();
      }, 7000); // 7 seconds between steps
    }
    return () => clearTimeout(timer);
  }, [isActive, isAutoplaying, currentStep, isMinimized, showQuestions]);

  const handleNext = useCallback(() => {
    const nextStep = currentStep + 1;
    if (nextStep < tourSteps.length) {
      setCurrentStep(nextStep);
      setShowQuestions(false);
      setAiResponse(null);
      if (tourSteps[nextStep].path !== "/") {
        setLocation(tourSteps[nextStep].path);
      }
    } else {
      handleComplete();
    }
  }, [currentStep, setLocation]);

  const handleComplete = () => {
    localStorage.setItem("hasSeenTour", "true");
    setIsActive(false);
    setCurrentStep(0);
    setLocation("/");
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenTour", "true");
    setIsActive(false);
    setLocation("/");
  };

  const handleSuggestedQuestion = (question: string) => {
    setUserQuestion(question);
    handleAskQuestion(question);
  };

  const handleAskQuestion = async (question?: string) => {
    const queryQuestion = question || userQuestion;
    if (!queryQuestion.trim() || isLoading) return;

    setIsLoading(true);
    setIsAutoplaying(false); // Pause autoplay when user asks a question

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryQuestion,
          category: "tour",
          context: `User is on step ${currentStep + 1} of the tour, viewing ${tourSteps[currentStep].title}`
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setAiResponse(data.response);
      setUserQuestion("");
      setShowQuestions(false);
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Couldn't get an answer. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <Card className="w-[300px] shadow-lg border-2 border-primary/20">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {tourSteps[currentStep].icon}
              <h3 className="font-semibold text-sm">{tourSteps[currentStep].title}</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAutoplaying(!isAutoplaying)}
                className="h-8 w-8"
                disabled={isLoading}
              >
                {isAutoplaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tourSteps[currentStep].description}
                </p>

                {aiResponse && (
                  <div className="bg-primary/10 p-2 rounded-lg text-xs">
                    <p>{aiResponse}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex gap-1">
                    <Input
                      placeholder="Ask me anything..."
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                      className="text-xs h-8"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQuestions(!showQuestions)}
                      className="h-8 w-8"
                      disabled={isLoading}
                    >
                      {showQuestions ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAskQuestion()}
                      disabled={!userQuestion.trim() || isLoading}
                      className="h-8 w-8"
                    >
                      <MessageSquare className={`h-3 w-3 ${isLoading ? 'animate-pulse' : ''}`} />
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
                        <div className="grid gap-1">
                          {tourSteps[currentStep].suggestedQuestions.map((question, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="justify-start text-xs h-7 px-2"
                              onClick={() => handleSuggestedQuestion(question)}
                              disabled={isLoading}
                            >
                              {question}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex gap-1">
                    {tourSteps.map((_, index) => (
                      <motion.div
                        key={index}
                        animate={{
                          scale: index === currentStep ? 1.2 : 1,
                          backgroundColor: index === currentStep ? "var(--primary)" : "var(--muted)"
                        }}
                        className="h-1 w-1 rounded-full"
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {currentStep > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentStep(currentStep - 1);
                          setLocation(tourSteps[currentStep - 1].path);
                          setIsAutoplaying(false);
                        }}
                        className="h-7 text-xs"
                        disabled={isLoading}
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => {
                        handleNext();
                        setIsAutoplaying(true);
                      }}
                      className="h-7 text-xs"
                      disabled={isLoading}
                    >
                      {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}