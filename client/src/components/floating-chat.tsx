import { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minimize2, SendHorizonal, Sparkle, Circle, GripHorizontal } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
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
  const isMobile = useIsMobile();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  // For dragging functionality
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const chatContainer = useRef<HTMLDivElement>(null);
  
  // Theme colors for each section
  const pageColors = {
    home: "#3b82f6", // Default blue
    learning: "#f97316", // Orange
    finance: "#22c55e", // Green
    wellness: "#a855f7", // Purple
    career: "#3b82f6", // Blue
    active: "#ec4899", // Pink
    emergency: "#ef4444", // Red
  };
  
  // Much simpler drag functionality with direct DOM manipulation
  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0
  });
  
  // Function to handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    if (isMobile || isMinimized || !chatContainer.current) return;
    
    // Get current container position
    const rect = chatContainer.current.getBoundingClientRect();
    
    // Set start coordinates
    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: rect.left,
      startTop: rect.top
    });
  };
  
  // Function to handle mouse move during drag
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.isDragging || !chatContainer.current) return;
    
    // Calculate the distance moved
    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;
    
    // Update position relative to starting position
    const newLeft = dragState.startLeft + deltaX;
    const newTop = dragState.startTop + deltaY;
    
    // Apply constraints
    const maxLeft = window.innerWidth - chatContainer.current.offsetWidth;
    const maxTop = window.innerHeight - chatContainer.current.offsetHeight;
    
    // Calculate constrained positions
    const constrainedLeft = Math.max(0, Math.min(maxLeft, newLeft));
    const constrainedTop = Math.max(0, Math.min(maxTop, newTop));
    
    // Apply the position directly
    chatContainer.current.style.left = `${constrainedLeft}px`;
    chatContainer.current.style.top = `${constrainedTop}px`;
    
    // Update React state as well for persistence between renders
    setPosition({ x: constrainedLeft, y: constrainedTop });
  };
  
  // Function to handle drag end
  const handleMouseUp = () => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  };
  
  // Set up global event listeners for mouse move and up
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState]);
  
  // For custom events from AI
  useEffect(() => {
    const handleOpenFundiEvent = (event: CustomEvent) => {
      if (isMinimized) {
        setIsMinimized(false);
      }
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
    };
    
    window.addEventListener('openFundi' as any, handleOpenFundiEvent);
    
    return () => {
      window.removeEventListener('openFundi' as any, handleOpenFundiEvent);
    };
  }, [isMinimized]);
  
  // Handle keyboard visibility detection
  useEffect(() => {
    const originalHeight = window.innerHeight;
    
    const checkKeyboard = () => {
      // If window is more than 25% smaller, keyboard is likely visible
      const isKeyboardVisible = window.innerHeight < originalHeight * 0.75;
      setKeyboardVisible(isKeyboardVisible);
    };
    
    window.addEventListener('resize', checkKeyboard);
    
    return () => {
      window.removeEventListener('resize', checkKeyboard);
    };
  }, []);
  
  // Main AI interaction function
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const path = location.startsWith("/") ? location.substring(1) : location;
      const category = path || "home";
      
      const response = await apiRequest({
        url: "/api/chat/orchestrator",
        method: "POST",
        data: { 
          message,
          category
        }
      });
      
      return response;
    },
    onSuccess: (response: any) => {
      setIsAiSpeaking(false);
      
      if (response && response.message) {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          actions: response.actions || [],
          suggestions: response.suggestions || []
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Process any actions returned from the AI
        if (response.actions && response.actions.length > 0) {
          response.actions.forEach((action: AIAction) => {
            handleAIAction(action);
          });
        }
        
        setTimeout(() => {
          if (chatRef.current) {
            chatRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 100);
      }
    },
    onError: (error: Error) => {
      setIsAiSpeaking(false);
      toast({
        title: "Communication Error",
        description: "There was a problem connecting to the AI. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || chatMutation.isPending) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsAiSpeaking(true);
    
    chatMutation.mutate(input);
    
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  };
  
  // Function to handle AI actions
  const handleAIAction = async (action: AIAction) => {
    console.log("Processing AI action:", action);
    
    switch (action.type) {
      case "navigate":
        if (action.payload.route) {
          console.log("Navigating to:", action.payload.route, "Section:", action.payload.section);
          const section = action.payload.section ? `/${action.payload.section}` : '';
          setLocation(`/${action.payload.route}${section}`);
          
          // Dispatch a custom event if a section was specified
          if (action.payload.section) {
            const event = new CustomEvent('sectionSelected', { 
              detail: { section: action.payload.section } 
            });
            window.dispatchEvent(event);
          }
        }
        break;
      
      case "openFeature":
        if (action.payload.feature) {
          // Dispatch a custom event to open a specific feature
          const event = new CustomEvent('openFeature', { 
            detail: { feature: action.payload.feature } 
          });
          window.dispatchEvent(event);
        }
        break;
      
      default:
        console.log("Unknown action type:", action.type);
    }
  };
  
  // Get current theme color based on location
  const getCurrentThemeColor = useMemo(() => {
    const currentPage = location.split('/')[1] || 'home';
    return pageColors[currentPage as keyof typeof pageColors] || pageColors.home;
  }, [location, pageColors]);

  return (
    <div 
      ref={chatContainer}
      className={cn(
        "fixed z-[1000] transition-all duration-300 ease-in-out",
        isMinimized
          ? "top-4 right-4 w-14 h-14"
          : isMobile
            ? keyboardVisible
              ? "top-0 left-0 right-0 w-full h-[40vh]"
              : "top-0 left-0 right-0 w-full max-h-[75vh]"
            : "w-96 h-[500px]"
      )}
      style={{
        top: !isMinimized && !isMobile ? position.y : undefined,
        left: !isMinimized && !isMobile ? position.x : undefined,
        right: isMinimized || isMobile ? undefined : position.x === 0 ? '16px' : undefined
      }}
    >
      {isMinimized ? (
        <div className="relative">
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
        </div>
      ) : (
        <Card className={cn(
          "flex flex-col shadow-xl border-2 border-primary/10",
          "overflow-hidden",
          isMobile ? "h-full rounded-b-xl rounded-t-none" : "h-full rounded-xl"
        )}>
          <div className="p-3 border-b flex items-center justify-between bg-background" data-draggable="true">
            <div className="flex items-center gap-2">
              <div 
                className="cursor-grab active:cursor-grabbing" 
                onMouseDown={handleDragStart}
              >
                <GripHorizontal className="h-4 w-4 text-muted-foreground mr-1" />
              </div>
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
                        ? "bg-primary text-white"
                        : "bg-white border border-gray-200"
                    )}
                    style={{
                      backgroundColor: msg.role === 'user' ? getCurrentThemeColor : '',
                      color: msg.role === 'user' ? 'white' : ''
                    }}
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