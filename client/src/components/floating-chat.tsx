import { useState, useEffect } from 'react';
import { Bot, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ChatInterface from '@/components/chat-interface';
import RobotFundi from '@/components/robot-fundi';
import RobotFundiEnhanced from '@/components/robot-fundi-enhanced';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatingChatProps {
  category?: string;
}

export default function FloatingChat({ category = 'general' }: FloatingChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    // Initial attention animation
    setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1500);
    }, 1000);

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
    
    // Attention-grabbing animation - more frequent for better visibility
    const attentionInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1500);
    }, 10000);
    
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
  
  // Use our custom hook for better mobile detection
  const isMobile = useIsMobile();

  return (
    <>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div 
            className="fixed top-2 right-2 sm:top-6 sm:right-6 md:top-8 md:right-8 z-50 w-full"
            style={{
              maxWidth: isMobile ? 'calc(100% - 16px)' : '450px',
              maxHeight: isMobile ? 'calc(100vh - 32px)' : '650px'
            }}
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
            className="fixed z-[9999] flex flex-col items-center"
            style={{
              right: isMobile ? '12px' : '24px',
              bottom: isMobile ? '12px' : '24px'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: isAnimating ? [1, 1.1, 1] : 1,
              y: isAnimating ? [0, -8, 0] : 0,
              rotate: isAnimating ? [-2, 2, -2, 0] : 0
            }}
            transition={{ 
              duration: 0.7,
              ease: "easeInOut"
            }}
          >
            <Button
              className="p-0 bg-transparent hover:bg-transparent border-none flex items-center justify-center transition-all duration-300 robot-fundi"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                width: isMobile ? '80px' : '96px',
                height: isMobile ? '80px' : '96px'
              }}
              onClick={() => setIsExpanded(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              title="Chat with Fundi"
            >
              <RobotFundi
                speaking={isSpeaking}
                size={isMobile ? "md" : "lg"}
                category={category}
                onOpen={() => setIsExpanded(true)}
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}