import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Map, Search } from 'lucide-react';
import { useTour } from '@/contexts/tours/tour-context';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TourButtonProps {
  tourId?: string; // Optional tour ID to start a specific tour
  tooltipText?: string; // Optional tooltip text
  className?: string; // Optional class for styling
  position?: 'relative' | 'fixed'; // Position strategy
  variant?: 'default' | 'ghost' | 'outline'; // Button variant
  size?: 'default' | 'sm' | 'lg' | 'icon'; // Button size
}

/**
 * A button component that starts or restarts the tour
 */
export default function TourButton({
  tourId = 'initial-tour', // Default to initial tour
  tooltipText = 'Start Tour',
  className = '',
  position = 'relative',
  variant = 'outline',
  size = 'default',
}: TourButtonProps) {
  const { startTour } = useTour();
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  
  // Size mapping for lucide icon
  const iconSizes = {
    default: 20,
    sm: 16,
    lg: 24,
    icon: 18,
  };
  
  // Automatic pulsing effect when mounted
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 2000);
    
    return () => clearInterval(pulseInterval);
  }, []);
  
  // Handle button click with debugging
  const handleClick = () => {
    console.log("Starting tour with ID:", tourId);
    startTour(tourId);
    
    // Add a fallback to ensure tour starts
    setTimeout(() => {
      startTour(tourId);
    }, 300);
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              'cursor-pointer flex items-center justify-center',
              position === 'fixed' && 'fixed bottom-20 right-6 z-50 bg-white rounded-full shadow-lg',
              className
            )}
            initial={{ scale: 1 }}
            animate={{ 
              scale: isPulsing ? 1.1 : 1,
              boxShadow: isPulsing ? '0 0 10px rgba(59, 130, 246, 0.5)' : '0 0 5px rgba(59, 130, 246, 0.2)'
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeInOut" 
            }}
            whileHover={{ 
              scale: 1.15,
              rotate: [0, -10, 10, -5, 5, 0],
              transition: { duration: 0.5 }
            }}
            whileTap={{ scale: 0.9 }}
            aria-label={tooltipText}
            style={{ 
              padding: position === 'fixed' ? '12px' : '8px',
              backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}
          >
            <HelpCircle 
              size={iconSizes[size]} 
              className={cn(
                "text-primary transition-colors duration-300",
                isHovered ? "text-blue-600" : "text-blue-500"
              )}
            />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-white/90 backdrop-blur border border-blue-100 shadow-lg">
          <p className="font-medium">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}