import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useTour } from '@/contexts/tours/tour-context';
import { cn } from '@/lib/utils';
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
  
  // Size mapping for lucide icon
  const iconSizes = {
    default: 20,
    sm: 16,
    lg: 24,
    icon: 18,
  };
  
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
          <div
            onClick={handleClick}
            className={cn(
              'cursor-pointer text-primary',
              'hover:scale-110 transition-transform',
              position === 'fixed' && 'fixed bottom-20 right-6 z-50 bg-white p-2 rounded-full shadow-md',
              className
            )}
            aria-label={tooltipText}
          >
            <HelpCircle 
              size={iconSizes[size]} 
              className="hover:text-primary/80"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}