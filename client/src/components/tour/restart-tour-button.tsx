import React from 'react';
import { useTour } from '@/contexts/tour-context';
import { Button, ButtonProps } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RestartTourButtonProps extends ButtonProps {
  showLabel?: boolean;
  tooltipText?: string;
  position?: 'fixed' | 'absolute' | 'relative';
}

const RestartTourButton = ({ 
  showLabel = false, 
  tooltipText = 'Restart Tour',
  position = 'fixed',
  className,
  ...props 
}: RestartTourButtonProps) => {
  const { restartTour } = useTour();

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={restartTour}
            className={`${position === 'fixed' ? 'fixed top-4 left-4 z-[9999]' : ''} 
                        bg-transparent border-none shadow-none
                        rounded-full w-10 h-10 p-0 
                        text-primary hover:text-primary-dark
                        ${className}`}
            aria-label="Restart tour"
            {...props}
          >
            <HelpCircle className="h-6 w-6" />
            {showLabel && <span className="ml-2">Help</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RestartTourButton;