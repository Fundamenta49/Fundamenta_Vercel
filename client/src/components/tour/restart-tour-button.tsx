import React from 'react';
import { useTour } from '@/contexts/tour-context';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RestartTourButtonProps {
  showLabel?: boolean;
  tooltipText?: string;
  position?: 'fixed' | 'absolute' | 'relative';
  className?: string;
}

const RestartTourButton = ({ 
  showLabel = false, 
  tooltipText = 'Restart Tour',
  position = 'fixed',
  className = '',
}: RestartTourButtonProps) => {
  const { restartTour } = useTour();

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={restartTour}
            className={`restart-tour-button-container ${position === 'fixed' ? 'fixed top-4 left-4 z-[9999]' : ''} 
                       cursor-pointer flex items-center justify-center 
                       w-10 h-10 
                       text-primary hover:text-primary-dark
                       ${className}`}
            role="button"
            aria-label="Restart tour"
          >
            <HelpCircle className="h-6 w-6" />
            {showLabel && <span className="ml-2">Help</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RestartTourButton;