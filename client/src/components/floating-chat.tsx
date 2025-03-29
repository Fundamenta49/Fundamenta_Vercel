import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ChatInterface from '@/components/chat-interface';

interface FloatingChatProps {
  category?: string;
}

export default function FloatingChat({ category = 'general' }: FloatingChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <>
      {isExpanded ? (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
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
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsExpanded(true)}
          style={{ backgroundColor: categoryColors[category] }}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </>
  );
}