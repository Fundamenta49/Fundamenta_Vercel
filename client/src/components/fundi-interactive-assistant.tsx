import React, { useState, useRef, useEffect } from 'react';
import '../styles/resize-handler.css';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight, MessageSquarePlus, X, Send, Sparkles, ChevronDown, ArrowUpRightFromCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import FundiAvatarEnhanced from './fundi-avatar-enhanced';

interface FundiInteractiveAssistantProps {
  initialCategory?: string;
  onRequestHelp?: (category: string, query?: string) => void;
  onOpenFullModule?: (module: string) => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  initiallyOpen?: boolean;
  className?: string;
}

interface SuggestionItem {
  text: string;
  category: string;
  action?: () => void;
}

export default function FundiInteractiveAssistant({
  initialCategory = 'general',
  onRequestHelp,
  onOpenFullModule,
  position = 'bottom-right',
  initiallyOpen = false,
  className,
}: FundiInteractiveAssistantProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'curious' | 'surprised' | 'concerned'>('neutral');
  const [chatSize, setChatSize] = useState<{width: string, height: string}>({width: '350px', height: '450px'});
  // Initialize with a welcome message but connect to real API for subsequent messages
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; timestamp: Date; id?: string }[]>([
    { 
      text: "Hi there! I'm Fundi, your life skills assistant. How can I help you today?", 
      isUser: false, 
      timestamp: new Date(),
      id: 'welcome-message'
    }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);

  // Suggestions based on category
  const getSuggestions = (): SuggestionItem[] => {
    switch (category) {
      case 'finance':
        return [
          { text: 'Help me create a budget', category: 'finance' },
          { text: 'Explain mortgage terms', category: 'finance' },
          { text: 'How do I improve my credit score?', category: 'finance' },
        ];
      case 'career':
        return [
          { text: 'Review my resume', category: 'career' },
          { text: 'Interview preparation tips', category: 'career' },
          { text: 'How to negotiate salary', category: 'career' },
        ];
      case 'wellness':
        return [
          { text: 'Guided meditation', category: 'wellness' },
          { text: 'Healthy meal planning', category: 'wellness' },
          { text: 'Sleep improvement tips', category: 'wellness' },
        ];
      case 'learning':
        return [
          { text: 'Recommend courses', category: 'learning' },
          { text: 'Study techniques', category: 'learning' },
          { text: 'Help me learn a new skill', category: 'learning' },
        ];
      case 'emergency':
        return [
          { text: 'First aid basics', category: 'emergency' },
          { text: 'Emergency preparedness', category: 'emergency' },
          { text: 'Help with crisis situation', category: 'emergency' },
        ];
      case 'cooking':
        return [
          { text: 'Recipe ideas', category: 'cooking' },
          { text: 'Cooking techniques', category: 'cooking' },
          { text: 'Meal prep tips', category: 'cooking' },
        ];
      case 'fitness':
        return [
          { text: 'Workout suggestions', category: 'fitness' },
          { text: 'Exercise form check', category: 'fitness' },
          { text: 'Track my progress', category: 'fitness' },
        ];
      default:
        return [
          { text: 'Help me with finances', category: 'finance' },
          { text: 'Career advice needed', category: 'career' },
          { text: 'Wellness tips', category: 'wellness' },
          { text: 'Learning resources', category: 'learning' },
        ];
    }
  };

  // Category-specific modules
  const getModules = (): {name: string, category: string, description: string}[] => {
    switch (category) {
      case 'finance':
        return [
          { name: 'Budget Planner', category: 'finance', description: 'Create and manage your budget' },
          { name: 'Credit Score Tracker', category: 'finance', description: 'Monitor and improve your credit' },
          { name: 'Mortgage Calculator', category: 'finance', description: 'Calculate mortgage payments' },
        ];
      case 'career':
        return [
          { name: 'Resume Builder', category: 'career', description: 'Create professional resumes' },
          { name: 'Interview Simulator', category: 'career', description: 'Practice interview skills' },
          { name: 'Career Path Explorer', category: 'career', description: 'Discover career options' },
        ];
      case 'wellness':
        return [
          { name: 'Meditation Guide', category: 'wellness', description: 'Guided meditation sessions' },
          { name: 'Meal Planner', category: 'wellness', description: 'Plan healthy meals' },
          { name: 'Sleep Tracker', category: 'wellness', description: 'Improve sleep quality' },
        ];
      case 'learning':
        return [
          { name: 'Course Catalog', category: 'learning', description: 'Browse available courses' },
          { name: 'Study Planner', category: 'learning', description: 'Create effective study plans' },
          { name: 'Skill Assessment', category: 'learning', description: 'Test your knowledge' },
        ];
      default:
        return [
          { name: 'My Modules', category: 'general', description: 'Access your saved modules' },
          { name: 'Recent Activities', category: 'general', description: 'View recent progress' },
          { name: 'Learning Paths', category: 'general', description: 'Suggested learning paths' },
        ];
    }
  };

  // Auto-scroll chat to bottom when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isChatOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setIsChatOpen(false);
    }
  }, [isOpen]);

  // Handle resize observer for the chat window
  useEffect(() => {
    if (!chatCardRef.current) return;
    
    // Create a resize observer to track the chat window size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setChatSize({
          width: `${width}px`,
          height: `${height}px`
        });
      }
    });
    
    // Start observing the chat card
    resizeObserver.observe(chatCardRef.current);
    
    // Clean up
    return () => {
      resizeObserver.disconnect();
    };
  }, [chatCardRef.current]);

  // Handle emotion changes based on conversation
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // Change emotion based on message content
      if (lastMessage.isUser) {
        // User message might make Fundi curious/thoughtful
        setEmotion('curious');
        setThinking(true);
        setSpeaking(false);
        
        // Simulate thinking and then responding
        const thinkTimer = setTimeout(() => {
          setThinking(false);
          setSpeaking(true);
          
          // Stop speaking after a while
          const speakTimer = setTimeout(() => {
            setSpeaking(false);
            setEmotion('neutral');
          }, 2000);
          
          return () => clearTimeout(speakTimer);
        }, 1500);
        
        return () => clearTimeout(thinkTimer);
      } else {
        // Fundi's own message should show speaking initially then neutral
        setSpeaking(true);
        setEmotion('happy');
        
        const timer = setTimeout(() => {
          setSpeaking(false);
          setEmotion('neutral');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };
    
    // Update UI immediately with user message
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    
    // Detect category from message
    detectCategory(inputValue);
    
    // Show thinking state
    setThinking(true);
    
    try {
      // Format previous messages for API
      const previousMessages = messages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
        timestamp: msg.timestamp,
        category: category
      }));
      
      // Get context from the current page/state
      const context = {
        currentPage: window.location.pathname,
        currentSection: category,
        availableActions: ['navigate', 'search', 'recommend']
      };
      
      // Make API request
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputValue,
          category: category,
          previousMessages: previousMessages,
          context: context
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Update UI with AI response
      const responseMessage = {
        text: responseData.response || responseData.message || generateResponse(inputValue), // Fallback to generated response
        isUser: false,
        timestamp: new Date(),
        id: `assistant-${Date.now()}`
      };
      
      setMessages((prev) => [...prev, responseMessage]);
      
      // Call onRequestHelp callback if provided
      if (onRequestHelp) {
        onRequestHelp(category, inputValue);
      }
    } catch (error) {
      console.error('Error calling chat API:', error);
      
      // Fallback to generated response if API fails
      const fallbackMessage = {
        text: generateResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
        id: `fallback-${Date.now()}`
      };
      
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      // Always end thinking state
      setThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = async (suggestion: SuggestionItem) => {
    // Update category if different
    if (suggestion.category !== category) {
      setCategory(suggestion.category);
    }
    
    // Add as user message
    const userMessage = {
      text: suggestion.text,
      isUser: true,
      timestamp: new Date(),
      id: `suggestion-${Date.now()}`
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Show thinking state
    setThinking(true);
    
    try {
      // Format previous messages for API
      const previousMessages = messages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
        timestamp: msg.timestamp,
        category: category
      }));
      
      // Get context from the current page/state
      const context = {
        currentPage: window.location.pathname,
        currentSection: suggestion.category || category,
        availableActions: ['navigate', 'search', 'recommend']
      };
      
      // Make API request
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: suggestion.text,
          category: suggestion.category || category,
          previousMessages: previousMessages,
          context: context
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Update UI with AI response
      const responseMessage = {
        text: responseData.response || responseData.message || generateResponse(suggestion.text), // Fallback to generated response
        isUser: false,
        timestamp: new Date(),
        id: `assistant-suggestion-${Date.now()}`
      };
      
      setMessages((prev) => [...prev, responseMessage]);
      
      // Call action if provided
      if (suggestion.action) {
        suggestion.action();
      }
      
      // Call onRequestHelp callback if provided
      if (onRequestHelp) {
        onRequestHelp(suggestion.category, suggestion.text);
      }
    } catch (error) {
      console.error('Error calling chat API for suggestion:', error);
      
      // Fallback to generated response if API fails
      const fallbackMessage = {
        text: generateResponse(suggestion.text),
        isUser: false,
        timestamp: new Date(),
        id: `fallback-suggestion-${Date.now()}`
      };
      
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      // Always end thinking state
      setThinking(false);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    
    // Add a system message about category change
    const systemMessage = {
      text: `Switching to ${newCategory} assistant mode. How can I help with ${newCategory} today?`,
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, systemMessage]);
  };

  const handleOpenModule = (module: string) => {
    if (onOpenFullModule) {
      onOpenFullModule(module);
    }
    
    // Add a system message about opening module
    const systemMessage = {
      text: `Opening ${module} module. You can continue our conversation here while you work.`,
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, systemMessage]);
  };

  // Simple category detection from message
  const detectCategory = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('money') || lowerMessage.includes('finance') || lowerMessage.includes('credit')) {
      setCategory('finance');
    } else if (lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('resume') || lowerMessage.includes('interview')) {
      setCategory('career');
    } else if (lowerMessage.includes('health') || lowerMessage.includes('wellness') || lowerMessage.includes('meditation') || lowerMessage.includes('stress')) {
      setCategory('wellness');
    } else if (lowerMessage.includes('learn') || lowerMessage.includes('study') || lowerMessage.includes('course') || lowerMessage.includes('skill')) {
      setCategory('learning');
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('urgent') || lowerMessage.includes('crisis')) {
      setCategory('emergency');
    } else if (lowerMessage.includes('cook') || lowerMessage.includes('recipe') || lowerMessage.includes('meal') || lowerMessage.includes('food')) {
      setCategory('cooking');
    } else if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('fitness') || lowerMessage.includes('training')) {
      setCategory('fitness');
    }
  };

  // Simple response generation
  const generateResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Finance responses
    if (category === 'finance') {
      if (lowerMessage.includes('budget')) {
        return "Creating a budget starts with tracking your income and expenses. Would you like me to help you set up a basic budget plan?";
      } else if (lowerMessage.includes('mortgage')) {
        return "Mortgages can be complex! The main terms to understand are principal, interest, term, and down payment. Would you like me to explain these in more detail?";
      } else if (lowerMessage.includes('credit')) {
        return "Improving your credit score involves paying bills on time, reducing debt, and monitoring your credit report. Would you like specific steps to improve your score?";
      }
    }
    
    // Career responses
    else if (category === 'career') {
      if (lowerMessage.includes('resume')) {
        return "I'd be happy to help with your resume! A strong resume highlights your achievements with measurable results. Would you like to use our Resume Builder tool?";
      } else if (lowerMessage.includes('interview')) {
        return "Preparing for interviews involves researching the company, practicing common questions, and preparing your own questions. Would you like some specific interview techniques?";
      } else if (lowerMessage.includes('salary')) {
        return "When negotiating salary, it's important to research market rates and emphasize your value. Would you like some specific negotiation phrases to use?";
      }
    }
    
    // Wellness responses
    else if (category === 'wellness') {
      if (lowerMessage.includes('meditation')) {
        return "Guided meditation can help reduce stress and improve focus. Would you like to try a short guided meditation session now?";
      } else if (lowerMessage.includes('meal')) {
        return "Healthy meal planning starts with balanced nutrition. Would you like some simple, nutritious meal ideas or help creating a weekly meal plan?";
      } else if (lowerMessage.includes('sleep')) {
        return "Improving sleep quality involves consistent schedules, a relaxing bedtime routine, and a comfortable environment. Would you like more specific tips for better sleep?";
      }
    }
    
    // Default response by category
    switch (category) {
      case 'finance':
        return "I can help with financial matters like budgeting, saving, investing, or understanding financial terms. What specific financial topic would you like assistance with?";
      case 'career':
        return "I can help with career development including resume building, interview preparation, job searching, or professional growth. What aspect of your career would you like to focus on?";
      case 'wellness':
        return "I can assist with wellness topics such as stress management, nutrition, meditation, or self-care routines. What area of wellness would you like to improve?";
      case 'learning':
        return "I can help with learning new skills, finding educational resources, improving study techniques, or creating learning plans. What would you like to learn about?";
      case 'emergency':
        return "I can provide guidance for emergency situations or preparation. Please note that for immediate emergencies, you should contact professional emergency services. How can I assist you?";
      case 'cooking':
        return "I can help with recipes, cooking techniques, meal planning, or ingredient substitutions. What would you like to cook today?";
      case 'fitness':
        return "I can assist with workout routines, exercise techniques, fitness tracking, or physical activity recommendations. What fitness goals are you working towards?";
      default:
        return "I'm here to help with various life skills. Could you tell me more about what you're looking for assistance with?";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Position-specific styling
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return 'left-4 bottom-4';
      case 'top-right':
        return 'right-4 top-4';
      case 'top-left':
        return 'left-4 top-4';
      default: // bottom-right
        return 'right-4 bottom-4';
    }
  };

  return (
    <div className={cn("fixed z-50", getPositionStyles(), className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-2"
          >
            {isChatOpen ? (
              // Chat interface
              <Card 
                ref={chatCardRef}
                className="shadow-xl border-t-4 resize-handler overflow-hidden flex flex-col" 
                style={{ 
                  borderTopColor: `var(--${category}-500, var(--primary))`,
                  minWidth: '300px', 
                  minHeight: '400px',
                  maxWidth: '600px',
                  width: chatSize.width,
                  height: chatSize.height,
                  resize: 'both' 
                }}
              >
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-2">
                    <FundiAvatarEnhanced
                      size="sm"
                      category={category}
                      speaking={false}
                      emotion={emotion}
                    />
                    <CardTitle className="text-base">Fundi Assistant</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={toggleChat}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={toggleOpen}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1 max-h-[60vh] overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div 
                          key={message.id || index} 
                          className={cn(
                            "flex",
                            message.isUser ? "justify-end" : "justify-start"
                          )}
                        >
                          {!message.isUser && (
                            <div className="flex-shrink-0 mr-2 mt-1">
                              <FundiAvatarEnhanced
                                size="xs"
                                category={category}
                                speaking={false}
                                emotion="neutral"
                              />
                            </div>
                          )}
                          <div 
                            className={cn(
                              "max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm",
                              message.isUser ? 
                                "bg-primary text-primary-foreground font-medium" : 
                                `bg-muted/85 text-foreground border border-border/40`
                            )}
                          >
                            <div className="leading-relaxed">{message.text}</div>
                            <div className={cn(
                              "text-xs mt-1 opacity-70",
                              message.isUser ? "text-right" : ""
                            )}>
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {thinking && (
                        <div className="flex justify-start">
                          <div className="flex-shrink-0 mr-2 mt-1">
                            <FundiAvatarEnhanced
                              size="xs"
                              category={category}
                              speaking={false}
                              thinking={true}
                              emotion="curious"
                            />
                          </div>
                          <div className="bg-muted/85 border border-border/40 rounded-lg px-3 py-2 text-sm shadow-sm animate-pulse">
                            <div className="flex items-center space-x-2">
                              <span className="inline-block w-2 h-2 bg-foreground/30 rounded-full"></span>
                              <span className="inline-block w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                              <span className="inline-block w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </CardContent>
                </ScrollArea>
                <CardFooter className="p-3 border-t flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              // Quick menu
              <Card className="w-72 shadow-xl">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                  <div className="flex flex-col">
                    <CardTitle className="text-base">Fundi Assistant</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {category.charAt(0).toUpperCase() + category.slice(1)} mode
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={toggleOpen}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 p-4 pt-0">
                  {/* Avatar */}
                  <div className="flex justify-center py-3">
                    <FundiAvatarEnhanced
                      size="lg"
                      category={category}
                      speaking={speaking}
                      thinking={thinking}
                      emotion={emotion}
                      pulseEffect={true}
                      interactive={true}
                      onInteraction={toggleChat}
                    />
                  </div>
                  
                  {/* Category selector */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button 
                      variant={category === 'finance' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleCategoryChange('finance')}
                      className="text-xs h-7"
                    >
                      Finance
                    </Button>
                    <Button 
                      variant={category === 'career' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleCategoryChange('career')}
                      className="text-xs h-7"
                    >
                      Career
                    </Button>
                    <Button 
                      variant={category === 'wellness' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleCategoryChange('wellness')}
                      className="text-xs h-7"
                    >
                      Wellness
                    </Button>
                    <Button 
                      variant={category === 'learning' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleCategoryChange('learning')}
                      className="text-xs h-7"
                    >
                      Learning
                    </Button>
                  </div>
                  
                  {/* Quick suggestions */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium">Ask me about:</h3>
                    <div className="flex flex-col space-y-1.5">
                      {getSuggestions().slice(0, 3).map((suggestion, i) => (
                        <Button 
                          key={i} 
                          variant="ghost" 
                          size="sm" 
                          className="justify-start h-auto py-1.5 text-xs"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <ChevronRight className="h-3 w-3 mr-1.5 flex-shrink-0" />
                          <span className="truncate">{suggestion.text}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Module shortcuts */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium">Quick access:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {getModules().slice(0, 2).map((module, i) => (
                        <Button 
                          key={i} 
                          variant="outline" 
                          size="sm" 
                          className="h-auto py-2 flex flex-col items-center text-center justify-start w-full"
                          onClick={() => handleOpenModule(module.name)}
                        >
                          <span className="text-xs font-medium">{module.name}</span>
                          <span className="text-[10px] text-muted-foreground mt-1">{module.description}</span>
                          <ArrowUpRightFromCircle className="h-3 w-3 mt-1" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-3">
                  <Button 
                    className="w-full gap-2 h-8" 
                    size="sm"
                    onClick={toggleChat}
                  >
                    <MessageSquarePlus className="h-4 w-4" />
                    Start chat
                  </Button>
                </CardFooter>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar button */}
      <AnimatePresence initial={false}>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleOpen}
            className="cursor-pointer"
          >
            <FundiAvatarEnhanced
              size="lg"
              category={category}
              glowEffect={true}
              pulseEffect={true}
              withShadow={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Extra component for module cards - can be used in future expansions
function ModuleCard({ 
  title, 
  description, 
  category,
  onClick 
}: { 
  title: string;
  description: string;
  category: string;
  onClick?: () => void;
}) {
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md" 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{title}</h3>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
          <div className="flex items-center justify-end pt-2">
            <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs">
              Open
              <ArrowUpRightFromCircle className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}