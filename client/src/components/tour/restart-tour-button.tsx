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
            className={`${position === 'fixed' ? 'fixed top-4 right-4 z-50' : ''} 
                        rounded-full w-8 h-8 p-0 hover:bg-primary/10 
                        text-muted-foreground hover:text-primary
                        ${className}`}
            aria-label="Restart tour"
            {...props}
          >
            <HelpCircle className="h-5 w-5" />
            {showLabel && <span className="ml-2">Help</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RestartTourButton;