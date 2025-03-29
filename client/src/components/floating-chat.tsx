import { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
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
  // Start visible (not minimized) for testing purposes
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [location, setLocation] = useLocation();
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const controls = useAnimationControls();
  const isMobile = useIsMobile();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  // Theme colors for each section
  const pageColors = {
    home: "#3b82f6", // Default blue
    learning: "#f97316", // Orange
    finance: "#22c55e", // Green
    career: "#3b82f6", // Blue
    wellness: "#a855f7", // Purple
    active: "#ec4899", // Pink
    emergency: "#ef4444", // Red
  };

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
    const location = window.location.pathname;
    const page = location.split('/')[1] || 'home';
    const params = new URLSearchParams(window.location.search);
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
      case 'navigate':
        if (action.payload.route) {
          setLocation(action.payload.route);
        }
        break;
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
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Get the current page theme color
  const getCurrentThemeColor = useMemo(() => {
    // Extract the current page from location (e.g., /finance -> finance)
    const currentPage = location.split('/')[1] || 'home';
    return pageColors[currentPage as keyof typeof pageColors] || pageColors.home;
  }, [location, pageColors]);

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
          {/* Just the robot SVG with glow effect */}
          <div 
            className="w-14 h-14 relative cursor-pointer"
            onClick={() => setIsMinimized(false)}
          >
            {/* Enhanced dynamic theme-based glow effect */}
            <div 
              className="absolute -inset-4 rounded-full blur-xl opacity-80 animate-pulse"
              style={{ backgroundColor: `${getCurrentThemeColor}` }}
            />
            
            {/* Robot SVG directly */}
            <svg 
              width="56" 
              height="56" 
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 left-0 right-0 bottom-0"
              style={{ 
                margin: 'auto'
              }}
            >
              {/* Robot body */}
              <g>
                {/* Robot head */}
                <rect x="30" y="15" width="40" height="30" rx="10" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="1" />
                
                {/* Head screen */}
                <rect x="35" y="18" width="30" height="10" rx="3" fill="#7dd3fc" opacity="0.6" />
                
                {/* Ear left */}
                <rect x="25" y="25" width="5" height="10" rx="2" fill="#e0e0e0" />
                
                {/* Ear right */}
                <rect x="70" y="25" width="5" height="10" rx="2" fill="#e0e0e0" />
                
                {/* Eyes background */}
                <rect x="35" y="30" width="30" height="10" rx="5" fill="#0f172a" />
                
                {/* Left eye with theme color */}
                <ellipse cx="42" cy="35" rx="3" ry="2.5" fill={getCurrentThemeColor} opacity="0.9" />
                
                {/* Right eye with theme color */}
                <ellipse cx="58" cy="35" rx="3" ry="2.5" fill={getCurrentThemeColor} opacity="0.9" />
                
                {/* Main robot body */}
                <path 
                  d="M30,45 C30,65 30,75 50,80 C70,75 70,65 70,45 L60,40 L40,40 L30,45" 
                  fill="#f5f5f5" 
                  stroke="#e0e0e0" 
                  strokeWidth="1"
                />
                
                {/* Center chest light with theme color */}
                <circle cx="50" cy="55" r="5" fill={getCurrentThemeColor} opacity="0.8" />
                
                {/* Left arm */}
                <path 
                  d="M30,50 C20,55 20,60 25,65" 
                  fill="none" 
                  stroke="#f5f5f5" 
                  strokeWidth="7" 
                  strokeLinecap="round" 
                />
                
                {/* Right arm */}
                <path 
                  d="M70,50 C80,55 80,60 75,65" 
                  fill="none" 
                  stroke="#f5f5f5" 
                  strokeWidth="7" 
                  strokeLinecap="round" 
                />
              </g>
            </svg>
          </div>
        </motion.div>
      ) : (
        <Card className={cn(
          "flex flex-col shadow-lg border-0",
          "overflow-hidden",
          isMobile ? "h-full rounded-t-xl rounded-b-none" : "h-full rounded-xl"
        )}>
          <div className="p-3 border-b flex items-center justify-between bg-background">
            <div className="flex items-center gap-2">
              {/* SVG directly with no container */}
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 100 100" 
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <g>
                  {/* Robot head */}
                  <rect x="30" y="15" width="40" height="30" rx="10" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="1" />
                  
                  {/* Head screen */}
                  <rect x="35" y="18" width="30" height="10" rx="3" fill="#7dd3fc" opacity="0.6" />
                  
                  {/* Ear left */}
                  <rect x="25" y="25" width="5" height="10" rx="2" fill="#e0e0e0" />
                  
                  {/* Ear right */}
                  <rect x="70" y="25" width="5" height="10" rx="2" fill="#e0e0e0" />
                  
                  {/* Eyes background */}
                  <rect x="35" y="30" width="30" height="10" rx="5" fill="#0f172a" />
                  
                  {/* Left eye - brighter when speaking, themed color */}
                  <ellipse 
                    cx="42" 
                    cy="35" 
                    rx="3" 
                    ry="2.5" 
                    fill={isAiSpeaking ? "#ffffff" : getCurrentThemeColor} 
                    opacity={isAiSpeaking ? "1" : "0.9"}
                  />
                  
                  {/* Right eye - brighter when speaking, themed color */}
                  <ellipse 
                    cx="58" 
                    cy="35" 
                    rx="3" 
                    ry="2.5" 
                    fill={isAiSpeaking ? "#ffffff" : getCurrentThemeColor} 
                    opacity={isAiSpeaking ? "1" : "0.9"}
                  />
                  
                  {/* Main robot body */}
                  <path 
                    d="M30,45 C30,65 30,75 50,80 C70,75 70,65 70,45 L60,40 L40,40 L30,45" 
                    fill="#f5f5f5" 
                    stroke="#e0e0e0" 
                    strokeWidth="1"
                  />
                  
                  {/* Center chest light with theme color - pulsing when speaking */}
                  <circle 
                    cx="50" 
                    cy="55" 
                    r="5" 
                    fill={isAiSpeaking ? "#ffffff" : getCurrentThemeColor} 
                    opacity={isAiSpeaking ? "1" : "0.8"} 
                    className={isAiSpeaking ? "animate-pulse" : ""}
                  />
                  
                  {/* Left arm */}
                  <path 
                    d="M30,50 C20,55 20,60 25,65" 
                    fill="none" 
                    stroke="#f5f5f5" 
                    strokeWidth="7" 
                    strokeLinecap="round" 
                  />
                  
                  {/* Right arm */}
                  <path 
                    d="M70,50 C80,55 80,60 75,65" 
                    fill="none" 
                    stroke="#f5f5f5" 
                    strokeWidth="7" 
                    strokeLinecap="round" 
                  />
                </g>
              </svg>
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
              className="h-8 w-8 rounded-full hover:bg-primary/10 text-muted-foreground"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4 py-3">
            <div className="space-y-4" ref={chatRef}>
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-3">
                    <Sparkle className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-base font-medium text-foreground mb-1">How can I help you today?</h4>
                  <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mb-4">
                    Ask me about finances, careers, wellness, or emergency guidance.
                  </p>
                  {/* Navigation buttons to test theme colors */}
                  <div className="grid grid-cols-2 gap-2 text-xs max-w-[250px] mx-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-green-500 text-white hover:bg-green-600"
                      onClick={() => setLocation("/finance")}
                    >
                      Finance
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => setLocation("/career")}
                    >
                      Career
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-purple-500 text-white hover:bg-purple-600"
                      onClick={() => setLocation("/wellness")}
                    >
                      Wellness
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-orange-500 text-white hover:bg-orange-600"
                      onClick={() => setLocation("/learning")}
                    >
                      Learning
                    </Button>
                  </div>
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