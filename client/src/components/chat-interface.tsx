import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { AIResponse, useAIEventStore, useAIContext, processPendingActions, AppSuggestion } from '@/lib/ai-event-system';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { useUserMemory } from '@/hooks/use-user-memory';
import useConversationStore from '@/hooks/use-conversation-store';


// Category constants 
export const EMERGENCY_CATEGORY = 'emergency';
export const FINANCE_CATEGORY = 'finance';
export const CAREER_CATEGORY = 'career';
export const WELLNESS_CATEGORY = 'wellness';
export const LEARNING_CATEGORY = 'learning';
export const COOKING_CATEGORY = 'cooking';
export const FITNESS_CATEGORY = 'fitness';
export const GENERAL_CATEGORY = 'general';

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

// Advisor images and names
const advisorInfo: Record<string, { name: string; image: string }> = {
  finance: { name: 'Financial Coach', image: '/advisors/finance-advisor.png' },
  career: { name: 'Career Mentor', image: '/advisors/career-advisor.png' },
  wellness: { name: 'Wellness Guide', image: '/advisors/wellness-advisor.png' },
  learning: { name: 'Learning Facilitator', image: '/advisors/learning-advisor.png' },
  emergency: { name: 'Emergency Assistant', image: '/advisors/emergency-advisor.png' },
  cooking: { name: 'Cooking Expert', image: '/advisors/cooking-advisor.png' },
  fitness: { name: 'Fitness Coach', image: '/advisors/fitness-advisor.png' },
  general: { name: 'AI Assistant', image: '/mascot/fundi-avatar.png' },
  error: { name: 'Assistant', image: '/mascot/fundi-avatar.png' },
};

// Message types
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  category?: string;
}

// Chat interface props
interface ChatInterfaceProps {
  category?: string;
  initialContext?: {
    currentPage: string;
    currentSection?: string;
    availableActions: string[];
  };
  className?: string;
  expanded?: boolean;
  showSuggestions?: boolean;
  onToggleExpand?: () => void;
}

export default function ChatInterface({
  category = 'general',
  initialContext = {
    currentPage: 'home',
    availableActions: ['navigate', 'trigger_feature']
  },
  className = '',
  expanded = false,
  showSuggestions = true,
  onToggleExpand
}: ChatInterfaceProps) {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [, navigate] = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // User memory and conversation hooks
  const { 
    userInfo, 
    setUserName, 
    startConversation, 
    addMessage: addMessageToApi 
  } = useUserMemory();
  
  const {
    activeConversationId,
    setActiveConversation,
    addMessage: addMessageToStore,
    messagesByConversation
  } = useConversationStore();
  
  // AI state from store
  const { 
    isProcessing, 
    setProcessing, 
    setResponse, 
    suggestedActions, 
    followUpQuestions,
    currentCategory
  } = useAIEventStore();
  
  // Generate AI context for the current page
  const aiContext = useAIContext(initialContext);

  // Process AI actions when they are received
  useEffect(() => {
    processPendingActions(navigate);
  }, [messages, navigate]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      // First try to use scrollIntoView
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      
      // Also try to scroll the parent scroll area if available
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea && scrollArea instanceof HTMLElement) {
        setTimeout(() => {
          // Set a small delay to ensure DOM has updated
          scrollArea.scrollTop = scrollArea.scrollHeight;
        }, 100);
      }
      
      // For mobile devices, ensure we have a backup scrolling method
      if (window.innerWidth < 768) {
        setTimeout(() => {
          // Extra timeout for mobile rendering
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
          
          // Force scroll to bottom for mobile
          if (scrollArea && scrollArea instanceof HTMLElement) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
          }
        }, 300);
      }
    }
  }, [messages]);

  // Initialize conversation when component mounts
  useEffect(() => {
    const initConversation = async () => {
      // If we don't have an active conversation yet, start one
      if (!activeConversationId) {
        try {
          const newConversation = await startConversation(category);
          if (newConversation) {
            setActiveConversation(newConversation.id);
          }
        } catch (error) {
          console.error('Failed to initialize conversation:', error);
        }
      }
    };
    
    initConversation();
  }, [activeConversationId, category, startConversation, setActiveConversation]);
  
  // Load existing messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      // Check if we already have messages in the store
      const cachedMessages = messagesByConversation[activeConversationId];
      
      if (cachedMessages && cachedMessages.length > 0) {
        // Format messages for our local state
        const formattedMessages: Message[] = cachedMessages.map(msg => ({
          id: msg.id.toString(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          category: msg.category || category
        }));
        
        setMessages(formattedMessages);
      } else {
        // Fetch messages from API using react-query (handled by useUserMemory hook)
        // This will be updated in the messagesByConversation store,
        // and then we'll catch it in the next useEffect
        
        // For now, just start with an empty conversation
        setMessages([]);
      }
    }
  }, [activeConversationId, messagesByConversation, category]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;
    
    // Make sure we have an active conversation
    if (!activeConversationId) {
      try {
        const newConversation = await startConversation(category);
        if (newConversation) {
          setActiveConversation(newConversation.id);
        } else {
          toast({
            title: 'Connection Error',
            description: 'Could not start a new conversation. Please try again.',
            variant: 'destructive',
          });
          return;
        }
      } catch (error) {
        console.error('Failed to create conversation:', error);
        toast({
          title: 'Connection Error',
          description: 'Could not start a new conversation. Please try again.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      category: category
    };
    
    // Update UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setProcessing(true);
    
    try {
      // Save message to database if we have an active conversation
      if (activeConversationId) {
        await addMessageToApi(activeConversationId, 'user', input, category);
        
        // Update local conversation store
        addMessageToStore(activeConversationId, {
          id: parseInt(userMessage.id),
          conversationId: activeConversationId,
          role: 'user',
          content: input,
          category: category,
          metadata: null,
          timestamp: new Date()
        });
      }
      
      // Check if this message contains a name introduction
      const nameMatcher = /(?:(?:i['']?m|my name is|call me|i go by|they call me)\s+)([a-z0-9]+(?:\s+[a-z0-9]+)?)/i;
      const nameMatch = input.match(nameMatcher);
      
      if (nameMatch && nameMatch[1] && !userInfo?.name) {
        const userName = nameMatch[1].trim();
        // Don't process names that are too short or common stop words
        if (userName.length > 1 && !['the', 'a', 'an', 'just', 'also'].includes(userName.toLowerCase())) {
          await setUserName(userName);
        }
      }
      
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the current user message
      conversationHistory.push({
        role: 'user',
        content: input
      });
      
      // Make API request to AI backend
      const response = await apiRequest(
        'POST',
        '/api/chat/orchestrator',
        {
          message: input,
          context: aiContext,
          category: category !== 'general' ? category : undefined,
          previousMessages: conversationHistory
        }
      );
      
      const responseData = await response.json();
      
      if (responseData) {
        const aiResponse = responseData as AIResponse;
        console.log("AI Response:", aiResponse); // For debugging
        
        // Add AI response to chat
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse.response,
          timestamp: new Date(),
          category: aiResponse.category
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Save assistant message to database
        if (activeConversationId) {
          const metadata = {
            sentiment: aiResponse.sentiment,
            actions: aiResponse.actions,
            suggestions: aiResponse.suggestions
          };
          
          await addMessageToApi(
            activeConversationId, 
            'assistant', 
            aiResponse.response, 
            aiResponse.category,
            metadata
          );
          
          // Update local conversation store
          addMessageToStore(activeConversationId, {
            id: parseInt(assistantMessage.id),
            conversationId: activeConversationId,
            role: 'assistant',
            content: aiResponse.response,
            category: aiResponse.category || null,
            metadata,
            timestamp: new Date()
          });
        }
        
        // Set full AI response in store
        setResponse({
          ...aiResponse,
          // Ensure followUpQuestions is an array
          followUpQuestions: Array.isArray(aiResponse.followUpQuestions) 
            ? aiResponse.followUpQuestions 
            : []
        });
      }
    } catch (error) {
      console.error('AI Response Error:', error);
      toast({
        title: 'Something went wrong',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Handle pressing Enter to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Focus the textarea after setting the suggestion
    setTimeout(() => {
      document.getElementById('chat-input')?.focus();
    }, 0);
  };

  // Determine if showing a specialized advisor or general AI assistant
  const isSpecialist = (currentCategory || category) !== 'general';

  return (
    <Card className={`flex flex-col border shadow-lg ${className}`} style={{ 
      height: expanded ? '85vh' : window.innerWidth < 768 ? '400px' : '350px',
      maxWidth: expanded ? '95vw' : '350px',
      width: '100%',
      margin: !expanded ? '0 auto' : undefined,
      maxHeight: !expanded && window.innerWidth < 768 ? '450px' : '350px'
    }}>
      <CardHeader className="px-3 py-2 sm:px-4 sm:py-2.5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {(currentCategory || category) === 'general' ? (
              <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </div>
            ) : (
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage 
                  src={advisorInfo[currentCategory || category].image} 
                  alt={advisorInfo[currentCategory || category].name} 
                />
                <AvatarFallback>
                  {advisorInfo[currentCategory || category].name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            
            {/* Only show name and badge for specialized advisors */}
            {isSpecialist && (
              <>
                <CardTitle className="text-sm md:text-lg font-medium">
                  {advisorInfo[currentCategory || category].name}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className="text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1"
                  style={{
                    backgroundColor: `${categoryColors[currentCategory || category]}15`, 
                    color: categoryColors[currentCategory || category],
                    borderColor: `${categoryColors[currentCategory || category]}30`
                  }}
                >
                  {currentCategory || category}
                </Badge>
              </>
            )}
          </div>
          
          {onToggleExpand && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleExpand}
              aria-label={expanded ? "Minimize chat" : "Expand chat"}
            >
              <ArrowRight className={`h-5 w-5 ${expanded ? 'rotate-90' : '-rotate-90'}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1 px-3 py-3 overflow-y-auto touch-auto" 
        style={{ 
          height: window.innerWidth < 768 ? 'calc(100% - 100px)' : 'calc(100% - 90px)',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y'
        }}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="space-y-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-4 space-y-4">
              <MessageSquare className="h-10 w-10 mb-2 opacity-50" />
              {category === 'general' ? (
                <>
                  <p className="font-medium text-lg">Hi there! I'm Fundi. What's your name?</p>
                  <p className="text-base">I'd love to get to know you and help with anything you need today.</p>
                </>
              ) : category === 'finance' ? (
                <>
                  <p className="font-medium text-lg">Hi there! I'm your Financial Coach. What's your name?</p>
                  <p className="text-base">I'm here to help with your financial questions and goals.</p>
                </>
              ) : category === 'career' ? (
                <>
                  <p className="font-medium text-lg">Hello! I'm your Career Mentor. What's your name?</p>
                  <p className="text-base">I'm here to help with your professional development journey.</p>
                </>
              ) : category === 'wellness' ? (
                <>
                  <p className="font-medium text-lg">Hi there! I'm your Wellness Guide. What's your name?</p>
                  <p className="text-base">I'm here to support your mental health and wellness goals.</p>
                </>
              ) : category === 'learning' ? (
                <>
                  <p className="font-medium text-lg">Hello! I'm your Learning Facilitator. What's your name?</p>
                  <p className="text-base">I'm here to help you learn and grow in any area you're interested in.</p>
                </>
              ) : category === 'cooking' ? (
                <>
                  <p className="font-medium text-lg">Hi there! I'm your Cooking Expert. What's your name?</p>
                  <p className="text-base">I'm here to help with all your cooking questions and culinary adventures.</p>
                </>
              ) : category === 'fitness' ? (
                <>
                  <p className="font-medium text-lg">Hello! I'm your Fitness Coach. What's your name?</p>
                  <p className="text-base">I'm here to help you reach your fitness and health goals.</p>
                </>
              ) : category === 'emergency' ? (
                <>
                  <p className="font-medium text-lg">Hi there. I'm your Emergency Assistant. What's your name?</p>
                  <p className="text-base">I'm here to help with your urgent situation. How can I assist you?</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-lg">Hi there! I'm Fundi. What's your name?</p>
                  <p className="text-base">I'd love to get to know you better and help with your {category} needs.</p>
                </>
              )}
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[90%] sm:max-w-[85%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-primary/10 border border-primary/20'
                    }
                  `}
                  style={{
                    backgroundColor: msg.role === 'user' 
                      ? categoryColors[msg.category || category] 
                      : `${categoryColors[msg.category || category]}15`, // 15% opacity
                    borderColor: msg.role === 'user' 
                      ? undefined 
                      : `${categoryColors[msg.category || category]}30`, // 30% opacity
                    color: msg.role === 'user' ? 'white' : ''
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      {(msg.category || category) === 'general' ? (
                        <div className="h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center">
                          <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-700" />
                        </div>
                      ) : (
                        <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                          <AvatarImage 
                            src={advisorInfo[msg.category || category].image} 
                            alt={advisorInfo[msg.category || category].name} 
                          />
                          <AvatarFallback className="text-[10px] sm:text-xs">
                            {advisorInfo[msg.category || category].name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      {/* Only show name for specialized advisors, not for general AI */}
                      {(msg.category || category) !== 'general' && (
                        <>
                          <span className="text-xs sm:text-sm font-medium">
                            {advisorInfo[msg.category || category].name}
                          </span>
                          <span className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 rounded"
                            style={{
                              backgroundColor: `${categoryColors[msg.category || category]}15`,
                              color: categoryColors[msg.category || category],
                              borderColor: `${categoryColors[msg.category || category]}30`
                            }}
                          >
                            {msg.category || category}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className="text-[10px] sm:text-xs opacity-70 text-right mt-1.5 sm:mt-2">
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Only show action suggestions, not followUpQuestions, and only after at least one message exchange */}
        {showSuggestions && messages.length >= 2 && suggestedActions.length > 0 && (
          <div className="mt-3 sm:mt-4 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {suggestedActions.length > 0 && suggestedActions.slice(0, 2).map((suggestion, index) => (
                <Button
                  key={`action-${index}`}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm justify-start text-left py-1 px-2 sm:py-1.5 sm:px-2.5"
                  style={{
                    borderColor: `${categoryColors[category]}30`,
                    color: categoryColors[category]
                  }}
                  onClick={() => {
                    if (suggestion.action) {
                      // If there's a specific action, add it to the pending actions
                      const aiEventStore = useAIEventStore.getState();
                      aiEventStore.addPendingAction(suggestion.action);
                      // Process the action immediately
                      processPendingActions(navigate);
                    } else if (suggestion.path) {
                      // If there's just a path, navigate to it
                      navigate(suggestion.path);
                    }
                  }}
                >
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      
      <CardFooter className="p-1.5 sm:p-2.5 border-t">
        <div className="flex w-full items-center gap-1.5 sm:gap-2">
          <Textarea
            id="chat-input"
            className="min-h-8 sm:min-h-10 max-h-20 sm:max-h-28 resize-none py-1.5 px-2.5 sm:py-2 sm:px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm rounded-xl flex-1"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            style={{
              fontSize: window.innerWidth < 768 ? '14px' : '16px',
              height: window.innerWidth < 768 ? '40px' : 'auto',
              paddingRight: window.innerWidth < 768 ? '8px' : undefined,
              paddingLeft: window.innerWidth < 768 ? '8px' : undefined,
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isProcessing}
            onClick={handleSendMessage}
            className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full"
            style={{
              backgroundColor: categoryColors[category],
              color: 'white',
              opacity: !input.trim() || isProcessing ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 sm:h-6 sm:w-6 animate-spin" />
            ) : (
              <Send className="h-4 w-4 sm:h-6 sm:w-6" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}