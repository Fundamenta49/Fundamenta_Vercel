import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Loader2,
  Brain,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  Mic,
  Bot,
  Heart,
  ChefHat,
  Briefcase,
  DumbbellIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import ChatOnboarding from "./chat-onboarding";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  category?: string;
  suggestions?: AppSuggestion[];
}

interface AppSuggestion {
  text: string;
  path: string;
  description: string;
}

interface ChatInterfaceProps {
  category: "learning" | "cooking" | "emergency" | "finance" | "career" | "wellness" | "fitness";
}

interface ChatTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CHAT_TOPICS: Record<string, ChatTopic[]> = {
  learning: [
    {
      id: 'study-tips',
      title: 'Study Techniques',
      description: 'Get personalized study methods and tips',
      icon: Brain,
    },
    {
      id: 'skill-development',
      title: 'Skill Development',
      description: 'Plan your learning path and track progress',
      icon: GraduationCap,
    },
    {
      id: 'time-management',
      title: 'Time Management',
      description: 'Optimize your learning schedule',
      icon: MessageSquare,
    }
  ],
  career: [
    {
      id: 'career-planning',
      title: 'Career Planning',
      description: 'Explore career paths and opportunities',
      icon: Bot,
    },
    {
      id: 'skill-matching',
      title: 'Skill Matching',
      description: 'Match your skills to job opportunities',
      icon: Brain,
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation',
      description: 'Practice interview questions and get feedback',
      icon: MessageSquare,
    }
  ],
  cooking: [
    {
      id: 'recipes',
      title: 'Recipes',
      description: 'Find recipes based on your ingredients or dietary restrictions',
      icon: ChefHat,
    },
    {
      id: 'techniques',
      title: 'Cooking Techniques',
      description: 'Learn basic and advanced cooking techniques',
      icon: GraduationCap,
    },
    {
      id: 'meal-planning',
      title: 'Meal Planning',
      description: 'Create weekly meal plans based on your preferences and dietary needs',
      icon: MessageSquare,
    }
  ],
  emergency: [
    {
      id: 'first-aid',
      title: 'First Aid',
      description: 'Get step-by-step instructions on how to provide first aid in various situations',
      icon: Heart,
    },
    {
      id: 'emergency-numbers',
      title: 'Emergency Numbers',
      description: 'Find emergency numbers for your location',
      icon: MessageSquare,
    },
    {
      id: 'emergency-procedures',
      title: 'Emergency Procedures',
      description: 'Learn emergency procedures for different types of emergencies',
      icon: GraduationCap,
    }
  ],
  finance: [
    {
      id: 'budgeting',
      title: 'Budgeting',
      description: 'Create a budget that helps you track your spending',
      icon: Briefcase,
    },
    {
      id: 'investing',
      title: 'Investing',
      description: 'Learn about different investment strategies',
      icon: Brain,
    },
    {
      id: 'financial-planning',
      title: 'Financial Planning',
      description: 'Plan for your financial future',
      icon: MessageSquare,
    }
  ],
  fitness: [
    {
      id: 'workout-plans',
      title: 'Workout Plans',
      description: 'Get personalized workout plans that fit your fitness level',
      icon: DumbbellIcon,
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      description: 'Learn about nutrition and how to eat healthy',
      icon: Brain,
    },
    {
      id: 'fitness-tracking',
      title: 'Fitness Tracking',
      description: 'Track your fitness progress',
      icon: MessageSquare,
    }
  ],
  wellness: [
    {
      id: 'stress-management',
      title: 'Stress Management',
      description: 'Learn how to manage stress',
      icon: Heart,
    },
    {
      id: 'meditation',
      title: 'Meditation',
      description: 'Learn how to meditate',
      icon: Brain,
    },
    {
      id: 'sleep',
      title: 'Sleep',
      description: 'Improve your sleep',
      icon: MessageSquare,
    }
  ]
};

const formatAssistantMessage = (content: string, suggestions?: AppSuggestion[]) => {
  const sections = content.split(/\n\n+|\n(?=[-•🎯💡⏰🎬🔗✨🌟💪🧘‍♀️📊⭐👉])/g);

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => (
        <div key={idx} className="mb-4 last:mb-0">
          {section.split('\n').map((line, lineIdx) => (
            <p key={lineIdx} className="text-gray-700 mb-2">{line}</p>
          ))}
        </div>
      ))}

      {suggestions && suggestions.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="font-medium text-gray-900">📱 Helpful Resources in the App:</p>
          {suggestions.map((suggestion, idx) => (
            <a
              key={idx}
              href={suggestion.path}
              className="block"
            >
              <Button
                variant="outline"
                className="w-full justify-start text-left hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  <div>
                    <p className="font-medium text-gray-900">{suggestion.text}</p>
                    <p className="text-sm text-gray-500">{suggestion.description}</p>
                  </div>
                </span>
              </Button>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ChatInterface({ category }: ChatInterfaceProps) {
  console.log("ChatInterface mounted with category:", category); // Debug log
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(`chat-onboarding-${category}`);
    if (hasCompletedOnboarding) {
      setShowOnboarding(false);
      const greetings = {
        emergency: "Hello, I'm here to help you with any emergency situation. What's happening?",
        finance: "Hi! I'm your financial advisor. I'll adapt my guidance to your financial goals and knowledge level. What would you like to discuss?",
        career: "Welcome! I'm your career development coach. I'll help guide you based on your experience and aspirations. What brings you here today?",
        wellness: "Hi there! I'm your wellness coach. I'm here to provide personalized support for your well-being journey. How are you feeling today?",
        learning: "Hello! I'm your learning coach. I'll help you develop new skills and knowledge in a way that works best for you. What would you like to learn?",
        fitness: "Welcome to Active You! 💪 I'm your AI Fitness Coach, ready to help you achieve your fitness goals. What would you like to work on today?",
        cooking: "Hi! 👩‍🍳 I'm your cooking assistant. I'm here to help you develop your culinary skills and confidence in the kitchen. What would you like to cook today?"
      };

      setMessages([{ role: "assistant", content: greetings[category], timestamp: new Date(), category }]);
    }
  }, [category]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    setMessages((prev) => [...prev, { role: "user", content: input.trim(), timestamp: new Date(), category }]);
    setInput("");
    chatMutation.mutate(input);
  };

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        category,
        previousMessages: messages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
          category: m.category || category
        }))
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.response) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
            category,
            suggestions: data.suggestions
          }
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
      });
    },
  });

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem(`chat-onboarding-${category}`, 'true');
    const greetings = {
      emergency: "Now that you know how I can help, what's the emergency situation?",
      finance: "Great! Now that you know how I can help with your finances, what would you like to discuss?",
      career: "Excellent! I'm ready to help with your career development. What would you like to explore first?",
      wellness: "Perfect! Now that you know how I can support your wellness journey, what would you like to focus on?",
      learning: "Wonderful! I'm ready to help you learn. What skills would you like to develop?",
      fitness: "Awesome! Now that you know how I can help with your fitness goals, what would you like to work on first?",
      cooking: "Great! Now that you know how I can help in the kitchen, what would you like to learn about?"
    };

    setMessages([{ role: "assistant", content: greetings[category], timestamp: new Date(), category }]);
  };

  if (showOnboarding) {
    return <ChatOnboarding category={category} onComplete={handleOnboardingComplete} />;
  }

  const topics = CHAT_TOPICS[category] || [];

  return (
    <div className="space-y-6">
      <div className="text-xs text-muted-foreground mb-2">
        Active category: {category}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Card
            key={topic.id}
            className={cn(
              "cursor-pointer transition-all duration-200",
              "hover:shadow-md hover:scale-[1.02]",
              "bg-white hover:bg-gray-50/50"
            )}
            onClick={() => setSelectedTopic(topic.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <topic.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">{topic.title}</CardTitle>
              </div>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTopic} onOpenChange={(open) => !open && setSelectedTopic(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTopic && (() => {
                const topic = topics.find(t => t.id === selectedTopic);
                if (topic) {
                  const Icon = topic.icon;
                  return (
                    <>
                      <Icon className="h-6 w-6 text-primary" />
                      <span>{topic.title}</span>
                    </>
                  );
                }
                return null;
              })()}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[calc(100vh-16rem)]">
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-6 p-4">
                  {messages.map((message, i) => (
                    <div key={i} className="mb-6 last:mb-0">
                      <div className="rounded-lg px-4">
                        {message.role === "assistant" ? (
                          formatAssistantMessage(message.content, message.suggestions)
                        ) : (
                          <p className="text-gray-700">{message.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex items-center gap-2 text-gray-500 pl-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking...
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex-none border-t bg-white">
              <form onSubmit={handleSubmit} className="flex gap-2 p-4">
                <Textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  placeholder="Type your message..."
                  className="flex-1 resize-none w-full overflow-hidden p-2"
                  style={{ minHeight: '44px' }}
                  disabled={chatMutation.isPending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="flex flex-col gap-2 self-end">
                  <Button
                    type="button"
                    variant={"secondary"}
                    size="icon"
                    className={`h-10 w-10 transition-colors`}
                    onClick={() => {}}
                    disabled={chatMutation.isPending}
                  >
                    <Mic className={`h-4 w-4 `} />
                  </Button>
                  <Button
                    type="submit"
                    disabled={chatMutation.isPending || !input.trim()}
                  >
                    {chatMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}