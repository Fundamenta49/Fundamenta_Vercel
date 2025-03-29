import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { AIResponse, useAIEventStore, useAIContext, processPendingActions } from '@/lib/ai-event-system';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

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
  finance: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  career: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  wellness: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  learning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  emergency: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  cooking: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  fitness: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  general: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
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
  general: { name: 'Fundi', image: '/mascot/fundi-avatar.png' },
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    setProcessing(true);
    
    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
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
        // Add AI response to chat
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse.response,
          timestamp: new Date(),
          category: aiResponse.category
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setResponse(aiResponse);
      }
    } catch (error) {
      console.error('AI Response Error:', error);
      toast({
        title: 'Something went wrong',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive',
      });
      
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

  return (
    <Card className={`flex flex-col border shadow-md ${className}`} style={{ height: expanded ? '70vh' : '400px' }}>
      <CardHeader className="px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={advisorInfo[currentCategory || category].image} 
                alt={advisorInfo[currentCategory || category].name} 
              />
              <AvatarFallback>
                {advisorInfo[currentCategory || category].name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-base font-medium">
              {advisorInfo[currentCategory || category].name}
            </CardTitle>
            {/* Only show category badge if not in general mode */}
            {(currentCategory || category) !== 'general' && (
              <Badge 
                variant="outline" 
                className={`text-xs ${categoryColors[currentCategory || category]}`}
              >
                {currentCategory || category}
              </Badge>
            )}
          </div>
          {onToggleExpand && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleExpand}
              aria-label={expanded ? "Minimize chat" : "Expand chat"}
            >
              <ArrowRight className={`h-4 w-4 ${expanded ? 'rotate-90' : '-rotate-90'}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
              <p>Ask me anything about {category === 'general' ? 'any topic' : category}.</p>
              <p className="text-sm">I'm here to assist you!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[80%] rounded-lg px-3 py-2 
                    ${msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                    }
                  `}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage 
                          src={advisorInfo[msg.category || category].image} 
                          alt={advisorInfo[msg.category || category].name} 
                        />
                        <AvatarFallback className="text-[10px]">
                          {advisorInfo[msg.category || category].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">
                        {advisorInfo[msg.category || category].name}
                      </span>
                      {/* Only show category badge in message if not general */}
                      {(msg.category || category) !== 'general' && (
                        <span className="text-[10px] bg-opacity-50 px-1.5 rounded">
                          {msg.category || category}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className="text-[10px] opacity-70 text-right mt-1">
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {showSuggestions && (followUpQuestions.length > 0 || suggestedActions.length > 0) && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {followUpQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start text-left"
                  onClick={() => handleSuggestionClick(question)}
                >
                  {question.length > 30 ? question.substring(0, 30) + '...' : question}
                </Button>
              ))}
              
              {suggestedActions.slice(0, 2).map((suggestion, index) => (
                <Button
                  key={`action-${index}`}
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start text-left"
                  onClick={() => navigate(suggestion.path)}
                >
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      
      <CardFooter className="p-2 border-t">
        <div className="flex w-full items-center gap-2">
          <Textarea
            id="chat-input"
            className="min-h-10 max-h-32 resize-none py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isProcessing}
            onClick={handleSendMessage}
            className="h-10 w-10 shrink-0"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}