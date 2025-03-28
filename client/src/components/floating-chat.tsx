import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minimize2, SendHorizonal, Sparkle, Circle } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { motion, useAnimationControls } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import FundiAvatar from "./fundi-avatar";

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
  const isMobile = useIsMobile();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  // Detect keyboard visibility on mobile
  useEffect(() => {
    if (isMobile) {
      const detectKeyboard = () => {
        const isKeyboardVisible = window.visualViewport!.height < window.innerHeight;
        setKeyboardVisible(isKeyboardVisible);
      };

      window.visualViewport?.addEventListener('resize', detectKeyboard);
      return () => window.visualViewport?.removeEventListener('resize', detectKeyboard);
    }
  }, [isMobile]);

  // Animation for Fundi avatar
  useEffect(() => {
    if (isMinimized) {
      // Gentle floating animation
      controls.start({
        y: [0, -3, 0],
        transition: {
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity
        }
      });
    }
  }, [isMinimized, controls]);

  // Get current page context
  const getCurrentContext = () => {
    const page = location.split('/')[1] || 'home';
    const params = new URLSearchParams(location.split('?')[1] || '');
    const section = params.get('tab') || 'general';

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
      setIsAiSpeaking(true);
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
        
        // Show the AI speaking for a brief moment then stop
        setTimeout(() => {
          setIsAiSpeaking(false);
        }, 1500);
      }
    },
    onError: (error: Error) => {
      setIsAiSpeaking(false);
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
        "fixed z-50 transition-all duration-300 ease-in-out",
        isMinimized
          ? "bottom-4 right-4 w-14 h-14"
          : isMobile
            ? keyboardVisible
              ? "bottom-0 left-0 right-0 w-full h-[40vh]"
              : "bottom-0 left-0 right-0 w-full max-h-[75vh]"
            : "bottom-4 right-4 w-96 h-[500px]",
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
              "w-14 h-14 relative overflow-visible",
              "bg-primary hover:bg-primary/90 transition-all duration-300",
              "rounded-full shadow-lg"
            )}
            onClick={() => setIsMinimized(false)}
          >
            {/* Subtle glow effect */}
            <div className="absolute -inset-3 bg-primary/20 rounded-full blur-xl opacity-50 animate-pulse" />
            
            {/* Fundi Avatar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <FundiAvatar size="sm" speaking={false} />
            </div>
          </Button>
        </motion.div>
      ) : (
        <Card className={cn(
          "flex flex-col shadow-lg border-0",
          "overflow-hidden",
          isMobile ? "h-full rounded-t-xl rounded-b-none" : "h-full rounded-xl"
        )}>
          <div className="p-3 border-b flex items-center justify-between bg-background">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <FundiAvatar size="sm" speaking={isAiSpeaking} />
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">Fundi</div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Circle className="h-1.5 w-1.5 fill-green-500 text-green-500 mr-1" />
                  {isAiSpeaking ? "Thinking..." : "Online"}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-primary/10 text-text-muted"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4 py-3" style={{ height: keyboardVisible ? '30vh' : 'auto' }}>
            <div className="space-y-4" ref={chatRef}>
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-3">
                    <Sparkle className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-base font-medium text-foreground mb-1">How can I help you today?</h4>
                  <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                    Ask me about finances, careers, wellness, or emergency guidance.
                  </p>
                </div>
              )}
              
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
                      "rounded-lg px-4 py-2.5 max-w-[85%] text-sm",
                      msg.role === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-white border border-gray-200"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1.5 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex items-start">
                  <div className="rounded-lg px-4 py-2.5 max-w-[85%] text-sm bg-white border border-gray-200 flex items-center">
                    <div className="flex items-center gap-1 h-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDuration: "1s" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDuration: "1s", animationDelay: "0.2s" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDuration: "1s", animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className={cn(
            "p-4 border-t bg-background",
            keyboardVisible && "sticky bottom-0"
          )}>
            <div className="flex gap-2 items-center relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Fundi..."
                className="flex-1 pr-10 border-gray-200 rounded-full bg-white focus-visible:ring-primary/20"
                onFocus={() => {
                  if (chatRef.current) {
                    setTimeout(() => {
                      chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }, 100);
                  }
                }}
              />
              <Button
                type="submit"
                disabled={chatMutation.isPending || !input.trim()}
                size="icon"
                className="absolute right-1 bg-transparent hover:bg-transparent text-primary hover:text-primary/80"
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}