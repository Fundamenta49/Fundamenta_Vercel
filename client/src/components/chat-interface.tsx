import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, ArrowRight, Mic } from "lucide-react";
import ChatOnboarding from "./chat-onboarding";
import { Link } from "wouter";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  category?: string;
  suggestions?: AppSuggestion[];
}

interface AppSuggestion {
  text: string;
  path: string;
  description: string;
}

interface ChatInterfaceProps {
  category: "emergency" | "finance" | "career" | "wellness" | "learning" | "fitness" | "cooking";
}

const APP_ROUTES = {
  cooking: {
    basics: { path: "/learning?tab=cooking", text: "Cooking Basics Guide" },
    schedule: { path: "/learning?tab=skills", text: "Cleaning Schedule Generator" },
    kitchen: { path: "/learning?tab=skills", text: "Kitchen Organization Tips" },
  },
  career: {
    assessment: { path: "/career?tab=assessment", text: "Career Assessment" },
    interview: { path: "/career?tab=interview", text: "Interview Practice" },
    resume: { path: "/career?tab=learning", text: "Resume Building" },
  },
  finance: {
    budget: { path: "/finance?tab=budget", text: "Budget Calculator" },
    planning: { path: "/finance?tab=planning", text: "Financial Planning" },
    savings: { path: "/finance?tab=savings", text: "Savings Goals" },
  },
  wellness: {
    mood: { path: "/wellness?tab=mood", text: "Mood Tracking" },
    meditation: { path: "/wellness?tab=meditation", text: "Meditation Guide" },
    journal: { path: "/wellness?tab=journal", text: "Wellness Journal" },
  }
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
            <Link
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ChatInterface({ category }: ChatInterfaceProps) {
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

      setMessages([{ role: "assistant", content: greetings[category], category }]);
    }
  }, [category]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
      });
      return null;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript;
        setInput(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      stopRecording();
      toast({
        variant: "destructive",
        title: "Speech Recognition Error",
        description: "There was an error with speech recognition. Please try again.",
      });
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };

    return recognition;
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }

    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
      toast({
        title: "Listening...",
        description: "Speak clearly into your microphone. Press the mic button again or send to finish.",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const chatMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message: content,
        category,
        previousMessages: messages.map(m => ({
          role: m.role,
          content: m.content,
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
        const suggestions = generateSuggestions(data.response, category);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
            category,
            suggestions
          }
        ]);
        setInput("");
        if (isRecording) {
          stopRecording();
        }
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

  const generateSuggestions = (response: string, category: string): AppSuggestion[] => {
    const suggestions: AppSuggestion[] = [];
    const routes = APP_ROUTES[category as keyof typeof APP_ROUTES] || {};

    Object.entries(routes).forEach(([key, value]) => {
      const keywords = {
        cooking: {
          basics: ['beginner', 'start', 'learn', 'basic', 'fundamental'],
          schedule: ['clean', 'organize', 'schedule', 'routine'],
          kitchen: ['organize', 'setup', 'arrangement', 'tools'],
        },
        career: {
          assessment: ['test', 'evaluate', 'assessment', 'career path'],
          interview: ['interview', 'practice', 'question', 'answer'],
          resume: ['resume', 'cv', 'application', 'job'],
        },
        finance: {
          budget: ['budget', 'spending', 'track', 'expenses'],
          planning: ['plan', 'future', 'goals', 'strategy'],
          savings: ['save', 'emergency fund', 'investment'],
        },
        wellness: {
          mood: ['mood', 'feeling', 'emotion', 'track'],
          meditation: ['stress', 'relax', 'calm', 'mindful'],
          journal: ['journal', 'write', 'reflect', 'diary'],
        },
      };

      const categoryKeywords = keywords[category as keyof typeof keywords];
      if (categoryKeywords && categoryKeywords[key as keyof typeof categoryKeywords]) {
        const matchingKeywords = categoryKeywords[key as keyof typeof categoryKeywords];
        if (matchingKeywords.some(keyword => response.toLowerCase().includes(keyword))) {
          suggestions.push({
            text: value.text,
            path: value.path,
            description: `Explore our ${value.text.toLowerCase()} resources and tools`,
          });
        }
      }
    });

    return suggestions.slice(0, 3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    setMessages((prev) => [...prev, { role: "user", content: input.trim(), category }]);

    if (isRecording) {
      stopRecording();
    }

    chatMutation.mutate(input);
  };

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

    setMessages([{ role: "assistant", content: greetings[category], category }]);
  };

  if (showOnboarding) {
    return <ChatOnboarding category={category} onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      <div className="flex-1 overflow-hidden">
        <ScrollArea
          ref={scrollRef}
          className="h-full"
        >
          <div className="space-y-6 p-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className="mb-6 last:mb-0"
              >
                <div className="rounded-lg px-4">
                  {message.role === "assistant"
                    ? formatAssistantMessage(message.content, message.suggestions)
                    : <p className="text-gray-700">{message.content}</p>
                  }
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
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 p-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[80px] resize-none"
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
              variant={isRecording ? "outline" : "secondary"}
              size="icon"
              className={`h-10 w-10 transition-colors ${isRecording ? 'bg-primary/20' : ''}`}
              onClick={toggleRecording}
              disabled={chatMutation.isPending}
            >
              <Mic className={`h-4 w-4 ${isRecording ? 'text-primary animate-pulse' : ''}`} />
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
  );
}