import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatOnboarding from "./chat-onboarding";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  category?: string;
}

interface ChatInterfaceProps {
  category: "emergency" | "finance" | "career" | "wellness" | "learning" | "fitness" | "cooking";
}

export default function ChatInterface({ category }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

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
        cooking: "Hi! I'm your cooking assistant. I'm here to help you develop your culinary skills and confidence in the kitchen. What would you like to cook today?"
      };

      setMessages([{ role: "assistant", content: greetings[category], category }]);
    }
  }, [category]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
        const error = await response.json();
        throw new Error(error.error || "Failed to send message");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data.success && data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response, category }
        ]);
        setInput("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    setMessages((prev) => [...prev, { role: "user", content: input, category }]);
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
    <div className="flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
      <ScrollArea 
        ref={scrollRef} 
        className="flex-1 pr-4"
      >
        <div className="space-y-4 pb-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "assistant"
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex items-center gap-2 text-muted-foreground pl-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-4 sticky bottom-0 bg-background">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-h-[80px]"
          disabled={chatMutation.isPending}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          className="self-end"
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
      </form>
    </div>
  );
}