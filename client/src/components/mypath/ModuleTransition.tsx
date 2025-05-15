import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { cn } from '@/lib/utils';
import { useJungleTheme } from '@/jungle-path/contexts/JungleThemeContext';
import { useToast } from '@/hooks/use-toast';

interface ModuleTransitionProps {
  pathwayId: string;
  currentModuleId: string;
  children: React.ReactNode;
}

/**
 * ModuleTransition provides navigation between modules with animated transitions.
 * It fetches the pathway data to determine next/previous modules and handles
 * the animation and navigation logic.
 */
export function ModuleTransition({ 
  pathwayId,
  currentModuleId,
  children 
}: ModuleTransitionProps) {
  const [, navigate] = useLocation();
  const { isJungleTheme } = useJungleTheme();
  const { toast } = useToast();
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Fetch pathway data to get all modules
  const { data: pathway } = useQuery({
    queryKey: ['/api/pathways', pathwayId],
    enabled: !!pathwayId,
  });
  
  // Reset animation state when module changes
  useEffect(() => {
    setDirection(null);
    setIsAnimating(false);
  }, [currentModuleId]);
  
  // Helper to get next/previous module id
  const getAdjacentModule = (direction: 'next' | 'prev'): string | null => {
    if (!pathway?.modules || pathway.modules.length === 0) {
      return null;
    }
    
    // Find current module index
    const currentIndex = pathway.modules.findIndex(m => m.id === currentModuleId);
    if (currentIndex === -1) return null;
    
    // Return adjacent module id or null if at boundary
    if (direction === 'next' && currentIndex < pathway.modules.length - 1) {
      return pathway.modules[currentIndex + 1].id;
    } else if (direction === 'prev' && currentIndex > 0) {
      return pathway.modules[currentIndex - 1].id;
    }
    
    return null;
  };
  
  // Navigation handlers
  const handleNextModule = () => {
    const nextModuleId = getAdjacentModule('next');
    if (!nextModuleId) {
      toast({
        title: "End of pathway",
        description: "You've reached the last module in this pathway.",
        variant: "default"
      });
      return;
    }
    
    // Prefetch next module data
    queryClient.prefetchQuery({
      queryKey: ['/api/pathways/modules', pathwayId, nextModuleId],
    });
    
    // Set animation direction and state
    setDirection('left');
    setIsAnimating(true);
    
    // Navigate after short delay to allow animation
    setTimeout(() => {
      navigate(`/mypath/pathway/${pathwayId}/module/${nextModuleId}`);
    }, 300);
  };
  
  const handlePrevModule = () => {
    const prevModuleId = getAdjacentModule('prev');
    if (!prevModuleId) {
      toast({
        title: "Start of pathway",
        description: "You're at the first module in this pathway.",
        variant: "default"
      });
      return;
    }
    
    // Prefetch previous module data
    queryClient.prefetchQuery({
      queryKey: ['/api/pathways/modules', pathwayId, prevModuleId],
    });
    
    // Set animation direction and state
    setDirection('right');
    setIsAnimating(true);
    
    // Navigate after short delay to allow animation
    setTimeout(() => {
      navigate(`/mypath/pathway/${pathwayId}/module/${prevModuleId}`);
    }, 300);
  };
  
  // Calculate if next/prev are available
  const hasPrevious = !!getAdjacentModule('prev');
  const hasNext = !!getAdjacentModule('next');
  
  // Animation variants
  const variants = {
    initial: (direction: 'left' | 'right' | null) => {
      return {
        x: direction === 'left' ? '100%' : direction === 'right' ? '-100%' : 0,
        opacity: direction ? 0 : 1
      };
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: 'left' | 'right' | null) => {
      return {
        x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
        opacity: 0,
        transition: {
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }
      };
    }
  };
  
  return (
    <div className="relative overflow-hidden">
      {/* Navigation controls */}
      <div className={cn(
        "flex justify-between mb-4",
        isJungleTheme ? "text-green-300" : ""
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevModule}
          disabled={!hasPrevious || isAnimating}
          className={cn(
            "flex items-center px-2", 
            !hasPrevious && "opacity-50 cursor-not-allowed",
            isJungleTheme ? "text-green-400 hover:text-green-300 hover:bg-green-900/30 disabled:text-green-900" : ""
          )}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous Module
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextModule}
          disabled={!hasNext || isAnimating}
          className={cn(
            "flex items-center px-2",
            !hasNext && "opacity-50 cursor-not-allowed",
            isJungleTheme ? "text-green-400 hover:text-green-300 hover:bg-green-900/30 disabled:text-green-900" : ""
          )}
        >
          Next Module
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {/* Animated content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentModuleId}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * SimpleModuleTransition offers a minimal module transition without animation,
 * suitable for less complex layouts or where performance might be a concern.
 */
export function SimpleModuleTransition({ 
  pathwayId, 
  currentModuleId, 
  children 
}: ModuleTransitionProps) {
  const [, navigate] = useLocation();
  const { isJungleTheme } = useJungleTheme();
  
  // Fetch pathway data to get all modules
  const { data: pathway } = useQuery({
    queryKey: ['/api/pathways', pathwayId],
    enabled: !!pathwayId,
  });
  
  // Helper to get next/previous module id
  const getAdjacentModule = (direction: 'next' | 'prev'): string | null => {
    if (!pathway?.modules || pathway.modules.length === 0) {
      return null;
    }
    
    // Find current module index
    const currentIndex = pathway.modules.findIndex(m => m.id === currentModuleId);
    if (currentIndex === -1) return null;
    
    // Return adjacent module id or null if at boundary
    if (direction === 'next' && currentIndex < pathway.modules.length - 1) {
      return pathway.modules[currentIndex + 1].id;
    } else if (direction === 'prev' && currentIndex > 0) {
      return pathway.modules[currentIndex - 1].id;
    }
    
    return null;
  };
  
  // Navigation handlers
  const handleNextModule = () => {
    const nextModuleId = getAdjacentModule('next');
    if (nextModuleId) {
      navigate(`/mypath/pathway/${pathwayId}/module/${nextModuleId}`);
    }
  };
  
  const handlePrevModule = () => {
    const prevModuleId = getAdjacentModule('prev');
    if (prevModuleId) {
      navigate(`/mypath/pathway/${pathwayId}/module/${prevModuleId}`);
    }
  };
  
  // Calculate if next/prev are available
  const hasPrevious = !!getAdjacentModule('prev');
  const hasNext = !!getAdjacentModule('next');
  
  return (
    <div>
      {/* Navigation controls */}
      <div className={cn(
        "flex justify-between mb-4",
        isJungleTheme ? "text-green-300" : ""
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevModule}
          disabled={!hasPrevious}
          className={cn(
            "flex items-center px-2", 
            !hasPrevious && "opacity-50 cursor-not-allowed",
            isJungleTheme ? "text-green-400 hover:text-green-300 hover:bg-green-900/30 disabled:text-green-900" : ""
          )}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextModule}
          disabled={!hasNext}
          className={cn(
            "flex items-center px-2",
            !hasNext && "opacity-50 cursor-not-allowed",
            isJungleTheme ? "text-green-400 hover:text-green-300 hover:bg-green-900/30 disabled:text-green-900" : ""
          )}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  );
}