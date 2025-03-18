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
import { Minimize2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { motion, useAnimationControls } from "framer-motion";

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
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [location] = useLocation();
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const controls = useAnimationControls();

  // Random blinking effect
  useEffect(() => {
    if (isMinimized) {
      const blinkInterval = setInterval(() => {
        const shouldBlink = Math.random() > 0.7; // 30% chance to blink
        if (shouldBlink) {
          controls.start({
            scaleY: [1, 0.1, 1],
            transition: {
              duration: 0.2,
            }
          });
        }
      }, 2000);

      // Gentle floating animation
      const floatInterval = setInterval(() => {
        controls.start({
          y: [0, -2, 0],
          transition: {
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity
          }
        });
      }, 3000);

      return () => {
        clearInterval(blinkInterval);
        clearInterval(floatInterval);
      };
    }
  }, [isMinimized, controls]);

  // Get current page context
  const getCurrentContext = () => {
    const page = location.split('/')[1] || 'home';
    const section = new URLSearchParams(location.split('?')[1]).get('tab');

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

  const handleAIAction = async (action: AIAction) => {
    switch (action.type) {
      case 'resume':
        await apiRequest('POST', '/api/resume/update', action.payload);
        toast({ title: "Resume updated", description: "Your resume has been updated with the suggested changes." });
        break;
      case 'recipe':
        await apiRequest('POST', '/api/recipes/generate', action.payload);
        toast({ title: "Recipe generated", description: "Your new recipe has been created and saved." });
        break;
      case 'budget':
        await apiRequest('POST', '/api/budget/update', action.payload);
        toast({ title: "Budget updated", description: "Your budget has been updated with the new information." });
        break;
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
          className="relative"
        >
          <Button
            variant="default"
            size="icon"
            className={cn(
              "w-12 h-12 relative overflow-visible",
              "bg-navy-600",
              "hover:bg-navy-700 transition-all duration-300",
              "rounded-full"
            )}
            onClick={() => setIsMinimized(false)}
          >
            {/* Glow effects */}
            <div className="absolute -inset-2 bg-navy-400 rounded-full blur-lg opacity-20 animate-pulse" />
            <div className="absolute -inset-1 bg-navy-300 rounded-full blur-md opacity-10 animate-pulse delay-75" />

            {/* Face container */}
            <div className="w-8 h-7 bg-navy-100 rounded-[0.75rem] flex items-center justify-center shadow-inner relative z-10">
              <motion.div className="flex gap-3">
                {/* Eyes with blinking animation controlled by the useEffect above */}
                <motion.div className="w-1.5 h-1.5 rounded-full bg-navy-600" />
                <motion.div className="w-1.5 h-1.5 rounded-full bg-navy-600" />
              </motion.div>
            </div>
          </Button>
        </motion.div>
      ) : (
        <Card className="h-[500px] flex flex-col shadow-lg border border-navy-100">
          <div className="p-2 border-b flex items-center justify-between bg-gradient-to-r from-white to-navy-50">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-navy-500" />
              <span className="font-medium text-sm text-navy-600">AI Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-navy-50"
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
                        ? "bg-navy-50 text-black border border-navy-200"
                        : "bg-navy-50"
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
                  <div className="w-2 h-2 rounded-full bg-navy-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-navy-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-navy-500 animate-bounce [animation-delay:0.4s]" />
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
                className="flex-1 text-sm border-navy-100 focus-visible:ring-navy-400 placeholder:text-black"
              />
              <Button
                type="submit"
                disabled={chatMutation.isPending}
                size="sm"
                className="bg-navy-500 hover:bg-navy-600 text-white"
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