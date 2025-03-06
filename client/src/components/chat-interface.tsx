import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  category?: string;
}

interface ChatInterfaceProps {
  category: "emergency" | "finance" | "career" | "wellness" | "learning" | "fitness" | "welcome";
  onConversationComplete?: () => void;
}

export default function ChatInterface({ category, onConversationComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Set initial greeting based on category
  useEffect(() => {
    const greetings = {
      emergency: "Hello, I'm here to help you with any emergency situation. What's happening?",
      finance: "Hi! I'm your financial advisor. I'll adapt my guidance to your financial goals and knowledge level. What would you like to discuss?",
      career: "Welcome! I'm your career development coach. I'll help guide you based on your experience and aspirations. What brings you here today?",
      wellness: "Hi there! I'm your wellness coach. I'm here to provide personalized support for your well-being journey. How are you feeling today?",
      learning: "Hello! I'm your learning coach. I'll help you develop new skills and knowledge in a way that works best for you. What would you like to learn?",
      fitness: "Welcome to Active You! 💪 I'm your AI Fitness Coach, ready to help you achieve your fitness goals. Whether you're into weightlifting, yoga, running, or meditation, I'll provide personalized guidance for your fitness journey. What would you like to work on today?",
      welcome: "Hi! 👋 I'm excited to create a personalized experience just for you. Let's start with something fun - what's your favorite color? And do you prefer energetic or calming music while working out? This will help me customize your experience!"
    };

    setMessages([{ role: "assistant", content: greetings[category], category }]);
  }, [category]);

  const chatMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/chat", { 
        content, 
        category,
        previousMessages: messages.map(m => ({
          role: m.role,
          content: m.content,
          category: m.category || category
        }))
      });
      return res.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, category }
      ]);
      setInput("");

      // If this is the welcome conversation and we've gathered enough information,
      // call the completion callback
      if (category === "welcome" && messages.length >= 4 && onConversationComplete) {
        onConversationComplete();
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input, category }]);
    chatMutation.mutate(input);
  };

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
          Send
        </Button>
      </form>
    </div>
  );
}