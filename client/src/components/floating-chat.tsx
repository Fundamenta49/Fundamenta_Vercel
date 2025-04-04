import { useState, useEffect } from 'react';
import { Bot, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ChatInterface from '@/components/chat-interface';
import RobotFundiEnhanced from '@/components/robot-fundi-enhanced';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingChatProps {
  category?: string;
}

export default function FloatingChat({ category = 'general' }: FloatingChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

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

  // Add random animations to make the robot feel more alive
  useEffect(() => {
    // Speaking animation
    const speakingInterval = setInterval(() => {
      if (Math.random() > 0.7 && !isThinking) {
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 2000);
      }
    }, 8000);
    
    // Thinking animation
    const thinkingInterval = setInterval(() => {
      if (Math.random() > 0.85 && !isSpeaking) {
        setIsThinking(true);
        setTimeout(() => setIsThinking(false), 3000);
      }
    }, 15000);
    
    // Attention-grabbing animation
    const attentionInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 20000);
    
    return () => {
      clearInterval(speakingInterval);
      clearInterval(thinkingInterval);
      clearInterval(attentionInterval);
    };
  }, [isSpeaking, isThinking]);

  // Get the color for the current category
  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors.general;
  };
  
  return (
    <>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div 
            className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        ) : (
          <motion.div
            className="fixed right-6 bottom-6 z-[9999] flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: isAnimating ? [1, 1.1, 1] : 1,
              y: isAnimating ? [0, -5, 0] : 0
            }}
            transition={{ duration: 0.5 }}
          >
            <Button
              className="p-0 bg-transparent hover:bg-transparent border-none shadow-none flex items-center justify-center"
              onClick={() => setIsExpanded(true)}
              title="Chat with Fundi"
            >
              <RobotFundiEnhanced 
                speaking={isSpeaking}
                thinking={isThinking}
                size="xl"
                glowIntensity="high"
                pulsing={true}
                interactive={true}
                category={category}
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}