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
  homeMaintenance: '#fb923c', // orange-400
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
  homeMaintenance: { name: 'Home Repair Expert', image: '/advisors/maintenance-advisor.png' },
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
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<'br' | 'bl' | 'b' | 'r' | 'l' | null>(null);
  const [initialPosition, setInitialPosition] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [chatSize, setChatSize] = useState({
    width: window.innerWidth < 768 ? 
      '280px' : // Same width for both portrait and landscape on mobile
      '350px', 
    height: window.innerWidth < 768 ? '350px' : '350px' // Same height for mobile and desktop
  });
  
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
    setCurrentMessage,
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

  // Auto-scroll to bottom of messages without animating through all previous messages
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use instant scrolling (no smooth behavior) to avoid the "spasming" effect
      messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
      
      // Also instantly scroll the parent scroll area if available
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea && scrollArea instanceof HTMLElement) {
        // Immediately set scroll to bottom without animation
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
      
      // For mobile devices, ensure we have a backup scrolling method
      if (window.innerWidth < 768) {
        // Force scroll to bottom for mobile without animation
        if (scrollArea && scrollArea instanceof HTMLElement) {
          scrollArea.scrollTop = scrollArea.scrollHeight;
        }
      }
    }
  }, [messages]);

  // Initialize conversation when component mounts
  useEffect(() => {
    const initConversation = async () => {
      // If we don't have an active conversation yet, start one
      if (!activeConversationId) {
        try {
          console.log('Initializing new conversation for category:', category);
          const newConversation = await startConversation(category);
          
          if (newConversation && newConversation.id) {
            console.log('Successfully created conversation:', newConversation);
            setActiveConversation(newConversation.id);
          } else {
            console.warn('Could not create conversation, received:', newConversation);
            
            // As a fallback for testing, create a local conversation ID
            // This allows the UI to work even if the backend connection fails
            const temporaryConversationId = Math.floor(Math.random() * 1000000) + 1;
            console.log('Created temporary conversation ID:', temporaryConversationId);
            setActiveConversation(temporaryConversationId);
            
            // Add a warning message to the chat
            setMessages([
              {
                id: 'system-warning',
                role: 'system',
                content: 'Connection to server temporarily unavailable. Your messages may not be saved.',
                timestamp: new Date(),
                category: 'warning'
              }
            ]);
          }
        } catch (error) {
          console.error('Failed to initialize conversation:', error);
          
          // As a fallback for testing, create a local conversation ID
          const temporaryConversationId = Math.floor(Math.random() * 1000000) + 1;
          console.log('Created temporary conversation ID after error:', temporaryConversationId);
          setActiveConversation(temporaryConversationId);
          
          // Add an error message to the chat
          setMessages([
            {
              id: 'system-error',
              role: 'system',
              content: 'There was an error connecting to the server. Your messages may not be saved.',
              timestamp: new Date(),
              category: 'error'
            }
          ]);
        }
      }
    };
    
    initConversation();
  }, [activeConversationId, category, startConversation, setActiveConversation, setMessages]);
  
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

  // Directly check for financial information in user messages
  const checkForFinancialInfo = (message: string) => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Special case for the common "I know make" typo (for "I now make")
    const knowMakeMatch = lowerMessage.match(/i know make (\$?[\d,]+(?:\.\d{1,2})?)(?:\s+per\s+(?:year|month|week|hour))?/i);
    if (knowMakeMatch && knowMakeMatch[1]) {
      const income = parseFloat(knowMakeMatch[1].replace(/[$,]/g, ''));
      if (!isNaN(income) && income > 0) {
        console.log("DIRECT INCOME MATCH DETECTED (KNOW MAKE):", income);
        
        // Create financial data object for the budget handler
        const financeInfo = {
          type: 'budget',
          message: message,
          rawMessage: message,
          extractedData: { income }
        };
        
        // Trigger the finance connector's budget handler directly
        window.dispatchEvent(new CustomEvent('financeAction', { 
          detail: { action: 'budget', data: financeInfo }
        }));
        
        return true; // Indicate we found and handled financial info
      }
    }
    
    // Check for income/salary mentions with direct pattern matching
    const incomePatterns = [
      /i (make|earn|get paid|receive) (\$?[\d,]+(?:\.\d{1,2})?)(?:\s+per\s+(?:year|month|week|hour))?/i,
      /my (income|salary|wage) is (\$?[\d,]+(?:\.\d{1,2})?)(?:\s+per\s+(?:year|month|week|hour))?/i,
      /i now make (\$?[\d,]+(?:\.\d{1,2})?)(?:\s+per\s+(?:year|month|week|hour))?/i,
      /(\$?[\d,]+(?:\.\d{1,2})?)\s+per\s+(?:year|month|week|hour)/i // Matches "100,000 per year" etc.
    ];
    
    // Try each pattern for income
    for (const pattern of incomePatterns) {
      const match = lowerMessage.match(pattern);
      
      // First, check if this is the standalone pattern with just the number and "per year/month"
      if (pattern.toString().includes('per\\s+(?:year|month|week|hour)') && match && match[1]) {
        const income = parseFloat(match[1].replace(/[$,]/g, ''));
        if (!isNaN(income) && income > 0) {
          console.log("DIRECT INCOME MATCH DETECTED (STANDALONE):", income, "from pattern:", pattern.toString());
          
          // Create financial data object for the budget handler
          const financeInfo = {
            type: 'budget',
            message: message,
            rawMessage: message,
            extractedData: { income }
          };
          
          // Trigger the finance connector's budget handler directly
          window.dispatchEvent(new CustomEvent('financeAction', { 
            detail: { action: 'budget', data: financeInfo }
          }));
          
          return true; // Indicate we found and handled financial info
        }
      }
      // Then check the standard patterns
      else if (match && match[2]) {
        const income = parseFloat(match[2].replace(/[$,]/g, ''));
        if (!isNaN(income) && income > 0) {
          console.log("DIRECT INCOME MATCH DETECTED:", income, "from pattern:", pattern.toString());
          
          // Create financial data object for the budget handler
          const financeInfo = {
            type: 'budget',
            message: message,
            rawMessage: message,
            extractedData: { income }
          };
          
          // Trigger the finance connector's budget handler directly
          window.dispatchEvent(new CustomEvent('financeAction', { 
            detail: { action: 'budget', data: financeInfo }
          }));
          
          return true; // Indicate we found and handled financial info
        }
      }
    }
    
    // Check for rent/housing mentions
    const rentPatterns = [
      /my (rent|lease|apartment|housing) (cost|is|costs) (\$?[\d,]+(?:\.\d{1,2})?)/i,
      /i pay (\$?[\d,]+(?:\.\d{1,2})?) (for|in) (rent|housing|apartment)/i
    ];
    
    // Try each pattern for rent
    for (const pattern of rentPatterns) {
      const match = lowerMessage.match(pattern);
      if (match) {
        // The rent amount could be in position 1 or 3 depending on the pattern
        const rentIndex = pattern.toString().includes('i pay') ? 1 : 3;
        if (match[rentIndex]) {
          const rent = parseFloat(match[rentIndex].replace(/[$,]/g, ''));
          if (!isNaN(rent) && rent > 0) {
            console.log("DIRECT RENT MATCH DETECTED:", rent);
            
            // Create financial data object for the budget handler
            const financeInfo = {
              type: 'budget',
              message: message,
              rawMessage: message,
              extractedData: { 
                rent,
                expense: rent,
                expenseCategory: "Housing" 
              }
            };
            
            // Trigger the finance connector's budget handler directly
            window.dispatchEvent(new CustomEvent('financeAction', { 
              detail: { action: 'budget', data: financeInfo }
            }));
            
            return true; // Indicate we found and handled financial info
          }
        }
      }
    }
    
    return false; // No financial info detected
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;
    
    // Check for financial information first
    const financialInfoDetected = checkForFinancialInfo(input.trim());
    
    // Store the current message for potential calendar event detection
    setCurrentMessage(input.trim());
    
    // Make sure we have an active conversation
    if (!activeConversationId) {
      try {
        console.log('Creating conversation for message send');
        const newConversation = await startConversation(category);
        
        if (newConversation && newConversation.id) {
          console.log('Successfully created new conversation:', newConversation);
          setActiveConversation(newConversation.id);
        } else {
          console.warn('Could not create conversation, using fallback');
          
          // Create a local temporary conversation ID as fallback
          const temporaryConversationId = Math.floor(Math.random() * 1000000) + 1;
          console.log('Created temporary conversation ID for message:', temporaryConversationId);
          setActiveConversation(temporaryConversationId);
          
          // Only show toast in expanded mode to avoid disruption in chat widget
          if (expanded) {
            toast({
              title: 'Notice',
              description: 'Using offline mode. Your messages may not be saved to the server.',
              variant: 'default',
            });
          }
        }
      } catch (error) {
        console.error('Failed to create conversation:', error);
        
        // Create a local temporary conversation ID as fallback
        const temporaryConversationId = Math.floor(Math.random() * 1000000) + 1;
        console.log('Created temporary conversation ID after error:', temporaryConversationId);
        setActiveConversation(temporaryConversationId);
        
        // Only show toast in expanded mode to avoid disruption in chat widget
        if (expanded) {
          toast({
            title: 'Connection Issue',
            description: 'Using offline mode. Your messages may not be saved.',
            variant: 'default',
          });
        }
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
        try {
          // Try to save to the API
          console.log('Saving user message to API, conversationId:', activeConversationId);
          const savedMessage = await addMessageToApi(activeConversationId, 'user', input, category);
          
          if (savedMessage) {
            console.log('Message saved successfully:', savedMessage);
          } else {
            console.warn('Message could not be saved to API');
          }
          
          // Always update local conversation store, whether API call succeeds or not
          addMessageToStore(activeConversationId, {
            id: parseInt(userMessage.id),
            conversationId: activeConversationId,
            role: 'user',
            content: input,
            category: category,
            metadata: null,
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Error saving message to API:', error);
          
          // Still update local conversation store even if API call fails
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
          
          try {
            // Try to save to the API
            console.log('Saving assistant message to API, conversationId:', activeConversationId);
            const savedMessage = await addMessageToApi(
              activeConversationId, 
              'assistant', 
              aiResponse.response, 
              aiResponse.category,
              metadata
            );
            
            if (savedMessage) {
              console.log('Assistant message saved successfully:', savedMessage);
            } else {
              console.warn('Assistant message could not be saved to API');
            }
          } catch (error) {
            console.error('Error saving assistant message to API:', error);
          }
          
          // Always update local conversation store whether API call succeeds or not
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

  // Handle resize start for mouse events
  const handleResizeStart = (
    e: React.MouseEvent | React.TouchEvent, 
    direction: 'br' | 'bl' | 'b' | 'r' | 'l' = 'br'
  ) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    
    // Get initial position for reference during resize
    const chatElement = document.querySelector('.resizable-chat') as HTMLElement;
    if (chatElement) {
      const rect = chatElement.getBoundingClientRect();
      setInitialPosition({ 
        left: rect.left, 
        top: rect.top, 
        width: rect.width, 
        height: rect.height 
      });
    }
    
    // Add event listeners based on event type
    if ('touches' in e) {
      // Touch event
      document.addEventListener('touchmove', handleResizeTouchMove);
      document.addEventListener('touchend', handleResizeEnd);
    } else {
      // Mouse event
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    }
  };

  // Handle resize move with mouse
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const chatElement = document.querySelector('.resizable-chat') as HTMLElement;
    if (!chatElement) return;
    
    const rect = chatElement.getBoundingClientRect();
    let width = parseInt(chatSize.width as string, 10);
    let height = parseInt(chatSize.height as string, 10);
    
    // Calculate new dimensions based on resize direction
    switch (resizeDirection) {
      case 'br': // Bottom-right corner
        width = Math.max(e.clientX - rect.left, 280); // Fixed width for consistency
        height = Math.max(e.clientY - rect.top, 350); // Fixed height for consistency
        break;
      case 'bl': // Bottom-left corner
        width = Math.max(rect.right - e.clientX, 280); // Fixed width for consistency
        height = Math.max(e.clientY - rect.top, 350); // Fixed height for consistency
        chatElement.style.right = 'auto'; 
        chatElement.style.left = `${e.clientX}px`;
        break;
      case 'b': // Bottom edge
        height = Math.max(e.clientY - rect.top, 350); // Fixed height for consistency
        break;
      case 'r': // Right edge
        width = Math.max(e.clientX - rect.left, 280);
        break;
      case 'l': // Left edge
        width = Math.max(rect.right - e.clientX, 280);
        chatElement.style.right = 'auto';
        chatElement.style.left = `${e.clientX}px`;
        break;
      default:
        break;
    }
    
    // Apply the new dimensions directly to the element for immediate feedback
    chatElement.style.width = `${width}px`;
    chatElement.style.height = `${height}px`;
    chatElement.style.maxWidth = `${width}px`;
    
    // Update state for persistence
    setChatSize({
      width: `${width}px`,
      height: `${height}px`
    });
  };
  
  // Handle resize move with touch
  const handleResizeTouchMove = (e: TouchEvent) => {
    if (!isResizing || !e.touches[0]) return;
    
    const chatElement = document.querySelector('.resizable-chat') as HTMLElement;
    if (!chatElement) return;
    
    const rect = chatElement.getBoundingClientRect();
    let width = parseInt(chatSize.width as string, 10);
    let height = parseInt(chatSize.height as string, 10);
    
    // Calculate new dimensions based on resize direction
    switch (resizeDirection) {
      case 'br': // Bottom-right corner
        width = Math.max(e.touches[0].clientX - rect.left, 280); // Fixed width for consistency
        height = Math.max(e.touches[0].clientY - rect.top, 350); // Fixed height for consistency
        break;
      case 'bl': // Bottom-left corner
        width = Math.max(rect.right - e.touches[0].clientX, 280); // Fixed width for consistency
        height = Math.max(e.touches[0].clientY - rect.top, 350); // Fixed height for consistency
        chatElement.style.right = 'auto'; 
        chatElement.style.left = `${e.touches[0].clientX}px`;
        break;
      case 'b': // Bottom edge
        height = Math.max(e.touches[0].clientY - rect.top, 350); // Fixed height for consistency
        break;
      case 'r': // Right edge
        width = Math.max(e.touches[0].clientX - rect.left, 280);
        break;
      case 'l': // Left edge
        width = Math.max(rect.right - e.touches[0].clientX, 280);
        chatElement.style.right = 'auto';
        chatElement.style.left = `${e.touches[0].clientX}px`;
        break;
      default:
        break;
    }
    
    // Apply the new dimensions directly to the element for immediate feedback
    chatElement.style.width = `${width}px`;
    chatElement.style.height = `${height}px`;
    chatElement.style.maxWidth = `${width}px`;
    
    // Update state for persistence
    setChatSize({
      width: `${width}px`,
      height: `${height}px`
    });
  };
  
  // Handle resize end
  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeDirection(null);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.removeEventListener('touchmove', handleResizeTouchMove);
    document.removeEventListener('touchend', handleResizeEnd);
  };

  // Cleanup resize listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleResizeTouchMove);
      document.removeEventListener('touchend', handleResizeEnd);
    };
  }, [isResizing]);

  return (
    <Card className={`flex flex-col border shadow-lg resizable-chat ${className} ${isResizing ? 'user-select-none' : ''}`} 
      style={{ 
        height: expanded ? '500px' : chatSize.height, // Fixed height for consistency
        width: chatSize.width,
        maxWidth: expanded ? '95vw' : window.innerWidth < 768 ? '95%' : 'none',
        margin: !expanded ? '0 auto' : undefined,
        borderRadius: window.innerWidth < 768 ? '0.75rem' : undefined,
        position: 'relative'
      }}>
      <CardHeader className="px-2 py-1.5 sm:px-3 sm:py-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {(currentCategory || category) === 'general' || !advisorInfo[currentCategory || category] ? (
              <div className="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
              </div>
            ) : (
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                <AvatarImage 
                  src={advisorInfo[currentCategory || category]?.image} 
                  alt={advisorInfo[currentCategory || category]?.name || "Advisor"} 
                />
                <AvatarFallback className="text-[10px] sm:text-xs">
                  {advisorInfo[currentCategory || category]?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
            )}
            
            {/* Only show name and badge for specialized advisors */}
            {isSpecialist && advisorInfo[currentCategory || category] && (
              <>
                <CardTitle className="text-xs sm:text-sm font-medium">
                  {advisorInfo[currentCategory || category]?.name || "Advisor"}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-0.5"
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
              className="h-6 w-6 sm:h-7 sm:w-7"
              onClick={onToggleExpand}
              aria-label={expanded ? "Minimize chat" : "Expand chat"}
            >
              <ArrowRight className={`h-4 w-4 sm:h-5 sm:w-5 ${expanded ? 'rotate-90' : '-rotate-90'}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1 px-1.5 sm:px-2 py-1.5 sm:py-2 overflow-y-auto touch-auto" 
        style={{ 
          height: window.innerWidth < 768 ? 'calc(100% - 80px)' : 'calc(100% - 80px)',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          overflowY: 'auto',
          overscrollBehavior: 'contain'
        }}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="space-y-2 sm:space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-3 space-y-3">
              <MessageSquare className="h-8 w-8 mb-1 opacity-50" />
              {category === 'general' ? (
                <>
                  <p className="font-medium text-base sm:text-lg">Hi! I'm Fundi. What's your name?</p>
                  <p className="text-sm sm:text-base">I'm here to help with anything you need today.</p>
                </>
              ) : category === 'finance' ? (
                <>
                  <p className="font-medium text-base sm:text-lg">Hi! I'm your Financial Coach.</p>
                  <p className="text-sm sm:text-base">I can help with budgeting, saving, and financial goals.</p>
                </>
              ) : category === 'career' ? (
                <>
                  <p className="font-medium text-base sm:text-lg">Hello! I'm your Career Mentor.</p>
                  <p className="text-sm sm:text-base">Let's work on your professional development journey.</p>
                </>
              ) : category === 'wellness' ? (
                <>
                  <p className="font-medium text-base sm:text-lg">Hi! I'm your Wellness Guide.</p>
                  <p className="text-sm sm:text-base">I'm here to support your mental health and wellness.</p>
                </>
              ) : category === 'learning' ? (
                <>
                  <p className="font-medium text-base sm:text-lg">Hello! I'm your Learning Facilitator.</p>
                  <p className="text-sm sm:text-base">How can I help you learn and grow today?</p>
                </>
              ) : category === 'cooking' ? (
                <>
                  <p className="font-medium text-base sm:text-lg">Hi! I'm your Cooking Expert.</p>
                  <p className="text-sm sm:text-base">Ready to help with recipes and culinary questions.</p>
                </>
              ) : category === 'fitness' ? (
                <>
                  <p className="font-medium text-base sm:text-lg">Hello! I'm your Fitness Coach.</p>
                  <p className="text-sm sm:text-base">Let's work on your health and fitness goals.</p>
                </>
              ) : category === 'emergency' ? (
                <>
                  <p className="font-medium text-base sm:text-lg">Hi. I'm your Emergency Assistant.</p>
                  <p className="text-sm sm:text-base">How can I help with your urgent situation?</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-base sm:text-lg">Hi! I'm Fundi.</p>
                  <p className="text-sm sm:text-base">How can I help with your {category} needs today?</p>
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
                    max-w-[85%] sm:max-w-[90%] rounded-lg px-2 py-1 sm:px-3 sm:py-2 shadow-sm
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
                    color: msg.role === 'user' ? 'white' : '',
                    width: 'auto',
                    maxWidth: window.innerWidth < 768 ? '70%' : '85%',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                      {(msg.category || category) === 'general' || !advisorInfo[msg.category || category] ? (
                        <div className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                          <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-700" />
                        </div>
                      ) : (
                        <Avatar className="h-4 w-4 sm:h-5 sm:w-5">
                          <AvatarImage 
                            src={advisorInfo[msg.category || category]?.image} 
                            alt={advisorInfo[msg.category || category]?.name || "Advisor"} 
                          />
                          <AvatarFallback className="text-[8px] sm:text-[10px]">
                            {advisorInfo[msg.category || category]?.name?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      {/* Only show name for specialized advisors, not for general AI */}
                      {(msg.category || category) !== 'general' && advisorInfo[msg.category || category] && (
                        <>
                          <span className="text-[10px] sm:text-xs font-medium">
                            {advisorInfo[msg.category || category]?.name || "Advisor"}
                          </span>
                          <span className="text-[8px] sm:text-[10px] px-1 py-0.5 sm:px-1.5 rounded"
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
                  <p className="text-[11px] sm:text-xs md:text-sm leading-tight whitespace-pre-wrap break-words chat-message-content" style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    wordBreak: "break-word"
                  }}>{msg.content}</p>
                  <p className="text-[7px] sm:text-[8px] opacity-60 text-right mt-0.5">
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
          <div className="mt-2 sm:mt-3 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {suggestedActions.length > 0 && suggestedActions.slice(0, 2).map((suggestion, index) => (
                <Button
                  key={`action-${index}`}
                  variant="outline"
                  size="sm"
                  className="text-[10px] sm:text-xs justify-start text-left py-0.5 px-1.5 sm:py-1 sm:px-2 h-auto"
                  style={{
                    borderColor: `${categoryColors[category]}30`,
                    color: categoryColors[category]
                  }}
                  onClick={() => {
                    if (suggestion.action) {
                      // If there's a specific action, add it to the pending actions with permission granted
                      const aiEventStore = useAIEventStore.getState();
                      
                      // Clone the action and set permissionGranted to true to indicate explicit user consent
                      const actionWithPermission = {
                        ...suggestion.action,
                        payload: {
                          ...suggestion.action.payload,
                          permissionGranted: true, // User clicked the suggestion, so permission is explicitly granted
                          reason: suggestion.text // Include the reason for the action
                        }
                      };
                      
                      // Log the permission granted for navigation
                      console.log(`User authorized action: ${suggestion.action.type} with explicit permission`, actionWithPermission);
                      
                      // Add the action with permission to the queue
                      aiEventStore.addPendingAction(actionWithPermission);
                      
                      // Process the action immediately
                      processPendingActions(navigate);
                    } else if (suggestion.path) {
                      // If there's just a path, create a navigation action with permission granted
                      const aiEventStore = useAIEventStore.getState();
                      
                      // Create an explicit navigation action with permission
                      const navigationAction = {
                        type: 'navigate' as const,
                        payload: {
                          route: suggestion.path,
                          permissionGranted: true, // User clicked the suggestion, so permission is explicitly granted
                          reason: suggestion.text // Include the reason for navigation
                        }
                      };
                      
                      // Log the permission granted for navigation
                      console.log(`User authorized navigation to ${suggestion.path} with explicit permission`);
                      
                      // Add the navigation action with permission
                      aiEventStore.addPendingAction(navigationAction);
                      
                      // Process the navigation through our action system rather than directly
                      processPendingActions(navigate);
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
      
      <CardFooter className="p-1 sm:p-2 border-t">
        <div className="flex w-full items-center gap-1 sm:gap-1.5">
          <Textarea
            id="chat-input"
            className="min-h-7 sm:min-h-9 max-h-14 sm:max-h-24 resize-none py-1 px-2 sm:py-1.5 sm:px-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm rounded-xl flex-1"
            placeholder="Ask Fundi a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            style={{
              fontSize: window.innerWidth < 768 ? '12px' : '14px',
              height: window.innerWidth < 768 ? '32px' : 'auto',
              paddingRight: window.innerWidth < 768 ? '6px' : undefined,
              paddingLeft: window.innerWidth < 768 ? '6px' : undefined,
              lineHeight: window.innerWidth < 768 ? '1.2' : undefined,
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isProcessing}
            onClick={handleSendMessage}
            className="h-7 w-7 sm:h-9 sm:w-9 shrink-0 rounded-full"
            style={{
              backgroundColor: categoryColors[category],
              color: 'white',
              opacity: !input.trim() || isProcessing ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <Loader2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            )}
          </Button>
        </div>
      </CardFooter>
      
      {/* Resize handles on multiple sides */}
      {/* Bottom-right corner handle */}
      <div 
        className="resize-handle resize-handle-br w-8 h-8 opacity-50 hover:opacity-90 transition-opacity"
        style={{ 
          backgroundImage: `linear-gradient(135deg, transparent 50%, ${categoryColors[category]} 50%)`,
          borderBottomRightRadius: '0.5rem',
          position: 'absolute',
          bottom: 0,
          right: 0,
          cursor: 'nwse-resize'
        }}
        onMouseDown={(e) => handleResizeStart(e, 'br')}
        onTouchStart={(e) => handleResizeStart(e, 'br')}
      ></div>
      
      {/* Bottom-left corner handle */}
      <div 
        className="resize-handle resize-handle-bl w-8 h-8 opacity-50 hover:opacity-90 transition-opacity"
        style={{ 
          backgroundImage: `linear-gradient(225deg, transparent 50%, ${categoryColors[category]} 50%)`,
          borderBottomLeftRadius: '0.5rem',
          position: 'absolute',
          bottom: 0,
          left: 0,
          cursor: 'nesw-resize'
        }}
        onMouseDown={(e) => handleResizeStart(e, 'bl')}
        onTouchStart={(e) => handleResizeStart(e, 'bl')}
      ></div>
      
      {/* Bottom edge handle */}
      <div 
        className="resize-handle resize-handle-b opacity-40 hover:opacity-80 transition-opacity"
        style={{ 
          background: `${categoryColors[category]}40`,
          position: 'absolute',
          bottom: 0,
          left: '16px',
          right: '16px',
          height: '4px',
          cursor: 'ns-resize'
        }}
        onMouseDown={(e) => handleResizeStart(e, 'b')}
        onTouchStart={(e) => handleResizeStart(e, 'b')}
      ></div>
      
      {/* Right edge handle */}
      <div 
        className="resize-handle resize-handle-r opacity-40 hover:opacity-80 transition-opacity"
        style={{ 
          background: `${categoryColors[category]}40`,
          position: 'absolute',
          right: 0,
          top: '36px',
          bottom: '16px',
          width: '4px',
          cursor: 'ew-resize'
        }}
        onMouseDown={(e) => handleResizeStart(e, 'r')}
        onTouchStart={(e) => handleResizeStart(e, 'r')}
      ></div>
      
      {/* Left edge handle */}
      <div 
        className="resize-handle resize-handle-l opacity-40 hover:opacity-80 transition-opacity"
        style={{ 
          background: `${categoryColors[category]}40`,
          position: 'absolute',
          left: 0,
          top: '36px',
          bottom: '16px',
          width: '4px',
          cursor: 'ew-resize'
        }}
        onMouseDown={(e) => handleResizeStart(e, 'l')}
        onTouchStart={(e) => handleResizeStart(e, 'l')}
      ></div>
    </Card>
  );
}