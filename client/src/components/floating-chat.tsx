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
  const [isVisible, setIsVisible] = useState(true);
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
            className="shadow-xl"
          />
        </div>
      ) : (
        <Button
          className={`fixed top-6 right-6 sm:top-8 sm:right-8 z-50 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out ${
            isAnimating ? 'scale-110' : 'scale-100'
          }`}
          onClick={() => setIsExpanded(true)}
        >
          {/* Chat icon */}
          <div className="flex items-center justify-center w-full h-full">
            <MessageSquare className="h-6 w-6 text-gray-700" />
            {/* Animation dot to indicate Fundi is available */}
            <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75"></span>
            <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-green-500"></span>
          </div>
        </Button>
      )}
    </>
  );
}