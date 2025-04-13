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
    sm: 16,
    md: 20,
    lg: 24,
  };
  
  // Handle button click
  const handleClick = () => {
    startTour(tourId);
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            className={cn(
              'rounded-full',
              'hover:scale-105 transition-transform',
              position === 'fixed' && 'fixed bottom-20 right-6 z-50 shadow-md',
              className
            )}
            aria-label={tooltipText}
          >
            <HelpCircle 
              size={iconSizes[size]} 
              className={size === 'sm' ? 'mr-0' : 'mr-1'} 
            />
            {size !== 'sm' && <span>Tour</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}