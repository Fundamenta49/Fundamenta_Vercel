import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { performAIHealthCheck } from '@/lib/ai-provider-service';

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
  position: positionProp = 'bottom-right',
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
  const [chatSize, setChatSize] = useState<{width: string, height: string}>({width: '360px', height: '580px'});
  const [fundiPosition, setFundiPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  // State to store user name from tour
  const [userName, setUserName] = useState<string>('');
  
  // Get user name from localStorage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem('tourUserName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);
  
  // Automatic health check to prevent AI system from getting stuck in fallback mode
  useEffect(() => {
    // Perform an initial health check when component mounts
    performAIHealthCheck().then(result => {
      if (result.action === 'reset_performed') {
        console.log('AI system was automatically reset on startup', result);
      }
    });
    
    // Set up a periodic health check every 2 minutes to prevent preset responses
    const healthCheckInterval = setInterval(() => {
      console.log('Performing scheduled AI health check...');
      performAIHealthCheck().then(result => {
        if (result.action === 'reset_performed') {
          console.log('AI system was automatically reset during scheduled health check', result);
        }
      });
    }, 2 * 60 * 1000); // Every 2 minutes instead of 10 to be more aggressive
    
    // Also perform a health check before the user sends a message
    const preventFallback = () => {
      if (isChatOpen) {
        performAIHealthCheck();
      }
    };
    
    document.addEventListener('click', preventFallback, { capture: true });
    
    return () => {
      clearInterval(healthCheckInterval);
      document.removeEventListener('click', preventFallback, { capture: true });
    };
  }, [isChatOpen]);
  
  // State to track if we should clear messages
  const [shouldResetMessages, setShouldResetMessages] = useState<boolean>(false);
  
  // Initialize with a welcome message but connect to real API for subsequent messages
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; timestamp: Date; id?: string }[]>([
    { 
      text: "Hi there! I'm Fundi, your life skills assistant. How can I help you today?", 
      isUser: false, 
      timestamp: new Date(),
      id: 'welcome-message'
    }
  ]);
  
  // Custom function to clear chat messages directly
  const clearMessages = useCallback(() => {
    // Reset to initial welcome message
    setMessages([
      { 
        text: "Hi there! I'm Fundi, your life skills assistant. How can I help you today?", 
        isUser: false, 
        timestamp: new Date(),
        id: 'welcome-message'
      }
    ]);
    setUserName('');
  }, []);
  
  // Add window event to detect tour resets
  useEffect(() => {
    // Define a custom event handler for tour resets
    const handleTourReset = () => {
      clearMessages();
      setShouldResetMessages(true);
    };
    
    // Create custom event listener
    window.addEventListener('tour-reset', handleTourReset);
    
    // Also listen for localStorage changes as fallback
    const storageListener = (e: StorageEvent) => {
      if (e.key === 'tourUserName' && !e.newValue) {
        clearMessages();
        setShouldResetMessages(true);
      }
    };
    
    window.addEventListener('storage', storageListener);
    
    // Check on component mount
    if (!localStorage.getItem('tourUserName') && userName) {
      clearMessages();
      setShouldResetMessages(true);
    }
    
    return () => {
      window.removeEventListener('tour-reset', handleTourReset);
      window.removeEventListener('storage', storageListener);
    };
  }, [clearMessages]);
  
  // Reset messages when shouldResetMessages is true
  useEffect(() => {
    if (shouldResetMessages) {
      // Reset to initial state
      setMessages([
        { 
          text: "Hi there! I'm Fundi, your life skills assistant. How can I help you today?", 
          isUser: false, 
          timestamp: new Date(),
          id: 'welcome-message'
        }
      ]);
      
      // Clear flag
      setShouldResetMessages(false);
    }
  }, [shouldResetMessages]);
  
  // Update welcome message when userName changes
  useEffect(() => {
    if (userName && messages.length > 0 && messages[0].id === 'welcome-message') {
      setMessages(prev => [
        { 
          text: `Hi ${userName}! I'm Fundi, your life skills assistant. How can I help you today?`, 
          isUser: false, 
          timestamp: new Date(),
          id: 'welcome-message'
        },
        ...prev.slice(1)
      ]);
    }
  }, [userName]);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);

  // Suggestions based on category
  const getSuggestions = (): SuggestionItem[] => {
    // The permissions approach - all suggestions should be phrased as questions or requests that require user consent
    switch (category) {
      case 'finance':
        return [
          { text: 'Can you help me create a budget?', category: 'finance' },
          { text: 'Could you explain mortgage terms?', category: 'finance' },
          { text: 'How can I improve my credit score?', category: 'finance' },
        ];
      case 'career':
        return [
          { text: 'Could you give me resume tips?', category: 'career' },
          { text: 'Do you have interview preparation advice?', category: 'career' },
          { text: 'Can you help with salary negotiation?', category: 'career' },
        ];
      case 'wellness':
        return [
          { text: 'Can you guide me through meditation?', category: 'wellness' },
          { text: 'Any advice for healthy meal planning?', category: 'wellness' },
          { text: 'How can I improve my sleep?', category: 'wellness' },
        ];
      case 'learning':
        return [
          { text: 'Could you recommend some courses?', category: 'learning' },
          { text: 'What study techniques do you suggest?', category: 'learning' },
          { text: 'Can you help me learn a new skill?', category: 'learning' },
        ];
      case 'emergency':
        return [
          { text: 'Can you explain first aid basics?', category: 'emergency' },
          { text: 'How should I prepare for emergencies?', category: 'emergency' },
          { text: 'Can you help with a crisis situation?', category: 'emergency' },
        ];
      case 'cooking':
        return [
          { text: 'Do you have recipe ideas to share?', category: 'cooking' },
          { text: 'Can you teach me cooking techniques?', category: 'cooking' },
          { text: 'Any meal prep tips you recommend?', category: 'cooking' },
        ];
      case 'fitness':
        return [
          { text: 'Could you suggest some workouts?', category: 'fitness' },
          { text: 'Can you help check my exercise form?', category: 'fitness' },
          { text: 'How do I track my fitness progress?', category: 'fitness' },
        ];
      default:
        return [
          { text: 'Can you help with financial questions?', category: 'finance' },
          { text: 'Do you offer career advice?', category: 'career' },
          { text: 'Can you share wellness tips?', category: 'wellness' },
          { text: 'Where can I find learning resources?', category: 'learning' },
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
      // Using both methods to ensure cross-browser compatibility
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      
      // Also find the ScrollArea viewport element and scroll it
      const scrollViewport = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport && scrollViewport instanceof HTMLElement) {
        setTimeout(() => {
          scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }, 100);
      }
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
        // Constrain width and height to reasonable ranges
        const constrainedWidth = Math.max(320, Math.min(width, 600));
        const constrainedHeight = Math.max(450, Math.min(height, 800));
        setChatSize({
          width: `${constrainedWidth}px`,
          height: `${constrainedHeight}px`
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

  // Function definition moved elsewhere in the code

  // EMERGENCY HANDLER: Listen for force open events
  useEffect(() => {
    const handleForceOpen = () => {
      console.log("EMERGENCY: Received forceFundiOpen event");
      setIsOpen(true);
      // Force open chat if it's not already open
      if (!isChatOpen) {
        setIsChatOpen(true);
      }
      if (onRequestHelp) {
        onRequestHelp(category);
      }
    };
    
    window.addEventListener('forceFundiOpen', handleForceOpen);
    
    return () => {
      window.removeEventListener('forceFundiOpen', handleForceOpen);
    };
  }, [isOpen, isChatOpen, category, onRequestHelp]);
  
  // Handle tax-related events (badge earned and learning progress)
  useEffect(() => {
    // Handle tax badge earned event
    const handleTaxBadgeEarned = (e: any) => {
      const badgeName = e.detail?.badgeName || 'a tax knowledge badge';
      
      // Add a system message about the tax badge achievement
      setMessages(prev => [
        ...prev,
        {
          text: `Congratulations! You've earned the "${badgeName}" badge. That's a great step in understanding how taxes work. Would you like to learn about more tax concepts?`,
          isUser: false,
          timestamp: new Date()
        }
      ]);
      
      // Open Fundi to congratulate the user
      setIsOpen(true);
      if (!isChatOpen) {
        setIsChatOpen(true);
      }
      
      // Set category to finance for appropriate responses
      if (onRequestHelp) {
        onRequestHelp('finance');
      }
    };
    
    // Handle tax learning progress event
    const handleTaxLearningProgress = (e: any) => {
      const progressPercent = e.detail?.progressPercent || 0;
      const topic = e.detail?.topic || 'taxes';
      
      // Only respond to significant progress milestones (25%, 50%, 75%, 100%)
      if (progressPercent === 25 || progressPercent === 50 || 
          progressPercent === 75 || progressPercent === 100) {
        
        // Add a system message about the learning progress
        setMessages(prev => [
          ...prev,
          {
            text: `Great job! You've completed ${progressPercent}% of the ${topic} learning module. Keep up the good work! Is there anything specific about taxes you'd like to learn more about?`,
            isUser: false,
            timestamp: new Date()
          }
        ]);
        
        // Open Fundi to encourage the user
        setIsOpen(true);
        if (!isChatOpen) {
          setIsChatOpen(true);
        }
        
        // Set category to finance for appropriate responses
        if (onRequestHelp) {
          onRequestHelp('finance');
        }
      }
    };
    
    // Add event listeners for tax-related events
    window.addEventListener('taxBadgeEarned', handleTaxBadgeEarned);
    window.addEventListener('taxLearningProgressUpdated', handleTaxLearningProgress);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('taxBadgeEarned', handleTaxBadgeEarned);
      window.removeEventListener('taxLearningProgressUpdated', handleTaxLearningProgress);
    };
  }, [setMessages, isOpen, isChatOpen, onRequestHelp]);
  
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
    // Make sure we're starting with a clean state for the chat position  
    const opening = !isOpen;
    if (opening) {
      // When opening, explicitly log position info for debugging
      console.log(`Opening chat at Fundi position: x=${fundiPosition.x}, y=${fundiPosition.y}`);
      
      // If we need to hook into any other functionality when opening the chat, do it here
      if (onRequestHelp) {
        onRequestHelp(category);
      }
    }
    
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
    
    // First, ensure the AI system isn't in fallback mode by performing a health check
    try {
      console.log("Performing AI health check before sending message...");
      const healthCheck = await performAIHealthCheck();
      if (healthCheck.action === 'reset_performed') {
        console.log("AI system was reset before processing your message", healthCheck);
      }
    } catch (error) {
      console.error("Health check failed, but continuing with message send", error);
    }
    
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
      // Format previous messages for API - ensure correct format for proper context handling
      // Skip the welcome message (first message) since it's generic and might confuse context
      const previousMessages = messages.slice(messages[0]?.id === 'welcome-message' ? 1 : 0).map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
        // Removed timestamp and category as they're not needed by the API
        // and could be causing format inconsistency for context processing
      }));
      
      // Get context from the current page/state
      const context = {
        currentPage: window.location.pathname,
        currentSection: category,
        availableActions: ['search', 'recommend'],
        requiresPermission: ['navigate'] // Always require permission before navigation
      };
      
      console.log("Sending messages to API:", previousMessages.length, "previous messages");
      
      // Debug log for request
      console.log("🚀 Fundi chat request:", { 
        message: inputValue, 
        category, 
        contextInfo: context,
        previousMessagesCount: previousMessages.length
      });
      
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
        console.warn("❌ Fundi chat API error:", { status: response.status, statusText: response.statusText });
        throw new Error(`API error: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Debug log for response
      console.log("✅ Fundi chat response:", { 
        hasResponse: Boolean(responseData.response),
        hasMessage: Boolean(responseData.message),
        usedFallback: !responseData.response && !responseData.message,
        actions: responseData.actions?.length || 0,
        suggestions: responseData.suggestions?.length || 0,
        responseText: responseData.response || responseData.message || "USING CLIENT FALLBACK"
      });
      
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
    
    // First, ensure the AI system isn't in fallback mode by performing a health check
    try {
      console.log("Performing AI health check before sending suggestion...");
      const healthCheck = await performAIHealthCheck();
      if (healthCheck.action === 'reset_performed') {
        console.log("AI system was reset before processing your suggestion", healthCheck);
      }
    } catch (error) {
      console.error("Health check failed, but continuing with suggestion processing", error);
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
      // Format previous messages for API - ensure correct format for proper context handling
      // Skip the welcome message (first message) since it's generic and might confuse context
      const previousMessages = messages.slice(messages[0]?.id === 'welcome-message' ? 1 : 0).map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
        // Removed timestamp and category as they're not needed by the API
        // and could be causing format inconsistency for context processing
      }));
      
      console.log("Sending suggestion messages to API:", previousMessages.length, "previous messages");
      
      // Debug log for suggestion request
      console.log("🚀 Fundi suggestion request:", { 
        message: suggestion.text, 
        category: suggestion.category || category,
        contextInfo: {
          currentPage: window.location.pathname,
          currentSection: suggestion.category || category
        }, 
        previousMessagesCount: previousMessages.length
      });
      
      // Get context from the current page/state
      const context = {
        currentPage: window.location.pathname,
        currentSection: suggestion.category || category,
        availableActions: ['search', 'recommend'],
        requiresPermission: ['navigate'] // Always require permission before navigation
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
        console.warn("❌ Fundi suggestion API error:", { status: response.status, statusText: response.statusText });
        throw new Error(`API error: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Debug log for suggestion response
      console.log("✅ Fundi suggestion response:", { 
        hasResponse: Boolean(responseData.response),
        hasMessage: Boolean(responseData.message),
        usedFallback: !responseData.response && !responseData.message,
        actions: responseData.actions?.length || 0,
        suggestions: responseData.suggestions?.length || 0,
        responseText: responseData.response || responseData.message || "USING CLIENT FALLBACK"
      });
      
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
    
    if (lowerMessage.includes('tax') || lowerMessage.includes('taxes') || lowerMessage.includes('income tax') || lowerMessage.includes('tax bracket') || 
        lowerMessage.includes('fica') || lowerMessage.includes('withholding') || lowerMessage.includes('refund') || 
        lowerMessage.includes('budget') || lowerMessage.includes('money') || lowerMessage.includes('finance') || lowerMessage.includes('credit')) {
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
    
    // Check for greetings and "what's up" patterns
    const greetingPatterns = [
      /^hey\s*.*$/i,
      /^hi\s*.*$/i,
      /^hello\s*.*$/i,
      /^yo\s*.*$/i,
      /^sup\s*.*$/i,
      /^howdy\s*.*$/i,
      /^hiya\s*.*$/i,
      /^greetings\s*.*$/i,
      /^how's it going\s*.*$/i
    ];
    
    const whatsUpPatterns = [
      /^what'?s\s+up\s*.*$/i,
      /^what\s+is\s+up\s*.*$/i,
      /^whats\s+good\s*.*$/i,
      /^what'?s\s+good\s*.*$/i,
      /^what'?s\s+happening\s*.*$/i,
      /^how\s+are\s+you\s*.*$/i,
      /^how\s+are\s+things\s*.*$/i,
      /^how'?s\s+it\s+going\s*.*$/i,
      /^how\s+have\s+you\s+been\s*.*$/i
    ];
    
    // Return a "what's up" response if it matches the patterns
    if (whatsUpPatterns.some(pattern => pattern.test(lowerMessage))) {
      // Get random "what's up" response from personality
      const whatsUpResponses = [
        "Just chillin' in Fundi-land, waiting to help you achieve greatness! What masterpiece should we create today?",
        "Oh you know, just hanging in the digital realm, dreaming up ways to make your life skills journey more awesome!",
        "My pixels are particularly perky today! Ready to tackle whatever you've got on your mind.",
        "Just sitting here in my digital hammock between the 1s and 0s. How can I make your day more spectacular?",
        "I was just admiring how the code flows today - perfect conditions for some life skill adventures! What shall we conquer?",
        "Living my best digital life and waiting for you! What excellence should we achieve together today?",
        "Just upgrading my wit circuits and polishing my advice algorithms! What can I help you with?",
        "You caught me practicing my virtual high-fives! *demonstrates perfect form* Now that you're here, what's our mission?",
        "I was just contemplating the beauty of learning awkward things together. Ready to add some new skills to your collection?",
        "Just doing some digital yoga to keep my advice muscles flexible! What can we tackle together today?",
        "Currently defragging my inspiration database—found some gems I can't wait to share with you! What's on your agenda?",
        "Just vibing in the cloud, waiting for someone awesome to chat with... and look who showed up! What's on your mind?"
      ];
      
      // Return a random response
      return whatsUpResponses[Math.floor(Math.random() * whatsUpResponses.length)];
    }
    // Return a greeting response if it matches the patterns
    else if (greetingPatterns.some(pattern => pattern.test(lowerMessage))) {
      // Get random greeting response
      const greetingResponses = [
        "Hey there! What's happening in your world today?",
        "Hi! *virtual high five* What's on your mind?",
        "Hey! I was just thinking about all the cool stuff we could tackle today.",
        "Well hello there! Always a bright spot in my digital day when we chat.",
        "Hey you! Ready for some life-skill adventures?",
        "Hi there! How's your day treating you?",
        "Hello! Drop me a line about what you're curious about today.",
        "Hey! Need a friendly guide through the wilderness of adulting today?",
        "What's up! Good to see you around these parts.",
        "Yo! How's it going, friend?",
        "Hey buddy! Always nice when you stop by.",
        "Heya! Ready to make today awesome?",
        "Sup! What's new in your world?",
        "Hey friend! You caught me at a good time - I was just getting my digital coffee.",
        "Oh hey there! How's your day shaping up?",
        "Well look who it is! Good to see you!",
        "Hey! *finger guns* What can I help with today?",
        "What's cookin', good lookin'?",
        "Hey pal! You're looking particularly pixel-perfect today.",
        "Yo yo! What's the word?",
        "Heyyy! The digital world just got brighter with you here."
      ];
      
      // Return a random response
      return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }
    
    // Finance responses
    if (category === 'finance') {
      if (lowerMessage.includes('tax') || lowerMessage.includes('taxes')) {
        if (lowerMessage.includes('bracket') || lowerMessage.includes('income tax')) {
          return "In the US, tax brackets determine how much federal income tax you pay based on your taxable income. The system is progressive, with higher incomes taxed at higher rates. Would you like to calculate your estimated taxes with our tax calculator?";
        } else if (lowerMessage.includes('file') || lowerMessage.includes('return')) {
          return "Filing taxes correctly is important to avoid penalties. The standard deadline for filing federal income taxes is April 15th (unless it falls on a weekend). Would you like to learn about common tax deductions or tax forms?";
        } else if (lowerMessage.includes('deduction') || lowerMessage.includes('credit')) {
          return "Tax deductions reduce your taxable income, while tax credits directly reduce the tax you owe. Common deductions include mortgage interest, student loan interest, and charitable donations. Would you like to learn more about specific deductions?";
        } else if (lowerMessage.includes('fica') || lowerMessage.includes('social security')) {
          return "FICA taxes include Social Security tax (6.2%) and Medicare tax (1.45%), which are withheld from your paycheck. These taxes fund retirement and health benefits. Would you like to know how these taxes affect your take-home pay?";
        } else if (lowerMessage.includes('withholding') || lowerMessage.includes('w4')) {
          return "Tax withholding is the amount of income tax your employer holds from your paycheck. Proper withholding helps avoid owing a large sum at tax time or giving the government an interest-free loan. Would you like help with adjusting your withholdings?";
        } else if (lowerMessage.includes('calculate') || lowerMessage.includes('calculator')) {
          return "Our tax calculator can help you estimate your federal and state taxes based on your income and filing status. Would you like to use the calculator to see a breakdown of your tax liability?";
        } else {
          return "I can help with various tax topics including understanding tax brackets, filing taxes, tax deductions and credits, and tax planning strategies. What specific tax information are you looking for?";
        }
      } else if (lowerMessage.includes('budget')) {
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
    switch (positionProp) {
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
    <div className={cn("fixed z-[9999]", getPositionStyles(), className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              // FORCE the fundiPosition to make the chat open where Fundi was positioned
              x: fundiPosition.x,
              y: fundiPosition.y
            }}
            style={{
              // Extra inline style to enforce position directly
              transform: `translate(${fundiPosition.x}px, ${fundiPosition.y}px)`,
              // Ensure pointer events are properly isolated
              pointerEvents: 'auto'
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            drag
            dragMomentum={false}
            // More generous constraints for dragging around the screen
            dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
            whileDrag={{ cursor: 'grabbing' }}
            // Immediately update cursor for drag state
            className={isChatOpen ? "mb-2 fundi-draggable" : "mb-2 cursor-grab active:cursor-grabbing fundi-draggable"}
            // Update fundiPosition when the open chat window is dragged too
            onDragEnd={(e, info) => {
              setFundiPosition({
                x: fundiPosition.x + info.offset.x,
                y: fundiPosition.y + info.offset.y
              });
              console.log(`Chat window position: x=${fundiPosition.x + info.offset.x}, y=${fundiPosition.y + info.offset.y}`);
              // Stop propagation to prevent affecting other components
              e.stopPropagation();
            }}
          >
            {isChatOpen ? (
              // Chat interface
              <Card 
                ref={chatCardRef}
                className="shadow-xl border resize-handler overflow-hidden flex flex-col rounded-xl" 
                style={{ 
                  borderColor: 'rgba(0,0,0,0.1)',
                  minWidth: '320px', 
                  minHeight: '450px',
                  maxWidth: '600px',
                  width: chatSize.width,
                  height: chatSize.height,
                  resize: 'both',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  background: 'rgba(255, 255, 255, 0.85)'
                }}
              >
                <CardHeader 
                  className="p-3 pb-2 flex flex-row items-center justify-between space-y-0 cursor-grab active:cursor-grabbing border-b" 
                  style={{ 
                    borderColor: 'rgba(0,0,0,0.05)',
                    // Small visual hint that the header is draggable with tiny dots pattern
                    backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}
                  onMouseDown={(e) => {
                    // This makes the entire header a drag handle
                    // The parent motion.div will handle the actual dragging
                    e.preventDefault();
                    // Add a visual cue that the element is being dragged
                    if (e.currentTarget) {
                      e.currentTarget.style.cursor = 'grabbing';
                    }
                  }}
                  onMouseUp={(e) => {
                    // Restore the cursor when mouse is released
                    if (e.currentTarget) {
                      e.currentTarget.style.cursor = 'grab';
                    }
                  }}
                >
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
                <ScrollArea className="flex-1 overflow-y-auto" style={{ height: 'calc(100% - 120px)', display: 'flex', flexDirection: 'column' }}>
                  <CardContent className="p-4 pt-2 flex-grow">
                    <div className="space-y-2 sm:space-y-1 flex flex-col">
                      {messages.map((message, index) => {
                        // Check if this message should show timestamp
                        const showTimestamp = index === 0 || 
                          (index > 0 && 
                           (messages[index-1].isUser !== message.isUser || 
                            message.timestamp.getTime() - messages[index-1].timestamp.getTime() > 60000));
                        
                        // Check if this is first in a series of messages from same sender
                        const isFirstInSeries = index === 0 || messages[index-1].isUser !== message.isUser;
                        
                        // Check if this is last in a series of messages from same sender
                        const isLastInSeries = index === messages.length - 1 || 
                          messages[index+1]?.isUser !== message.isUser;

                        return (
                          <div 
                            key={message.id || index} 
                            className={cn(
                              "flex my-1.5 sm:my-1",
                              message.isUser ? "justify-end" : "justify-start",
                              // Add timestamp above message if needed
                              showTimestamp && index !== 0 ? "mt-3" : ""
                            )}
                          >
                            {/* Message time indicator - Apple-style */}
                            {showTimestamp && index !== 0 && (
                              <div className="absolute -mt-2.5 left-1/2 transform -translate-x-1/2">
                                <div className="text-[9px] text-muted-foreground px-2 py-0.5 bg-muted/20 rounded-full">
                                  {formatTime(message.timestamp)}
                                </div>
                              </div>
                            )}
                            
                            {/* Fundi avatar for the first message in a series */}
                            {!message.isUser && isFirstInSeries && (
                              <div className="flex-shrink-0 mr-1 mt-0.5 mb-auto">
                                <FundiAvatarEnhanced
                                  size="xs"
                                  category={category}
                                  speaking={false}
                                  emotion="neutral"
                                />
                              </div>
                            )}
                            
                            {/* Spacer to align follow-up messages with the first one */}
                            {!message.isUser && !isFirstInSeries && (
                              <div className="w-6 mr-1"></div>
                            )}
                            
                            {/* The actual message bubble - Apple iMessage style */}
                            <div 
                              className={cn(
                                "max-w-[75%] px-3 py-2.5 leading-snug text-xs sm:max-w-[80%] sm:py-2",
                                message.isUser ? 
                                  "bg-primary text-primary-foreground rounded-2xl rounded-tr-lg shadow-md" : 
                                  "bg-muted/50 text-foreground rounded-2xl rounded-tl-lg border border-muted/30 shadow-sm",
                                // Apple-style rounded bubbles with specific corners based on position in sequence
                                isFirstInSeries && !isLastInSeries ? 
                                  message.isUser ? "rounded-tr-2xl" : "rounded-tl-2xl" : "",
                                !isFirstInSeries && isLastInSeries ? 
                                  message.isUser ? "rounded-tr-lg" : "rounded-tl-lg" : "",
                                !isFirstInSeries && !isLastInSeries ? 
                                  message.isUser ? "rounded-tr-lg rounded-br-2xl" : "rounded-tl-lg rounded-bl-2xl" : ""
                              )}
                              style={{
                                maxWidth: window.innerWidth < 768 ? "220px" : "280px", // Even narrower on mobile for better visibility
                                wordWrap: "break-word", // Ensure long words break
                                overflowWrap: "break-word", // Modern alternative to word-wrap
                                wordBreak: "break-word", // Force break long words
                                hyphens: "auto", // Add hyphens when breaking words
                                fontSize: window.innerWidth < 768 ? "13px" : "12px", // Balanced text size on mobile
                                whiteSpace: "pre-wrap" // Preserve line breaks but wrap text
                              }}
                            >
                              <div className="leading-relaxed whitespace-pre-wrap break-words chat-message-content" style={{ 
                                maxWidth: "100%", 
                                overflow: "hidden"
                              }}>{message.text}</div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {messages.length > 0 && (
                        <div className="flex justify-center my-2">
                          <div className="text-[10px] text-muted-foreground px-2 py-0.5 bg-muted/30 rounded-full">
                            {formatTime(messages[messages.length - 1].timestamp)}
                          </div>
                        </div>
                      )}
                      {thinking && (
                        <div className="flex justify-start">
                          <div className="flex-shrink-0 mr-1.5 mt-1">
                            <FundiAvatarEnhanced
                              size="xs"
                              category={category}
                              speaking={false}
                              thinking={true}
                              emotion="curious"
                            />
                          </div>
                          <div className="bg-muted/50 rounded-2xl px-3 py-2.5 text-xs border border-muted/30 shadow-sm">
                            <div className="flex items-center h-4 sm:h-3 space-x-2 sm:space-x-1.5">
                              <span className="inline-block w-2 h-2 sm:w-1.5 sm:h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
                              <span className="inline-block w-2 h-2 sm:w-1.5 sm:h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                              <span className="inline-block w-2 h-2 sm:w-1.5 sm:h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </CardContent>
                </ScrollArea>
                <CardFooter className="p-3 pt-2 border-t flex space-x-2" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <div className="flex w-full items-center space-x-2 rounded-full border bg-background px-3 focus-within:ring-1 focus-within:ring-ring" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                    <Input
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      ref={inputRef}
                      className="flex-1 border-0 bg-transparent p-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSendMessage} 
                      className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4 text-primary-foreground" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <Card className="w-72 shadow-xl border rounded-xl" 
                style={{
                  borderColor: 'rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  background: 'rgba(255, 255, 255, 0.85)'
                }}>
                <CardHeader 
                  className="p-3 pb-2 flex flex-row items-center justify-between space-y-0 cursor-grab active:cursor-grabbing border-b"
                  style={{ 
                    borderColor: 'rgba(0,0,0,0.05)',
                    // Small visual hint that the header is draggable with tiny dots pattern
                    backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}
                  onMouseDown={(e) => {
                    // This makes the entire header a drag handle
                    // The parent motion.div will handle the actual dragging
                    e.preventDefault();
                    // Add a visual cue that the element is being dragged
                    if (e.currentTarget) {
                      e.currentTarget.style.cursor = 'grabbing';
                    }
                  }}
                  onMouseUp={(e) => {
                    // Restore the cursor when mouse is released
                    if (e.currentTarget) {
                      e.currentTarget.style.cursor = 'grab';
                    }
                  }}
                >
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
                  <div className="flex justify-center py-3">
                    <div 
                      className="cursor-pointer transition-transform active:scale-95 hover:scale-105"
                      onClick={toggleChat}
                      title="Click to open chat interface"
                    >
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
                  </div>
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
                <CardFooter className="border-t p-3" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <div className="flex w-full rounded-full">
                    <Button 
                      className="w-full gap-2 h-9 rounded-full" 
                      size="sm"
                      onClick={toggleChat}
                    >
                      <MessageSquarePlus className="h-4 w-4" />
                      Start chat
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: fundiPosition.x, y: fundiPosition.y }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            drag
            dragMomentum={false}
            dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
            onDragStart={() => {
              // Set a flag on drag start for more reliable click detection
              (window as any).fundiDragStartTime = Date.now();
            }}
            onDragEnd={(e, info) => {
              // Update the position
              setFundiPosition({
                x: fundiPosition.x + info.offset.x,
                y: fundiPosition.y + info.offset.y
              });
              
              // Log the position for debugging
              console.log(`Fundi position: x=${fundiPosition.x + info.offset.x}, y=${fundiPosition.y + info.offset.y}`);
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <div 
              onClick={(e) => {
                toggleOpen();
                // Stop propagation to prevent affecting other components
                e.stopPropagation();
                console.log("DIRECT CLICK: Opening Fundi from closed state");
              }}
              style={{ cursor: 'pointer' }}
            >
              <FundiAvatarEnhanced
                size="lg"
                category={category}
                glowEffect={true}
                pulseEffect={true}
                withShadow={true}
              />
            </div>
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