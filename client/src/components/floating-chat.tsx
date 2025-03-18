import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Minimize2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { motion, useAnimationControls, useMotionValue } from "framer-motion";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: AIAction[];
  suggestions?: AppSuggestion[];
}

interface AIAction {
  type: string;
  payload: any;
}

interface AppSuggestion {
  text: string;
  path: string;
  description: string;
}

export default function FloatingChat() {
  const [isMinimized, setIsMinimized] = useState(true); // Default to minimized
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [location] = useLocation();
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const controls = useAnimationControls();
  const floatY = useMotionValue(0);

  // Quirky animation effect
  useEffect(() => {
    if (isMinimized) {
      const interval = setInterval(() => {
        const randomMovement = Math.random() * 2 - 1; // Random value between -1 and 1
        controls.start({
          rotate: [0, randomMovement * 5, 0],
          transition: {
            duration: 2,
            ease: "easeInOut"
          }
        });
        floatY.set(Math.sin(Date.now() / 1000) * 5);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isMinimized, controls]);

  // Get current page context
  const getCurrentContext = () => {
    const page = location.split('/')[1] || 'home';
    const section = new URLSearchParams(location.split('?')[1]).get('tab');

    // Define available actions based on current page
    const availableActions = {
      career: ['resume', 'interview', 'job-search'],
      finance: ['budget', 'investments', 'planning'],
      wellness: ['meditation', 'exercise', 'nutrition'],
      learning: ['recipes', 'skills', 'courses'],
    };

    return {
      currentPage: page,
      currentSection: section,
      availableActions: availableActions[page as keyof typeof availableActions] || ['general'],
    };
  };

  // Handle AI Actions
  const handleAIAction = async (action: AIAction) => {
    switch (action.type) {
      case 'resume':
        // Update resume content
        await apiRequest('POST', '/api/resume/update', action.payload);
        toast({ title: "Resume updated", description: "Your resume has been updated with the suggested changes." });
        break;
      case 'recipe':
        // Generate new recipe
        await apiRequest('POST', '/api/recipes/generate', action.payload);
        toast({ title: "Recipe generated", description: "Your new recipe has been created and saved." });
        break;
      case 'budget':
        // Update budget
        await apiRequest('POST', '/api/budget/update', action.payload);
        toast({ title: "Budget updated", description: "Your budget has been updated with the new information." });
        break;
      // Add more action handlers as needed
    }
  };

  const chatMutation = useMutation({
    mutationFn: async (content: string) => {
      const context = getCurrentContext();
      const response = await apiRequest("POST", "/api/chat/orchestrator", {
        message: content,
        context,
        previousMessages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      if (data.success) {
        // Handle any actions from the AI response
        if (data.actions && data.actions.length > 0) {
          for (const action of data.actions) {
            await handleAIAction(action);
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
            actions: data.actions,
            suggestions: data.suggestions
          }
        ]);
        setInput("");
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    chatMutation.mutate(input);
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const chatContent = chatRef.current;
    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out",
        isMinimized ? "w-12 h-12" : "w-80"
      )}
    >
      {isMinimized ? (
        <motion.div
          animate={controls}
          style={{ y: floatY }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-blue-500 blur-lg opacity-50 animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-30 animate-pulse delay-75" />
          <Button
            variant="default"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-full relative overflow-hidden",
              "bg-gradient-to-r from-blue-500 to-purple-600",
              "hover:from-blue-600 hover:to-purple-700",
              "transition-all duration-300"
            )}
            onClick={() => setIsMinimized(false)}
          >
            {/* Echo-inspired inner circle */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-300 to-purple-400 opacity-75 animate-pulse" />

            {/* Central glowing orb */}
            <div className="relative z-10 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-200 animate-pulse" />
              <MessageCircle className="h-4 w-4 text-blue-600 relative z-10" />
            </div>

            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-[spin_3s_linear_infinite]" />
          </Button>
        </motion.div>
      ) : (
        <Card className="h-[500px] flex flex-col shadow-lg border border-blue-100">
          <div className="p-2 border-b flex items-center justify-between bg-gradient-to-r from-white to-blue-50">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="font-medium text-sm text-blue-500">AI Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-blue-50"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3" ref={chatRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[85%] text-sm shadow-sm",
                      msg.role === 'user'
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex items-center gap-1 p-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 text-sm border-blue-100 focus-visible:ring-blue-400"
              />
              <Button
                type="submit"
                disabled={chatMutation.isPending}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Send
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}