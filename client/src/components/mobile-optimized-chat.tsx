import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, Sparkles, ChevronDown, ArrowUpRightFromCircle, Maximize2, Minimize2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAIEventStore, useAIContext, processPendingActions } from '@/lib/ai-event-system';
import { useLocation } from 'wouter';
import FundiAvatarEnhanced from './fundi-avatar-enhanced';

// Category colors for different advisor types
const categoryColors: Record<string, string> = {
  finance: '#22c55e', // green-500
  career: '#3b82f6', // blue-500
  wellness: '#a855f7', // purple-500
  learning: '#f97316', // orange-500
  emergency: '#ef4444', // red-500
  cooking: '#f59e0b', // amber-500
  fitness: '#06b6d4', // cyan-500
  general: '#6366f1', // indigo-500
  error: '#ef4444', // red-500
};

// Determine dynamic position styles for the chat interface
const getPositionStyles = (position: string, isDragging: boolean, position1: {x: number, y: number}) => {
  // If we're dragging, use the stored position
  if (isDragging || (position1.x !== 0 && position1.y !== 0)) {
    return {
      top: `${position1.y}px`,
      left: `${position1.x}px`,
      right: 'auto',
      bottom: 'auto',
    };
  }
  
  // Otherwise use the predefined positions
  switch (position) {
    case 'bottom-left':
      return 'left-4 bottom-4 sm:left-6 sm:bottom-6';
    case 'top-right':
      return 'right-4 top-4 sm:right-6 sm:top-6';
    case 'top-left':
      return 'left-4 top-4 sm:left-6 sm:top-6';
    default: // bottom-right
      return 'right-4 bottom-4 sm:right-6 sm:bottom-6';
  }
};

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  category?: string;
}

interface MobileOptimizedChatProps {
  initialCategory?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  initiallyOpen?: boolean;
  className?: string;
}

export default function MobileOptimizedChat({
  initialCategory = 'general',
  position = 'top-right',
  initiallyOpen = false,
  className,
}: MobileOptimizedChatProps) {
  // State for UI
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'curious' | 'surprised' | 'concerned'>('neutral');
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [input, setInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Get position from localStorage to persist between sessions
  const storedPosition = localStorage.getItem('fundi-position');
  const [position1, setPosition1] = useState(storedPosition ? JSON.parse(storedPosition) : { x: 0, y: 0 });
  
  // Location and routing
  const [location, navigate] = useLocation();
  
  // AI context and state
  const { 
    isProcessing, 
    setProcessing, 
    setResponse, 
    suggestedActions, 
    followUpQuestions,
    currentCategory
  } = useAIEventStore();
  
  // Chat messages state
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: "Hi there! I'm Fundi, your life skills assistant. How can I help you today?",
    timestamp: new Date(),
    category: initialCategory
  }]);
  
  // Generate AI context for the current page
  const aiContext = useAIContext({
    currentPage: initialCategory,
    availableActions: [`/${initialCategory}`]
  });
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);
  
  // Make Fundi draggable
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        setPosition1({
          x: e.clientX - 25, // Offset to center the avatar under cursor
          y: e.clientY - 25,
        });
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
        // Save position to localStorage
        localStorage.setItem('fundi-position', JSON.stringify(position1));
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, position1]);
  
  // Determine category from URL
  const getCategoryFromPath = () => {
    if (location.includes('/finance')) return 'finance';
    if (location.includes('/career')) return 'career';
    if (location.includes('/wellness')) return 'wellness';
    if (location.includes('/learning')) return 'learning';
    if (location.includes('/emergency')) return 'emergency';
    if (location.includes('/cooking')) return 'cooking';
    if (location.includes('/fitness')) return 'fitness';
    return 'general';
  };
  
  const category = currentCategory || initialCategory || getCategoryFromPath();
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setThinking(true);
    setProcessing(true);
    
    // Simulate response for now
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm helping you with ${category} topics. This is where I'd provide a real response based on your query.`,
        timestamp: new Date(),
        category: category
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setThinking(false);
      setSpeaking(true);
      setProcessing(false);
      
      setTimeout(() => {
        setSpeaking(false);
      }, 2000);
    }, 1500);
  };
  
  // Handle pressing Enter to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Format time for messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div 
      className={`fixed z-50 ${typeof getPositionStyles(position, isDragging, position1) === 'string' 
        ? getPositionStyles(position, isDragging, position1) as string 
        : ''}`}
      style={
        typeof getPositionStyles(position, isDragging, position1) === 'string'
          ? {}
          : getPositionStyles(position, isDragging, position1) as React.CSSProperties
      }
    >
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            className={`cursor-grab active:cursor-grabbing ${isDragging ? 'z-[9999]' : 'z-50'}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(e) => {
              // Only start dragging if not a button click
              if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                setIsDragging(true);
              }
            }}
          >
            <FundiAvatarEnhanced
              size="lg"
              category={category}
              speaking={speaking}
              thinking={thinking}
              emotion={emotion}
              glowEffect={true}
              pulseEffect={true}
              interactive={true}
              onClick={() => setIsOpen(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${className}`}
          >
            <Card 
              className={`shadow-xl border-t-4 overflow-hidden ${
                isFullscreen 
                  ? 'fixed top-0 left-0 right-0 bottom-0 w-full h-full rounded-none z-[9999]' 
                  : 'w-[90vw] sm:w-80 md:w-96'
              }`}
              style={{ borderTopColor: categoryColors[category] }}
            >
              <CardHeader className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0 border-b">
                <div className="flex items-center space-x-2">
                  <FundiAvatarEnhanced
                    size="sm"
                    category={category}
                    speaking={speaking}
                    emotion={emotion}
                  />
                  <div className="font-medium truncate">
                    Fundi {category !== 'general' ? 
                      <Badge 
                        variant="outline"
                        className="ml-1 text-xs px-1.5 py-0.5"
                        style={{
                          backgroundColor: `${categoryColors[category]}15`,
                          color: categoryColors[category],
                          borderColor: `${categoryColors[category]}30`
                        }}
                      >
                        {category}
                      </Badge> : ''}
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <ScrollArea className={`${isFullscreen ? 'h-[calc(100vh-128px)]' : 'h-[50vh] max-h-[400px]'}`}>
                <CardContent className="p-3 sm:p-4 pt-4 space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`
                          max-w-[90%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm
                          ${msg.role === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-primary/10 border border-primary/20'
                          }
                        `}
                        style={{
                          backgroundColor: msg.role === 'user' 
                            ? categoryColors[category] 
                            : `${categoryColors[category]}15`,
                          borderColor: msg.role === 'user' 
                            ? undefined 
                            : `${categoryColors[category]}30`,
                          color: msg.role === 'user' ? 'white' : ''
                        }}
                      >
                        <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                        <p className="text-[10px] opacity-70 text-right mt-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                  
                  {/* Suggested questions/actions */}
                  {messages.length > 0 && !isProcessing && (
                    <div className="mt-2 sm:mt-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          `Tell me about ${category}`,
                          `How do I improve my ${category} skills?`,
                          `${category} tips for beginners`
                        ].map((suggestion, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="text-xs justify-start text-left py-1 px-2"
                            onClick={() => {
                              setInput(suggestion);
                              textareaRef.current?.focus();
                            }}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>

              <CardFooter className="p-2 sm:p-3 border-t">
                <div className="flex w-full items-center gap-1.5 sm:gap-2">
                  <Textarea
                    ref={textareaRef}
                    className="min-h-10 sm:min-h-12 resize-none py-2 px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm rounded-xl flex-1"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isProcessing}
                    rows={1}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!input.trim() || isProcessing}
                    onClick={handleSendMessage}
                    className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full"
                    style={{
                      backgroundColor: categoryColors[category],
                      color: 'white',
                      opacity: !input.trim() || isProcessing ? 0.7 : 1
                    }}
                  >
                    {isProcessing ? (
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}