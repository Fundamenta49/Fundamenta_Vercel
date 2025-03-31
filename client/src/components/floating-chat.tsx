import { useState, useEffect } from 'react';
import { Bot, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ChatInterface from '@/components/chat-interface';


interface FloatingChatProps {
  category?: string;
}

export default function FloatingChat({ category = 'general' }: FloatingChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const categoryColors: Record<string, string> = {
    finance: '#22c55e', 
    career: '#3b82f6', 
    wellness: '#a855f7',
    learning: '#f97316',
    emergency: '#ef4444',
    cooking: '#f59e0b',
    fitness: '#06b6d4',
    general: '#6366f1',
  };

  // Add a pulsing animation effect to draw attention
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);
    
    return () => clearInterval(animationInterval);
  }, []);

  // Get the color for the current category
  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors.general;
  };
  
  return (
    <>
      {isExpanded ? (
        <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 w-full max-w-md">
          <ChatInterface 
            category={category}
            expanded={false}
            onToggleExpand={() => setIsExpanded(false)}
            initialContext={{
              currentPage: category,
              availableActions: [`/${category}`]
            }}
            className="shadow-xl rounded-2xl overflow-hidden"
          />
        </div>
      ) : (
        <Button
          className={`fixed top-6 right-2 z-50 h-9 w-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out border ${
            isAnimating ? 'scale-110' : 'scale-100'
          }`}
          style={{
            backgroundColor: 'white',
            borderColor: getCategoryColor(category),
          }}
          onClick={() => setIsExpanded(true)}
          title="Chat with Fundi"
        >
          {/* Chat icon */}
          <div className="flex items-center justify-center w-full h-full relative">
            <MessageSquare 
              className="h-5 w-5" 
              style={{ color: getCategoryColor(category) }}
            />
            {/* Animation dot to indicate Fundi is available */}
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75"></span>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
          </div>
        </Button>
      )}
    </>
  );
}